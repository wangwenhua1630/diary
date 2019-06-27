<template>
    <div class="home">
       <div class="home_header">
          <div class="search">
            <div class="search_box">
              <input type="text" v-model="seTxt" class="search_input" placeholder="搜索文章/个人">
              <img src="../../assets/search.png" alt="" class="search_img">
            </div>
            <span class="search_cancel" @click="goSearch(seTxt)">确认</span>
          </div>
         <div class="nav">
           <div class="nav_box" :style="'width:' + (tagList.length+1)*1.87+ 'rem'">
             <div class="nav_item" :class="flag==0?'nav_active':''" @click="change(0,0)">全部</div>
             <div class="nav_item" v-for="(item,index) in tagList" :class="flag==index+1?'nav_active':''" @click="change(index+1,item.id)">{{item.content}}</div>
           </div>
           <!--<div class="nav_item" :class="flag==1?'nav_active':''" @click="change(1)">电影</div>-->
           <!--<div class="nav_item" :class="flag==2?'nav_active':''" @click="change(2)">笑话</div>-->
           <!--<div class="nav_item" :class="flag==3?'nav_active':''" @click="change(3)">音乐</div>-->
         </div>
       </div>
      <!--搜索日记列表-->
        <div class="c_lists">
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="loadMore"
            :immediate-check="false"
            :offset="10"
          >
            <div class="c_item" @click="goDetail(item.id)" v-for="(item,index) in lists">
            <!--收藏与举报-->
            <div class="tan_box" v-if="tan==index">
              <div class="tan_item" v-if="item.collectCount==0" @click.stop="collect(item.id,item.collectCount,index)">收藏</div>
              <div class="tan_item" v-if="item.collectCount>0" @click.stop="collect(item.id,item.collectCount,index)">取消收藏</div>
              <div class="tan_item" @click.stop="goReport(item.id,1)">举报</div>
            </div>
            <div class="c_item_header">
                <div class="c_item_left" @click.stop="goMy(item.userId)">
                  <img :src="item.img" alt="" class="c_item_userImg">
                  <div class="c_item_userName">{{item.name}}</div>
                </div>
                <img src="../../assets/more.png" alt="" class="c_item_right"  @click.stop="jumpTan(index)">
            </div>
            <div class="c_item_txt" style="-webkit-box-orient: vertical;">{{item.content}}</div>
           <!--超过四张图-->
            <div class="c_item_imgList" v-if="item.imgs.length!=4&&item.imgs.length!=1">
              <div class="c_item_img" v-for="(items,indexs) in item.imgs" @click.stop="lookImgs(item.imgs,indexs)">
                <img :src="items.img" alt="">
              </div>
            </div>
            <!----等于四张图-->
            <div class="c_item_imgList1" v-if="item.imgs.length==4">
              <div class="c_item_img1" v-for="(items,indexs) in item.imgs" @click.stop="lookImgs(item.imgs,indexs)">
                <img :src="items.img" alt="">
              </div>
            </div>
            <!--一张图时-->
            <div class="c_item_imgList" v-if="item.imgs.length==1" @click.stop="lookImgs(item.imgs,0)">
              <div class="c_item_imgOne" v-for="(items,indexs) in item.imgs">
              <img :src="items.img" alt="">
              </div>
            </div>
            <div class="c_item_btnGroup">
              <div class="good" @click.stop="dianzan(item.id,index)">
                <img src="../../assets/good_sel.png" alt="" v-if="item.likeStatus==0">
                <img src="../../assets/good_unsel.png" alt="" v-else>
                <span class="ti_num" v-if="item.likeCount">{{item.likeCount}}</span>
              </div>
              <div class="good">
                <img src="../../assets/comment.png" alt="">
                <span class="ti_num" v-if="item.commentCount">{{item.commentCount}}</span>
              </div>
              <div class="good" @click.stop="share(item.id)"><img src="../../assets/share.png" alt=""></div>
            </div>
          </div>
          </van-list>

        </div>

      <!--发布悬浮-->
      <div class="release_edit" @click="replease">
        <img src="../../assets/release.png" alt="" class="release_edit_img">
      </div>

      <!--发布弹出框-->
      <div class="release_edit_box" v-if="edit==1">
      </div>
      <div class="release_edit_aside" :class="edit==1?'aside_dong':''">
        <img src="../../assets/down.png" alt="" class="aside_down" @click="down">
        <div class="aside_list">
          <div class="aside_item" @click="goRelease(0)">
            <img src="../../assets/txt.png" alt="">
            <span>文字</span>
          </div>
          <div class="aside_item" @click="goRelease(2)">
            <img src="../../assets/img.png" alt="">
            <span>图片</span>
          </div>
          <div class="aside_item" @click="goRelease(1)">
            <img src="../../assets/txtimg.png" alt="">
            <span>图文</span>
          </div>
        </div>
      </div>
      <!--分享遮罩-->
      <div class="share_shadow" @click="close" v-if="shadow">
        <img src="../../assets/shares.png" alt="" style="width:80%;">
      </div>
    </div>
