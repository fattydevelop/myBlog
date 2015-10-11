---
layout: blog
title: vue组件化开发实践(二)
author: dudu
subtitle: 从单元测试到业务构成
headPicUrl: http://hbfile.b0.upaiyun.com/img/home/banner/8bdd5f0b7051d97168fb56af7dba9897f6606c4b7adb1
commens: true
category: [vue,karma，node]
---
#vue UI库开发实践（二）

##单元测试
上一节讲述了基本项目的搭建步骤，vue项目的搭建就不在赘述了，我采取的搭建方式vue-loader的单文件方式，单个组件是以下面这种形式组织

```javascript
	<style lang='less'>
		div{
		}
	</style>
	<template>
	<div></div>
	</template>
	<script>
		module.exports = {
			methods:{
			}
		}
	</script>
```
在使用require引入组件的时候我们会发现报错，这是因为这类代码既不是commonjs规范也不能直接用来测试，因此需要特殊的配置使用karma测试。

vue官网上提供了单元测试的方法，要求我们用commonjs的方式组织代码，抛弃`*.vue`文件格式，可以参考<http://cn.vuejs.org/guide/application.html#单元测试>。

为了单元测试而放弃vue文件清晰的书写方式是有些得不偿失的。既然vue文件本身通过webpack的vue-loader可以被打包成可以执行的代码，为什么不能再测试前对其打包，从而在测试代码中`require`相应的组件。

对`karma.conf.js`再次配置：

```javascript
	webpack:{
	      module: {
	        loaders: [
	          { test: /\.vue$/, loader: 'vue' },
	          { test:/\.less$/, loader: 'style!css!less' }
	        ]
	      }
	    },
	preprocessors: {
	      'src/*.js':['webpack'],
	      'src/**/*.vue':['webpack'],
	      'test/*.js':['webpack']
	    },

```

最终我们的测试代码是这样子的：

```javascript
var assert = require("assert");
describe('Array', function() {
    var vleft = require('../src/components/v-left.vue')
    it('should be a function',function(){
        assert.equal('function',typeof vleft.methods.expandList)
    })
});
```
使用这种测试方案我们，可以清晰的对组件方法和数据进行单元测试。不同于`qunit`可以对dom方法的测试，`mocha`本身没有提供对dom的测试方法，如果需要测试的话需要引入其他组件。就目前来说，大部分组件的dom变化都是以组件本身的状态实现，暂时没有对dom测试的必要。

##demo

####树状导航条

```javascript
<template>
    <div class="mainLeft" id="cssmenu">
        <ul class="navBar">
          <li v-repeat="option in options" v-on="click:expandList" v-class="has-sub:option.child">
            <a href={{option.url}}>{{option.name}}</a>
            <ul v-if="option.child">
                <li v-repeat="child in option.child"  v-class="has-sub:child.parChild">
                    <a href={{child.url}}>{{child.name}}</a>
                     <ul v-if="child.parChild">
                       <li v-repeat="parChild in child.parChild">
                          <a href={{parChild.url}}>{{parChild.name}}</a>
                       </li>
                     </ul>
                </li>
            </ul>
          </li>
        </ul>
    </div>
</template>

<script>
    module.exports = {
        methods:{
            expandList:function(e){
               e.stopPropagation();
               e=e.target;
               var self = $(e).parent('li');
               if(!self.hasClass('has-sub'))
                    return;
               var ulTemp = $(self.find('ul')[0]);
               if(self.hasClass('open')){
                  ulTemp.slideUp(200);
                  self.removeClass('open');
               }
               else{
                  ulTemp.slideDown(200);
                  self.addClass('open');
               }
            }
        },
        data:function(){
        },
   }
   </script>
```

项目地址：<https://github.com/fattydevelop/componentByVue>