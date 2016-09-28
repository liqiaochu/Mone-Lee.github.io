var mongodb = require('./db'),
    markdown = require('markdown').markdown;

// function Post(name,classify, title, post) {
//   this.name = name;
//   this.classify=classify;
//   this.title = title;
//   this.post = post;
// }
function Post(name,title,tags,post){
  this.name=name;
  this.title=title;
  this.tags=tags;
  this.post=post;
}

module.exports = Post;

//存储一篇文章及其相关信息
Post.prototype.save = function(callback) {
  var date = new Date();
  //存储各种时间格式，方便以后扩展
  var time = {
      date: date,
      year : date.getFullYear(),
      month : date.getFullYear() + "-" + (date.getMonth() + 1),
      day : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
      minute : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + 
      date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()), 
      comments:[]
  }
  //要存入数据库的文档
  // var post = {
  //     name: this.name,
  //     classify:this.classify,
  //     time: time,
  //     title: this.title,
  //     post: this.post
  // };
  var post = {
    name: this.name,
    time: time,
    title:this.title,
    tags: this.tags,
    post: this.post,
    comments: [],
    // reprint_info:{},
    pv: 0
  };
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //读取 posts 集合
    db.collection('posts', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //将文档插入 posts 集合
      collection.insert(post, {
        safe: true
      }, function (err) {
        mongodb.close();
        if (err) {
          return callback(err);//失败！返回 err
        }
        callback(null);//返回 err 为 null
      });
    });
  });
};

//读取一个人的所有文章（传参name）及其相关信息，获取所有人的全部文章（不传参）
Post.getAll = function(name, callback) {
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //读取 posts 集合
    db.collection('posts', function(err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      var query = {};
      if (name) {
        query.name = name;
      }
      //根据 query 对象查询文章
      collection.find(query).sort({
        time: -1
      }).toArray(function (err, docs) {
        mongodb.close();
        if (err) {
          return callback(err);//失败！返回 err
        }
        //解析markdown为html
        docs.forEach(function(doc){
          if(doc.post){
            doc.post = markdown.toHTML(doc.post);
          }
        })
        callback(null, docs);//成功！以数组形式返回查询的结果
      });
    });
  });
};

//读取同一分类的所有文章（传参classify）及其相关信息
Post.getClassifyAll = function(name,classify, callback) {
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //读取 posts 集合
    db.collection('posts', function(err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      var query = {};
      if (classify) {
        query.name=name
        query.classify = classify;
      }
      //根据 query 对象查询文章
      collection.find(query).sort({
        time: -1
      }).toArray(function (err, docs) {
        mongodb.close();
        if (err) {
          return callback(err);//失败！返回 err
        }
        //解析markdown为html
        docs.forEach(function(doc){
          if(doc.post){
            doc.post = markdown.toHTML(doc.post);
          }
        })
        callback(null, docs);//成功！以数组形式返回查询的结果
      });
    });
  });
};

//获取一篇文章
Post.getOne = function(name, day, title, callback) {
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //读取 posts 集合
    db.collection('posts', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //根据用户名、发表日期及文章名进行查询
      collection.findOne({
        "name": name,
        "time.day": day,
        "title": title
      }, function (err, doc) {
        if (err) {
          mongodb.close();
          return callback(err);
        }
        if (doc) {
          //每访问 1 次，pv 值增加 1
          collection.update({
            "name": name,
            "time.day": day,
            "title": title
          }, {
            $inc: {"pv": 1}
          }, function (err) {
            mongodb.close();
            if (err) {
              return callback(err);
            }
          });
          //解析 markdown 为 html
          doc.post = markdown.toHTML(doc.post);
          doc.comments.forEach(function (comment) {
            comment.content = markdown.toHTML(comment.content);
          });
          callback(null, doc);//返回查询的一篇文章
        }
      });
    });
  });
};

//返回原始发表的内容（markdown格式）
Post.edit=function(name,day,title,callback){
  //打开数据库
  mongodb.open(function(err,db){
    if(err){
      return callback(err);
    }
    //读取posts集合
    db.collection('posts',function(err,collection){
      if(err){
        mongodb.close();
        return callback(err);
      }
      //根据用户名、发表日期及文章名进行查询
      collection.findOne({
        "name":name,
        "time.day":day,
        "title":title
      },function(err,doc){
        mongodb.close();
        if(err){
          return callback(err);
        }
        callback(null,doc);//返回查询的一篇文章（markdown形式）
      });
    });
  });
};