</template>

<script>
  import wx from 'weixin-js-sdk'
  import {getCode,getDiaryList,tag,zan,shoucang,wxjdk} from '../../api/api'

  import Vue from 'vue';
  import { ImagePreview } from 'vant';
  Vue.use(ImagePreview);
    export default {
        name: "home",
      data(){
          return{
            flag:0,
            edit:0,
            userFlag:0,
            lists:[],
            tan:-1,
            loading: false,
            finished: false,
            ye:1,
            tagList:[],
            ids:'',
            seTxt:'',
            shadow:false
          }
      },
      created(){
        getCode().then(res=>{
          console.log(res.data);
          if(res.data.flag){
            // alert(res.data)
            window.location.href=res.data.data;
          }else{
            if(sessionStorage.getItem('id')){
              var n=sessionStorage.getItem('id');
              this.$router.push({path:'/diarydetail',query:{id:n}});
            }else{
              //获取标签
              tag().then(res=>{
                if(res.data.flag){
                  this.tagList=res.data.data;
                }
              }).catch()
              //获取日记列表
              // this.$toast.loading({
              //   duration:0,
              //   message:'加载中'
              // })
              getDiaryList('','',this.ye).then(res=>{
                // this.$toast.clear();
                console.log(res);
                if(res.data.flag){
                  this.lists=res.data.data;
                }
              }).catch()

              var url=encodeURIComponent(encodeURIComponent(location.href.split('#')[0]));
              wxjdk(url).then(function(res){
                console.log(res);
                wx.config({
                  // 必须这么写，否则wx.invoke调用形式的jsapi会有问题
                  beat:true,
                  // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                  debug: false,
                  // 必填，公众号的唯一标识
                  appId: res.data.data.appId,
                  // 必填，生成签名的时间戳
                  timestamp:""+res.data.data.timestamp,
                  // 必填，生成签名的随机串
                  nonceStr:res.data.data.nonceStr,
                  // 必填，签名，见附录1
                  signature:res.data.data.signature,
                  // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                  jsApiList : ['onMenuShareAppMessage','onMenuShareTimeline']
                });
                //处理验证失败的信息
                wx.error(function (res) {
                  console.log(res)
                });
                //处理验证成功的信息
                wx.ready(function () {
                  //              alert(window.location.href.split('#')[0]);
                  //分享到朋友圈
                  wx.onMenuShareTimeline({
                    title:'日记本', // 分享标题
                    link: 'https://www.chayoueryuan.com/bozhi_h5/diary/#/home', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: 'https://www.chayoueryuan.com/bozhi_h5/img/logo.jpg', // 分享图标
                    success: function (res) {
                      // 用户确认分享后执行的回调函数
                      this.$toast("分享成功!")
                    },
                    cancel: function (res) {
                      // 用户取消分享后执行的回调函数
                      this.$toast("分享失败!")
                    }
                  });
                  //分享给朋友
                  wx.onMenuShareAppMessage({
                    title: '日记本', // 分享标题
                    desc: '记录心情，记录世界', // 分享描述
                    link: 'https://www.chayoueryuan.com/bozhi_h5/diary/#/home', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl:'https://www.chayoueryuan.com/bozhi_h5/img/logo.jpg', // 分享图标
                    success: function (res) {
                      // 用户确认分享后执行的回调函数
                      // this.$toast("分享成功!")
                    },
                    cancel: function (res) {
                      // 用户取消分享后执行的回调函数
                      // this.$toast("分享失败!")
                    }
                  });
                })
              })
            }
          }
        }).catch();
      },
      mounted(){

      },
      methods:{
          close(){
            this.shadow=false;
          },
          //分享
          share(id){
            var that=this;
            this.shadow=true;
            var url=encodeURIComponent(encodeURIComponent(location.href.split('#')[0]));
            wxjdk(url).then(function(res){
                console.log(res);
                wx.config({
                  // 必须这么写，否则wx.invoke调用形式的jsapi会有问题
                  beat:true,
                  // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                  debug: false,
                  // 必填，公众号的唯一标识
                  appId: res.data.data.appId,
                  // 必填，生成签名的时间戳
                  timestamp:""+res.data.data.timestamp,
                  // 必填，生成签名的随机串
                  nonceStr:res.data.data.nonceStr,
                  // 必填，签名，见附录1
                  signature:res.data.data.signature,
                  // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                  jsApiList : ['onMenuShareAppMessage','onMenuShareTimeline']
                });
                //处理验证失败的信息
                wx.error(function (res) {
                  console.log(res)
                });
                //处理验证成功的信息
                wx.ready(function () {
                  //              alert(window.location.href.split('#')[0]);
                  //分享到朋友圈
                  wx.onMenuShareTimeline({
                    title:'日记本', // 分享标题
                    link: 'https://www.chayoueryuan.com/bozhi_h5/diary/#/diarydetail?id='+id, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: 'https://www.chayoueryuan.com/bozhi_h5/img/logo.jpg', // 分享图标
                    success: function (res) {
                      // 用户确认分享后执行的回调函数
                      // this.$toast("分享成功!")
                    },
                    cancel: function (res) {
                      // 用户取消分享后执行的回调函数
                      // this.$toast("分享失败!")
                    }
                  });
                  //分享给朋友
                  wx.onMenuShareAppMessage({
                    title: '日记本', // 分享标题
                    desc: '记录心情，记录世界', // 分享描述
                    link: 'https://www.chayoueryuan.com/bozhi_h5/diary/#/diarydetail?id='+id, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl:'https://www.chayoueryuan.com/bozhi_h5/img/logo.jpg', // 分享图标
                    success: function (res) {
                      // 用户确认分享后执行的回调函数
                      // this.$toast("分享成功!")
                    },
                    cancel: function (res) {
                      // 用户取消分享后执行的回调函数
                      // this.$toast("分享失败!")
                    }
                  });
            })
            })
          },
        //切换
          change(e,ids){
            this.flag=e;
            this.ye=1;
            this.finished = false;
            this.ids=ids;
            this.$toast.loading({
              duration:0,
              message:'加载中'
            })
            getDiaryList('',ids,this.ye).then(res=>{
              this.$toast.clear();
              console.log(res);
              if(res.data.flag){
                this.lists=res.data.data;
              }
            }).catch()
          },
        goDetail(n){
          // sessionStorage.setItem('detailId',n)
          // this.$router.push('/diarydetail')
          this.$router.push({path:'/diarydetail',query:{id:n}});
          // this.$router.push({name:'diarydetail',params:{id:n}})
        },
        //跳转搜索
        goSearch(txt){
            sessionStorage.setItem('searchTxt',txt)
          this.$router.push('/search')
        },
        //收藏
        collect(id,count,index){
            if(count){
              shoucang(id,0).then(res=>{
                if(res.data.flag){
                  this.$toast({
                    message:'取消收藏'
                  })
                  this.lists[index].collectCount=0
                }else{
                  this.$toast({
                    message:res.data.message
                  })
                }
              }).catch()
            }else{
              shoucang(id,1).then(res=>{
                if(res.data.flag){
                  this.$toast({
                    message:'收藏成功'
                  })
                  this.lists[index].collectCount=1
                }else{
                  this.$toast({
                    message:res.data.message
                  })
                }
              }).catch()
            }

        },
        goMy(n){
            sessionStorage.setItem('myId',n)
          this.$router.push('/my')
        },
        replease(){
            this.edit=1
        },
        down(){
            this.edit=0
        },
        goRelease(n){
            this.$router.push({name:'release',params:{type:n}})
        },
        goReport(n,flag){
            sessionStorage.setItem('reportId',n)
            // this.$router.push('/report')
          this.$router.push({name:'report',params:{flag:flag}})
        },
        jumpTan(index){
            if(this.tan==index){
              this.tan=-1
            }else{
              this.tan=index;
            }
        },
        loadMore(){
          // 异步更新数据
          this.ye+=1;
          getDiaryList('',this.ids,this.ye).then(res=>{
            this.$toast.clear();
            console.log(res);
            if(res.data.flag){
              for (let i = 0; i < res.data.data.length; i++) {
                this.lists.push( res.data.data[i]);
              }
              console.log(this.lists)
              this.loading = false;
              // 数据全部加载完成
              if (res.data.data.length < 10) {
                console.log(1);
                this.finished = true;
               this.$toast({
                 message:'没有更多了'
               })
              }
            }
          }).catch()
        },
        //查看图片
        lookImgs(arr,index){
            console.log(arr);
            var arrs=[];
            for(let i=0;i<arr.length;i++){
              arrs.push(arr[i].img);
            }
          console.log(arrs);
          const instance = ImagePreview({
            images:arrs,
            startPosition: index,
          });
        },
        //点赞
        dianzan(id,index){
            if(this.lists[index].likeStatus){
              this.lists[index].likeStatus=0
              this.lists[index].likeCount-=1
              zan(id,0).then(res=>{
                if(res.data.flag){
                }
              }).catch()
            }else{
              this.lists[index].likeStatus=1
              this.lists[index].likeCount+=1
              zan(id,1).then(res=>{
                if(res.data.flag){
                }
              }).catch()
            }
        }
      }
    }
