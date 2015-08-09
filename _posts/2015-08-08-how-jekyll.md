---
layout: blog
title: 开头第一篇，使用jekyll搭建小型网站
author: dudu
subtitle: 个人博客的简单实现
headPicUrl: http://hbfile.b0.upaiyun.com/img/home/banner/8bdd5f0b7051d97168fb56af7dba9897f6606c4b7adb1
commens: true
category: [jekyll,github]
---
jekyll是github官方认可的一款静态blog生存器。只需按照github的规则，使用git-pages即使是在自己没有服务器的时候也能搭建一个项目主页或者个人主页。比起cnblog等其他博客站点来说，开发者可以享有更多的主动权。具有相同功能的还有最近比较火热的hexo，据说比jekyll更加简单，笔者还没有接触过，就不过多介绍了。

bootstrap的项目主页就是使用jekyll生成的，作为如此巨大项目文档的承载主页，可见jekyll功能强大之处。

按照自己搭建blog的顺序，我把本文分成以下几个部分：

1）环境搭建

2）美化样式

3）引入社交,绑定域名

##环境搭建
jekyll是基于ruby环境的生成器，mac用户本身内置了一个低版本的ruby，为了避免各种可能存在的问题，使用`rvm`安装一个stable版本的ruby十分重要。接着使用`gem`安装jekyll就ok了。

		1)$ curl -L https://get.rvm.io | bash -s stable
		2)$ source ~/.rvm/scripts/rvm
		3)rvm install stable
		4)gem install jekyll

github规则的目录结构一般长这样。

		-app
		 	_layout  		//布局，包裹在文章外部的模板
		 	_post    		//文章内容
		 	_include		//复用组件
		 	_site  			//生成的页面
			_config.yml  	//保存配置数据
*	其中post目录用来存放需要发布的博文正文，且必须满足 YYYY-MM-DD-name.html或者其他格式的命名规则。

*	layout文件夹用来存储基本的布局模板，按照一般的blog布局结构，通常区分为index.html和blog.html。

*	include文件夹用来包含一些可能会重复使用的部分，即可以被组件化的内容，比如导航，header，footer等内容。

*	site文件夹就是jekyll生成的文件夹了，最终在浏览器中显示的内容都是该文件夹中的内容，且文件格式全部都是完整的html文件。

*	config.yml是该项目的配置文件，开发者可以通过该文件配置与调试、生成、等各种内容。同时用户自己设置的全局配置也可以放在这里。该文件夹的的内容可以通过{{ site.content }}获得。

当然我们还要引入一些自动化工具，grunt，rb工具都可以往里面加，但是要注意的是github会禁用不信任的线上插件。因为jekyll会在每次运行的时候都必须遍历一次全部文件，减少其在服务器上的工作量，对网页的生成速度应该会有一定帮助。

运行`jekyll serve` 在指定的地址就可以访问到生成的静态页面了。至此，简单的开发环境就已经搭建完成了。

##美化样式

jekyll使用的是增强了的liquid模板语言，基本语法比较简单就不单独介绍了，不过在使用过程中要注意，模板语言在解析内容时对格式要求非常高，在逻辑较为复杂时要特别注意格式书写。

post文件夹正文格式一般如下：

	---
	layout: blog
	title: 你好，世界
	author: dc
	subtitle: hello world
	headPicUrl: http://hbfile.b0.upaiyun.com/img/home/banner/8bdd5f0b7051d97168fb56af7dba9897f6606c4b7adb1
	commens: true
	---
	<h2>{{ page.title }}</h2>
	<p>我的第一篇文章我的第一篇文章我的第一篇文章我的第一篇文章我的第一篇文章</p>
	<p>{{ page.date | date_to_string }}</p>

在---之间的内容称为yaml头，jekyll以此来识别内容是不是一个特殊内容，在虚线之间我们可以自己设置一些自定义变量，在后续使用该页面中，我们可以在引用该页面的地方，通过`page.xxx`访问

*	注意`---`后面要确保没有空格，否则无法识别。

yaml头中layout指定了layout文件夹中的哪一个文件用来渲染该post。现在我们进入blog文件看一下。

```html
{% raw %}
<!DOCTYPE html>
<html>
<head>
    {% include head.html %}
</head>
<body>
    `{% include nav.html %}`
    `{% include eachBlogHeadPic.html %}`
    `{% include eachBlogContent.html %}`
    `{% include comments.html %}`
    `{% include foot.html %}`
</body>
</html>
{% endraw %}
```

通过include包含了众多组件化的内容，而post中的内容通过模板解析获得，但是在该文件内确不存在。在include文件夹中找一下，可以看到它在eachBlogContent中

	<article>
	    <div class="container">
	        <div class="row">
	            <div class="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1">
	                {{ content }}
	            </div>
	        </div>
	    </div>
	</article>

liquid带给前端界面代码的混乱，通过组件化的方式又变得清晰起来了。

在内容页完成后还需要设计首页，首页中一般用来展示所有文章列表，所以不可缺少list和相应的分页组件。
	在jekyll官网提供了这一分页的实现，方法也比较简单，我们就没有必要重造车轮了[分页功能] (http://jekyllcn.com/docs/pagination/)

在熟悉了代码的组织实现方式后，实现怎么样的界面效果就与普通的前端项目没有什么差异了。

此外，jekyll还支持以markdown和textile的方式书写内容，并且支持代码高亮。只需要两步简单的设置：

1）在config.yml中设置

	highlighter: pygments
	markdown: redcarpet
	redcarpet:
	  extensions:
	    - fenced_code_blocks
	    - no_intra_emphasis
	    - strikethrough
	    - autolink
	    - tables

2)下载`highlight.js`在footer.html引入。

highlight.js是一个支持上百种程序语言高亮的js插件，你也可以定制实现只针对自己常用语言的mini包

##引入社交，绑定域名
###引入社交
jelly blog作为一个静态网站，本身不存在数据库，其引入社交的方式也只能借助第三方工具。目前较为流行的是`disqus`,它提供了对用户社交内容的一战式管理，并且支持黑白名单，关键词过滤等等内容，功能强大，使用简单。

1）在`disqus`注册一个账号，并创建一个需要管理的网站。

2）把`disqus`生成的脚本添加到自建的网站上,此处把我把它放到footer中，并添加 `var disqus_identifier = window.location.href;`或者其他唯一性标签，确保disqus能够识别不同blog。

###绑定域名
绑定域名非常简单，两步操作，加上安静的等待十几分钟就OK了。

1）在域名服务商处购买一个可用域名，并在域名操作台设置一条A记录【用于绑定主域名】，并将这条A记录指定到github为我们提供的专门用来绑定gh-pages域名的ip[192.30.252.154]

2)在gh-pages分支下增加一个`CNAME`文件，且文件内容是我们刚刚购买的域名。

至此，基于jekyll的小型网站就已经搭建完毕了，后续依旧可以有很多工作可以做，比如引入统计，增加草稿功能，增加互动，甚至使用自己的服务器在线生成jekyll网站。
