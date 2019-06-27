import fetch from '../util/fetch'
var qs=require('qs');

export function login(id){
  const data=qs.stringify({
    id
  })
  return fetch({
    url: '/bozhi_handphp/index.php?s=/Little/Info/message_info',
    method: 'post',
    data
  });
}
//微信jsdk授权分享
export function wxjdk(url){
  return fetch({
    url: '/diary/api/getWxConfig?url='+url,
    method: 'get',
  });
}

//
export function codeRequest(){
   var code=getQueryString('code');
   console.log(code)
  var url1=location.href.slice(0,44);
   var url2=location.href.slice(-1,-6);
   var url=url1+url2;
     console.log(url);
  // window.navigator.userAgent属性包含了浏览器类型、版本、操作系统类型、浏览器引擎类型等信息，这个属性可以用来判断浏览器类型
   var ua = window.navigator.userAgent.toLowerCase();
   //通过正则表达式匹配ua中是否含有MicroMessenger字符串
   if(ua.match(/MicroMessenger/i) == 'micromessenger'){
     if(url.indexOf('code')<0){
       window.location.href ='https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx38aa092e5681b9d5&redirect_uri='+encodeURIComponent(url)+'&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect'
     }else if(url.indexOf('code')>-1){
       localStorage.setItem('wechatcode',getQueryString('code'))
     }
   }else{
     console.log(1);
   }
}
//
export function getQueryString(name){
  var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
  // console.log(window.location.search);
  var r = window.location.search.substr(1).match(reg);
  // console.log(r);
  if(r!=null) return unescape(r[2]);return null;
}
//php获取code接口
export function getCodes(){
  return fetch({
    url:'/diary/php/java_test.php',
    method:'get'
  })
}
//请求code接口
export function getCode(){
  return fetch({
    url:'/diary/api/wxLogin',
    method:'get'
  })
}

//发布中的标签
export function tag(){
  return fetch({
    url:'/diary/api/diary/category',
    method:'get'
  })
}
//首次发布日记
export function release(content,type,status,catIds,imgs){
  const data={
    content,type,status,catIds,imgs
  }
  return fetch({
    url:'/diary/api/diary/post',
    method:'post',
    data:data
  })
}
//编辑后发布日记
export function releases(id,content,type,status,catIds,imgs){
  const data={
    id,content,type,status,catIds,imgs
  }
  return fetch({
    url:'/diary/api/diary/put',
    method:'post',
    data:data
  })
}
//首页获取日记列表
export function getDiaryList(type,categoryId,page){
  return fetch({
    url:'/diary/api/home?type='+type+'&categoryId='+categoryId+'&page='+page,
    method:'get',
  })
}
//点赞
export function zan(id,flag){
  const data={
    id,flag
  }
  return fetch({
    url:'/diary/api/like/post',
    method:'post',
    data:data
  })
}
//日记详情
export function detail(id){
  return fetch({
    url:'/diary/api/diary/get/id?id='+id,
    method:'get',
  })
}
//关注
export function focus(userId,flag){
  const data={
    userId,flag
  }
  return fetch({
    url:'/diary/api/fans/post',
    method:'post',
    data:data
  })
}
//评论
export function ping(id,flag,content){
  //flag 1-评论日记、2-评论其他人的评论
  const data={
    id,flag,content
  }
  return fetch({
    url:'/diary/api/comment/post',
    method:'post',
    data:data
  })
}
//举报页列表
export function reportList(){
  return fetch({
    url:'/diary/api/complain/get',
    method:'get'
  })
}
//举报
export function jubao(id,flag,content){
//flag 1-举报日记、2-举报评论
  const data={
    id,flag,content
  }
  return fetch({
    url:'/diary/api/complain/diaryOrComment',
    method:'post',
    data:data
  })
}
//收藏
export function shoucang(id,flag){
  //flag 1-收藏、0-取消收藏
  const data={
    id,flag
  }
  return fetch({
    url:'/diary/api/collect/post',
    method:'post',
    data:data
  })
}

//我的收藏
export function myCollect(){
  return fetch({
    url:'/diary/api/collect/get',
    method:'get',
  })
}

//我的收藏
export function myGood(page){
  return fetch({
    url:'/diary/api/diary/get/userId?page='+page,
    method:'get',
  })
}

//个人中心
export function mains(){
  return fetch({
    url:'/diary/api/user/get',
    method:'get'
  })
}
//我的关注
export function myGuan(flag){
 //flag 1-关注列表、2-粉丝列表
  return fetch({
    url:'/diary/api/fans/get?flag='+flag,
    method:'get'
  })
}
//时间提醒
export function timeTi(){
  return fetch({
    url:'/diary/api/user/remind',
    method:'get'
  })
}
//设定时间提醒
export function setTime(hour,minute,flag){
  //flag 0-不提醒、1-提醒
  // const data={
  //   hour,minute,flag
  // }
  return fetch({
    url:'/diary/api/user/remind/put?hour='+hour+'&minute='+minute+'&flag='+flag,
    method:'get',
    // data:data
  })
}

//我的发布
export function mySend(type,page){
  return fetch({
    url:'/diary/api/diary/get/type?type='+type+'&page='+page,
    method:'get',
  })
}
export function mySends(date){
  return fetch({
    url:'/diary/api/diary/get/createAt/userId?date='+date,
    method:'get',
  })
}
//我的消息
export function myMsg(page,flag){
  return fetch({
    url:'/diary/api/message/get?page='+page+'&flag='+flag,
    method:'get'
  })
}
//删除消息
export function delMsg(id){
  // const data={
  //   id
  // }
  return fetch({
    url:'/diary/api/message/delete/'+id,
    method:'post',
    // data:data
  })
}

//删除日记
export function delDiary(id){

  return fetch({
    url:'/diary/api/diary/delete/'+id,
    method:'post',
  })
}

//获取个人主页

export function zhuye(id,page){

  return fetch({
    url:'/diary/api/user/get/id?id='+id+'&page='+page,
    method:'get',
  })
}

//私信
export function si(id,content){
  const data={
    id,content
  }
  return fetch({
    url:'/diary/api/message/post/first',
    method:'post',
    data:data
  })
}
//我的消息中私信回复
export function reSi(pid,content){
  const data={
    pid,content
  }
  return fetch({
    url:'/diary/api/message/post/next',
    method:'post',
    data:data
  })
}

//搜索

export function reSearch(flag,content,page,limit){
  return fetch({
    url:'/diary/api/search?flag='+flag+'&content='+content+'&page='+page+'&limit='+limit,
    method:'get',
  })
}

//编辑日记
export function editDiary(id){
  return fetch({
    url:'/diary/api/diary/find/id?id='+id,
    method:'get',
  })
}

//上传图片
export function upLoadImg(formData){
  // const data={
  //   files
  // }
  return fetch({
    url:'/diary/api/uploads',
    method:'post',
    data:formData
  })
}

//时间格式
export function formatDate(dates){
  var result=[];
  result[0]=dates.getFullYear();  //得到年份
  result[1]=dates.getMonth()+1;   //得到月份
  result[1]<10&&(result[1]="0"+result[1]);
  result[2]=dates.getDate();       //得到日期
  result[2]<10&&(result[2]="0"+result[2]);
  result=result.join("");
  var reg=/(\d{4})(\d{2})(\d{2})/;
  return result.replace(reg,"$1-$2-$3");
};
