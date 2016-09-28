var crypto = require('crypto'),//可用crypto模块生成散列值来加密密码
    User = require('../models/user.js'),
    Post=require('../models/post.js'),
    Comment=require('../models/comment.js'),
    multer  = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, './public/images')
    },
    filename: function (req, file, cb){
        cb(null, file.originalname)
    }
});
var upload = multer({
    storage: storage
});

module.exports = function(app) {

  app.get('/', function (req, res) {
    res.render('login', {
        title: '登录',
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()});
  });
  app.post('/', function (req, res) {
    console.log("1111");
      var md5=crypto.createHash('md5');
          password=md5.update(req.body.password).digest('hex');
      //检查用户是否存在
      User.get(req.body.name,function(err,user){
        if(!user){
          req.flash('error','用户不存在！');
          return res.redirect('/login');
        }
        if(user.password!=password){
          req.flash('error','密码错误！');
          return res.redirect('/login');
        }
        //用户名密码都匹配后，将用户信息存入session
        req.session.user=user;
        req.flash('success','登陆成功！');
        res.redirect('/index');
      });    
  });
  app.get('/index', function (req, res) {
     Post.getAll(null,function(err,posts){
        if(err){
          posts=[];
        }
        Post.getTags(function(err,tags){
          if(err){
            req.flash('error',err);
            return res.redirect('/index');
          }
          res.render('index',{
            title:"主页",
            user:req.session.user,
            posts:posts,
            tags:tags,
            success:req.flash('success').toString(),
            error:req.flash('error').toString()
          });
        });
     });
  });

  app.get('/reg', function (req, res) {
    res.render('reg', {
      title: '注册',
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });

  app.post('/reg', function (req, res) {
      var name = req.body.name,
          password=req.body.password,
          password_re=req.body['password-repeat'];

      //检验用户两次输入的密码是否一致
      if(password_re!=password){
        req.flash('error','两次输入的密码不一致！');
        return req.redirect('/reg');//返回注册页
      }
      //生成密码的md5(把一个任意长度的字符串换成一定长的十六进制数字串)值
      var md5 = crypto.createHash('md5'),
          password = md5.update(req.body.password).digest('hex');
      
      var newUser = new User({
          name:name,
          password:password,
          email:req.body.email
      });
      //检查用户名是否已经存在
      User.get(newUser.name,function(err,user){       
        if(err){
          req.flash('err',err);
          return res.redirect('/');
        }
        if(user){
          req.flash('error','用户已存在！');
          return res.redirect('/reg');
        }
        
        //如果不存在则新增用户
        newUser.save(function(err,user){
          if(err){
            req.flash('error',err);
            return res.redirect('/reg');
          }
          req.session.user = newUser; //用户信息存入session
          req.flash('success','注册成功！');
          res.redirect('/index');//注册成功返回主页
        });
      });
  });

  app.get('/post',function(req,res){
  	 res.render('post', {
      title: '发表',
      user:req.session.user,
      error:req.flash('error').toString(),
      success:req.flash('success').toString()
      });
  });

  app.post('/post',function(req,res){
      var currentUser = req.session.user,
          // classify=req.body.classify,
          tags=[req.body.tag1,req.body.tag2,req.body.tag3],
          post = new Post(currentUser.name,req.body.title,tags, req.body.post);
      post.save(function (err) {
        if (err) {
          req.flash('error', err); 
          return res.redirect('/index');
        }
        req.flash('success', '发布成功!');
        res.redirect('/preview');//发表成功跳转到主页
      });
  });

  app.get('/preview', function (req, res) {
     Post.getAll(null,function(err,posts){
        if(err){
          posts=[];
        }
        res.render('preview', {
          title: '主页',
          user: req.session.user,
          posts:posts,
          success: req.flash('success').toString(),
          error: req.flash('error').toString()
        });
     });
  });

  app.get('/upload', function (req, res) {
      res.render('upload', {
        title: '文件上传',
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
      });
  });

  app.post('/upload', upload.array('field1', 5), function (req, res) {
      req.flash('success', '文件上传成功!');
      res.redirect('/upload');
  });

  app.get('/search',function(req,res){
    Post.search(req.query.keyword,function(err,posts){
      if(err){
        req.flash('error',err);
        return res.redirect('/index');
      }
      res.render('search',{
        title:"SEARCH:"+req.query.kayword,
        posts:posts,
        user:req.session.user,
        success:req.flash('success').toString(),
        error:req.flash('error').toString()
      });
    });
  });

  app.get('/u/:name',function(req,res){
    //检查用户是否存在
    User.get(req.params.name,function(err,user){
      if(!user){
        req.flash('error','用户不存在！');
        return res.redirect('/index');
      }
      //查询并返回该用户的所有文章
      Post.getAll(user.name,function(err,posts){
        if(err){
          req.flash('error',err);
          return res.redirect('/index');
        }
        res.render('user',{
          title:user.name,
          posts:posts,
          user:req.session.user,
          success:req.flash('success').toString(),
          error:req.flash('error').toString()
        });
      });
    });
  });

  app.get('/u/:name/:classify',function(req,res){
      //查询并返回该分类的所有文章
      // console.log("aaaaaaaaaaaaaaaa");
      Post.getClassifyAll(req.params.name,req.params.classify,function(err,posts){
        if(err){
          console.log(err);
          req.flash('error',err);
          return res.redirect('/index');
        }
        res.render('classify',{
          title:req.params.classify,
          posts:posts,
          user:req.session.user,
          success:req.flash('success').toString(),
          error:req.flash('error').toString()
        });
      });
  });

  app.get('/u/:name/:day/:title', function (req, res) {
    Post.getOne(req.params.name, req.params.day, req.params.title, function (err, post) {
      if (err) {
        req.flash('error', err); 
        return res.redirect('/index');
      }
      res.render('article', {
        title: req.params.title,
        post: post,
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
      });
    });
  });

  app.post('/u/:name/:day/:title', function (req, res) {
    var date = new Date(),
        time = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + 
               date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
    var comment = {
        name: req.body.name,
        email: req.body.email,
        website: req.body.website,
        time: time,
        content: req.body.content
    };
    var newComment = new Comment(req.params.name, req.params.day, req.params.title, comment);
    newComment.save(function (err) {
      if (err) {
        req.flash('error', err); 
        return res.redirect('back');
      }
      req.flash('success', '留言成功!');
      res.redirect('back');
    });
  });

  app.get('/edit/:name/:day/:title',function(req,res){
    var currentUser=req.session.user;
    Post.edit(currentUser.name,req.params.day,req.params.title,function(err,post){
      if(err){
        req.flash('error',err);
        return res.redirect('back');
      }
      res.render('edit',{
        title:'编辑',
        post:post,
        user:req.session.user,
        success:req.flash('success').toString(),
        error:req.flash('error').toString()
      });
    });
  });

  app.post('/edit/:name/:day/:title', function (req, res) {
    var currentUser = req.session.user;
    Post.update(currentUser.name, req.params.day, req.params.title, req.body.post, function (err) {
      var url = encodeURI('/u/' + req.params.name + '/' + req.params.day + '/' + req.params.title);
      if (err) {
        req.flash('error', err); 
        return res.redirect(url);//出错！返回文章页
      }
      req.flash('success', '修改成功!');
      res.redirect(url);//成功！返回文章页
    });
  });

  app.get('/remove/:name/:day/:title', function (req, res) {
    var currentUser = req.session.user;
    Post.remove(currentUser.name, req.params.day, req.params.title, function (err) {
      if (err) {
        req.flash('error', err); 
        return res.redirect('/login');
      }
      req.flash('success', '删除成功!');
      res.redirect('/index');
    });
  });

  app.get('/tags/:tag',function(req,res){
    Post.getTag(req.params.tag,function(err,posts){
      if(err){
        req.flash('error',err);
        return res.redirect('/index');
      }
      res.render('tag',{
        title:'TAG:'+req.params.tag,
        posts:posts,
        user:req.session.user,
        success:req.flash('success').toString(),
        error:req.flash('error').toString()
      });
    });
  });

};