</script>

<style scoped>
  .home{
    height:100%;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
.home_header{
  width:375px;
  height:94px;
  background: #fff;
  display:flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom:15px;
}
.home_header:before{
  display:table;
  content:''
}
  .search{
    width:345px;
    height:34px;
    padding:0 15px;
    margin-top:5px;
    display:flex;
    justify-content: space-between;
    align-items: center;
  }
  .search_box{
    width:302px;
    height:34px;
    background:rgba(245,245,245,1);
    border-radius:5px;
    position: relative;
  }
  .search_input{
    width:266px;
    height:34px;
    padding-left:36px;
    background:rgba(245,245,245,1);
    border-radius:5px;
    outline: none;
    border:none;
    font-size:14px;
  }
  .search_cancel{
    font-size:14px;
    font-weight:400;
    color:rgba(46,50,51,1);
  }
  .search_img{
    width:18px;
    height:18px;
    position:absolute;
    top:8px;
    left:8px;
  }
  .nav{
    width:345px;
    /*padding-left:27px;*/
    height:35px;
    overflow-x: auto;
  }
  .nav_box{
    width:600px;
    display:flex;
    justify-content: space-around;
    align-items: center;
  }
  .nav_item{
    /*display: inline-block;*/
    /*width:40px;*/
    text-align: center;
    font-size:16px;
    font-weight:400;
    color:rgba(46,50,51,1);
    padding-bottom:4px;
    /*margin-right:27px;*/
    margin-top:2px;
  }
  .nav_active{
    font-size:18px;
    font-weight:500;
    color:rgba(27,193,176,1);
    border-bottom:2px solid rgba(27,193,176,1);
  }
  .release_edit{
    width:40px;
    height:40px;
    /*background:rgba(27,193,176,1);*/
    box-shadow:0px 1px 4px 0px rgba(68,109,118,0.3);
    border-radius:50%;
    position: fixed;
    bottom:65px;
    right:15px;
    z-index: 10;
  }
  .release_edit_img{
    width:40px;
    height:40px;
  }
  .release_edit_box{
    position: fixed;
    top:0;
    left:0;
    bottom:0;
    right:0;
    background: rgba(0,0,0,.5);
    z-index: 11;
  }
  .release_edit_aside{
    width:375px;
    height:206px;
    position: fixed;
    bottom:-208px;
    left:0;
    background: #fff;
    z-index: 12;
    border-radius:10px 10px 0px 0px;
    transition: all 0.3s linear;
  }
  .aside_dong{
    bottom:0;
  }
  .aside_down{
    width:30px;
    height:30px;
    margin:10px auto;
    display:block;
  }
  .aside_list{
    width:289px;
    padding:0 43px;
    display:flex;
    justify-content: space-between;
    align-items: center;
    margin-top:30px;
  }
  .aside_item{
    width:60px;
    display:flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }
  .aside_item>img{
    width:60px;
    height:60px;
    margin-bottom:10px;
  }
  .aside_item>span{
    font-size:14px;
    font-weight:400;
    color:rgba(27,193,176,1);
  }
  .search_people_box{
    width:345px;
    height:59px;
    padding:15px 15px 9px;
    margin-bottom:10px;
    background: #fff;
    display:flex;
    justify-content: flex-start;
    align-items: center;
  }
  .p_box_item{
    width:40px;
    text-align: center;
    margin-right:20px;
  }
  .p_box_item:last-child{
    margin-right:0;
  }
  .p_box_item>img{
    width:40px;
    height:40px;
    border-radius: 50%;
    display: block;
    margin-bottom: 5px;
  }
  .p_box_item>div{
    font-size:10px;
    font-weight:400;
    color:rgba(144,151,153,1);
  }
</style>
