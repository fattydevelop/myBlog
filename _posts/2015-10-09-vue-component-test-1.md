---
layout: blog
title: vue UI库开发实践（一）
author: dudu
subtitle: 组件化的应用尝试
headPicUrl: http://hbfile.b0.upaiyun.com/img/home/banner/8bdd5f0b7051d97168fb56af7dba9897f6606c4b7adb1
commens: true
category: [vue,component]
---
#vue UI库开发实践（一）
vue本身就不用过多介绍了，之所以使用vue进行UI库的开发是希望能够做一套方便自己日常使用的UI库，在使用vue做MV*开发的时候能够直接使用，而无需为基础的组件发愁。

整体项目的思路也非常简单：选取一些使用场景比较多的优秀组件，将其组件化，可以通过自定义标签方便调用。主要会参考bootstrap3的组件。github有一个类似的项目<http://yuche.github.io/vue-strap/>，貌似实现了bo3的全部组件，但是还在预览版阶段，相应的单元测试还没有补齐。

##项目搭建
组件化的vue开发一般选择使用webpack+vue-loader‘或者Browserify + vueify，后面这种以前已经搭建过了，迎接新时代，本次使用webpack搭建项目环境。
首先看一下搭建好的项目结构： 
![Alt text](./1444291876939.png)
 文件目录很清晰，就不做解释了。有三个关键性的配置文件

*	`package.json`
*	`webpack.conf.js`
*	`karma.conf.js`

有过前端自动化工具使用经验的童鞋都知道package文件使用来指明包依赖和项目基本信息的。使用webpack时可以在package中添加

	`"scripts": {
			    "dev": "webpack-dev-server --progress --colors",
			    "build": "webpack -p"
	  },`
 来指定需要运行的命令，因为开发需要我添加了两个命令，其中dev命令用于livereload，方便开发。

`webpack.conf.js`

	module.exports = {
    entry: './src/main.js',
    output: {
        filename: './build/build.js'
    },
    module: {
        loaders: [
            { test: /\.vue$/, loader: 'vue' },
            { test:/\.less$/, loader: 'style!css!less' }
        ]
    }
	}
配置文件中指明了文件的入口和输出，以及应对不同类型文件的loader。

`karma.conf.js`
karma是一个测试执行过程管理工具，不同于qunit，它并不是一个测试框架，而是管理测试框架的工具，通过karma我们可以选择是用测试框架和断言方法，此处我使用的是mocha和assert断言。

通过脚手架会自动生成相应的配置文件，不过要注意的是，为了书写CommonJS格式单元测试，我们需要将测试代码预处理，增加：

	 preprocessors: {
	      'test/*_test.js':['webpack']
	    },

同时，需要依赖的组件也必须在配置文件中指明。 

	plugins: [
	      require("karma-webpack"),
	      require("karma-mocha"),
	      require("karma-spec-reporter"),
	      require("karma-chrome-launcher")
	    ]

下一部分将会以一个下拉菜单作为demo，继续组件开发实践。