//更新一篇文章及其相关信息
Post.update = function(name, day, title, post, callback) {
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //读取 posts 集合
    db.collection('posts', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //更新文章内容
      collection.update({
        "name": name,
        "classify":classify,
        "time.day": day,
        "title": title
      }, {
        $set: {post: post}
      }, function (err) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        callback(null);
      });
    });
  });
};

//删除一篇文章
Post.remove = function(name, day, title, callback) {
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //读取 posts 集合
    db.collection('posts', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //根据用户名、日期和标题查找并删除一篇文章
      collection.remove({
        "name": name,
        "time.day": day,
        "title": title
      }, {
        w: 1
      }, function (err) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        callback(null);
      });
    });
  });
};

//返回所有标签
Post.getTags = function(callback) {
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    db.collection('posts', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //distinct 用来找出给定键的所有不同值
      //把collection中所有tags[]中的值去重后传给docs
      collection.distinct("tags", function (err, docs) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        callback(null, docs);
      });
    });
  });
};

//返回含有特定标签的所有文章
Post.getTag=function(tag,callback){
  mongodb.open(function(err,db){
    if(err){
      return callback(err);
    }
    db.collection('posts',function(err,collection){
      if(err){
        mongodb.close();
        return callback(err);
      }
      //查询所有tags数组内包含tag的文档
      //并返回只含有name、time、title组成的数组
      collection.find({
        "tags":tag
      },{
        "name":1,
        "time":1,
        "title":1
      }).sort({
        time:-1
      }).toArray(function(err,docs){
        mongodb.close();
        if(err){
          return callback(err);
        }
        callback(null,docs);
      });
    });
  });
};

//返回通过标题关键字查询的所有文章信息
Post.search=function(keyword,callback){
  mongodb.open(function(err,db){
    if(err){
      return callback(err);
    }
    db.collection('posts',function(err,collection){
      if(err){
        mongodb.close();
        return callback(err);
      }
      var pattern=new RegExp(keyword,"i");
      collection.find({
        "title":pattern
      },{
        "name":1,
        "time":1,
        "title":1
      }).sort({
        time:-1
      }).toArray(function(err,docs){
        mongodb.close();
        if(err){
          return callback(err);
        }
        callback(null,docs);
      })
    })
  })
}

//转载当前文章
// Post.reprint=function(reprint_from,reprint_to,callback){
//   mongodb.open(function(err,db){
//     if(err){
//       return callback(err);
//     }
//     db.collection('posts',function(err,collection){
//       if(err){
//         mongodb.close();
//         return callback(err);
//       }
//       //根据传入的数据(reprint_from)找到要被转载的当前文章的文档
//       collection.findOne({
//         "name":reprint_from.name,
//         "time.day":reprint_from.day,
//         "title":reprint_from.title
//       },function(err,doc){    //复制要被转载的文章的文档传入变量doc
//         if(err){
//           mongodb.close();
//           return callback(err);
//         }

//         var date=new Date();
//         var time={
//           date:date,
//           year:date.getFullYear(),
//           month:date.getFullYear()+"-"+(date.getMonth()+1),
//           day:date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate(),
//           minute:date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+
//               date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
//         }

//         //修改原文档副本(doc)后以新文档(作为转载得到新文档)的形式存入数据库
//         delete doc._id; //注意要删除原来的 _id

//         doc.name=reprint_to.name;
//         doc.time=time;
//         doc.title=(doc.title.search(/[转载]/)>-1)?doc.title:"[转载]"+doc.title;
//         doc.comments=[];
//         doc.reprint_info={"reprint_from":reprint_from};   //记录转载自哪里
//         doc.pv=0;

//         //更新被转载的原文档(真· 原文档)的reprint_info内的reprint_to,记录被谁转载
//         collection.update({
//           "name":reprint_from.name,
//           "time.day":reprint_from.day,
//           "title":reprint_from.title
//         },{
//           $push:{
//             "reprint_info.reprint_to":{
//               "name":doc.name,
//               "day":time.day,
//               "title":doc.title
//             }
//           }
//         },function(err){
//           if(err){
//             mongodb.close();
//             return callback(err);
//           }
//         });

//         //将副本(doc)存入数据库，并返回存储后的文档
//         collection.insert(doc,{
//           safe:true
//         },function(err,post){
//           mongodb.close();
//           if(err){
//             return callback(err);
//           }
//           callback(err,post[0]);
//         });
//       });
//     });
//   });
// };
