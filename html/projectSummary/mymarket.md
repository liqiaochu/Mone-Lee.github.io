##总结1：学校工作室项目--我家菜市（后台网站）
作者：*李梦仪*       
时间：*2016-10-25 16:47*

**1、网页效果展示**

* 商品信息编辑页 ![商品信息编辑页](../../images/editGoods.png)
* 商品列表管理页 ![商品列表管理页](../../images/goodsAdmin.png)
* 商品评论管理页 ![商品评论管理页](../../images/commentsAdmin.png)
* 商品消息编辑页 ![商品消息编辑页](../../images/editMessages.png)
* 商品未发布消息管理页 ![商品未发布消息管理页](../../images/notSendMessages.png)
* 商品已发布消息管理页 ![商品已发布消息管理页](../../images/releasedMessages.png)

**2、后台网页框架搭建**

这个系列的网页都可看做由3个部分组成：
![网页框架](../../images/frameset.png)

搭建步骤是：先分别实现由part 1(顶部 header.html)和part 2(左侧导航栏 asider.html)组成的所有页面的共同部分，然后通过`<frameset>、<frame>`标签分别引入这三个部分。例：
```html
<frameset cols="183px,*" framesetBorder="0" border=0>
    <frame src="./block/asider.html" name="asiderFrame" scrolling="no" noresize="noresize" id="asiderFrame">
    <frameset rows="60px,*">
        <frame src="./block/header.html" name="headerFrame" scrolling="no" noresize="noresize" id="headerFrame">
        <frame src="./views/****.html">
    </frameset>
</frameset>
```
这一部分需要注意的地方是：**`<body></body>` 标签与 `<frameset></frameset>` 标签不能同时使用！**即`<head></head>`标签后接`<frameset></frameset>`标签而不是`<body></body>` 标签。

**3、后台网页实现技术要点**

