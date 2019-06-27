<template>
    <div class="diarydetail">
      <div class="c_lists" v-if="infos">
        <div class="c_item">
          <div class="c_item_header">
            <div class="c_item_left">
              <img :src="infos.img" alt="" class="c_item_userImg" @click.stop="goMy(infos.userId)">
              <div class="c_item_userName">
                <div class="name">{{infos.name}}</div>
                <div class="date">{{infos.createAt}}</div>
              </div>
            </div>
            <div class="c_item_rZhu" v-if="infos.fansStatus==0" @click="guanZhu(0)">关注</div>
            <div class="c_item_rZhu had" v-if="infos.fansStatus==1" @click="guanZhu(1)">取消关注</div>
          </div>
          <div class="c_item_txt">{{infos.content}}</div>
          <!--超过四张图-->
          <div class="c_item_imgList" v-if="len!=4&&len!=1">
            <div class="c_item_img"  v-for="(items,indexs) in infos.imgs" @click.stop="lookImgs(infos.imgs,indexs)">
              <img :src="items.img" alt=""/>
            </div>
          </div>
          <!----等于四张图-->
          <div class="c_item_imgList1" v-if="len==4">
            <div class="c_item_img"  v-for="(items,indexs) in infos.imgs" @click.stop="lookImgs(infos.imgs,indexs)">
              <img :src="items.img" alt=""/>
            </div>
          </div>
          <!--一张图时-->
          <div class="c_item_imgList" v-if="len==1">
            <div class="c_item_imgOne"  v-for="(items,indexs) in infos.imgs" @click.stop="lookImgs(infos.imgs,0)">
              <img :src="items.img" alt=""/>
            </div>
          </div>
          <div class="c_item_btnGroups">
            <div class="c_item_btnLeft">
              <div class="good" @click.stop="dianzan(infos.id)">
                <img src="../../assets/good_sel.png" alt="" v-if="infos.likeStatus==0">
                <img src="../../assets/good_unsel.png" alt="" v-else>
                <span class="ti_num" v-if="infos.likeCount">{{infos.likeCount}}</span>
              </div>
              <div class="good" @click.stop="changeReply(1,infos.name,infos.id)">
                <img src="../../assets/comment.png" alt="">
                <span class="ti_num" v-if="infos.commentCount">{{infos.commentCount}}</span>
              </div>
              <div class="good" @click.stop="share(infos.id)"><img src="../../assets/share.png" alt=""></div>
            </div>
            <div class="c_item_btnRight" @click="goReport(infos.id,1)">
              <span class="jubao">举报</span>
              <img src="../../assets/jubao.png" alt="" class="jbImg">
            </div>
          </div>
        </div>
      </div>
      <div class="discuss">
        <div class="discuss_num">
          <span class="d_n_txt">评论</span>
          <span class="d_n_n">（{{infos.commentCount}}条评论）</span>
        </div>
        <div class="discuss_box" v-if="commentList.length">
          <div class="discuss_item" v-for="(item,index) in commentList">
            <!--回复与举报-->
            <div class="tan_box" v-if="chatTan==index">
              <div class="tan_item" @click.stop="changeReply(2,item.name,item.id)">回复</div>
              <div class="tan_item" @click="goReport(item.id,2)">举报</div>
            </div>
            <div class="discuss_item_header">
              <div class="discuss_item_left">
                <img :src="item.img" alt="" class="discuss_item_userImg" @click.stop="goMy(item.userId)">
                <div class="discuss_item_userName">{{item.name}}</div>
                <div class="discuss_item_hours">{{item.createAt}}</div>
              </div>
              <img src="../../assets/more.png" alt="" class="c_item_right" @click="jumpChatTan(index)">
            </div>
            <div class="discuss_contents">
              <div class="discuss_content">
                <span>{{item.content}}</span>
              </div>
              <div class="discuss_content" v-if="item.childs.length" v-for="(child,num) in item.childs">
                <div class="tan_box" v-if="chatChildTan==child.id">
                  <div class="tan_item" @click="goReport(child.id,2)">举报</div>
                </div>
                <div class="discuss_item_header">
                  <div class="discuss_item_left">
                    <img :src="child.img" alt="" class="discuss_item_userImg" @click.stop="goMy(child.userId)">
                    <div class="discuss_item_userName">{{child.name}}</div>
                    <div class="discuss_item_hours">回复{{item.name}}</div>
                    <div class="discuss_item_hours">{{child.createAt}}</div>
                  </div>
                  <img src="../../assets/more.png" alt="" class="c_item_right" @click="jumpChild(child.id)">
                </div>
                <div class="discuss_c_item_txt">{{child.content}}</div>
              </div>
            </div>
          </div>
          <!--<div class="discuss_item">-->
            <!--<div class="discuss_item_header">-->
              <!--<div class="discuss_item_left">-->
                <!--<img src="../../assets/wei.png" alt="" class="discuss_item_userImg">-->
                <!--<div class="discuss_item_userName">用户名称</div>-->
                <!--<div class="discuss_item_hours">6小时前</div>-->
              <!--</div>-->
              <!--<img src="../../assets/more.png" alt="" class="c_item_right">-->
            <!--</div>-->
            <!--<div class="discuss_contents">-->
              <!--<div class="discuss_content">-->
                <!--<span>与工蚂蚁金服集团每年举办 1-2 次，包括专业分享、产品展台、Workshop 等内容。</span>-->
              <!--</div>-->
            <!--</div>-->
          <!--</div>-->
          <!--<div class="discuss_item">-->
            <!--<div class="discuss_item_header">-->
              <!--<div class="discuss_item_left">-->
                <!--<img src="../../assets/wei.png" alt="" class="discuss_item_userImg">-->
                <!--<div class="discuss_item_userName">用户名称</div>-->
                <!--<div class="discuss_item_hours">6小时前</div>-->
              <!--</div>-->
              <!--<img src="../../assets/more.png" alt="" class="c_item_right">-->
            <!--</div>-->
            <!--<div class="discuss_contents">-->
              <!--<div class="discuss_content">-->
                <!--<span>与工蚂蚁金服集团每年举办 1-2 次，包括专业分享、产品展台、Workshop 等内容。</span>-->
              <!--</div>-->
            <!--</div>-->
          <!--</div>-->
        </div>
      </div>
      <!--回复框-->
      <div class="replay">
        <input type="text" v-model="replyTxt" class="replay_input" :placeholder="dateinit">
        <button class="replay_btn" @click="reply">回复</button>
      </div>
      <!--分享遮罩-->
      <div class="share_shadow" @click="close" v-if="shadow">
        <img src="../../assets/shares.png" alt="" style="width:80%;">
      </div>

      <!--首页-->
      <div class="go_home" @click="goHome">
        <img class="go_home_img" src="../../assets/home.png" />
      </div>
    </div>
</template>

<script>
  import wx from 'weixin-js-sdk'
  import {detail,focus,ping,zan,wxjdk} from '../../api/api'
  import Vue from 'vue'
  import { ImagePreview } from 'vant';
  Vue.use(ImagePreview);
    export default {
        name: "diarydetail",
      data(){
          return{
            dateinit:'回复：',
            infos:{},
            chatTan:-1,
            chatChildTan:-1,
            len:'',
            ids:'',
            replyFlag:1,
            replyTxt:'',
            commentList:[],
            detailId:'',
            shadow:false
        }
      },
      created(){
          // this.detailId=sessionStorage.getItem('detailId')
        this.detailId=this.$route.query.id;
        sessionStorage.setItem('id',this.detailId);
        // this.$toast.loading({
        //   duration:0,
        //   message:'加载中...'
        // })
        detail(this.detailId).then(res=>{
          // this.$toast.clear();
          if(res.data.flag){
              this.infos=res.data.data;
              this.len=res.data.data.imgs;
              this.ids=res.data.data.id;
              this.commentList=res.data.data.commentVOs
              sessionStorage.setItem('id','');
          }else{
            this.info=''
          }
        }).catch()
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
        goReport(n,flag){
          sessionStorage.setItem('reportId',n)
          this.$router.push({name:'report',params:{flag:flag}})
        },
        goMy(n){
          sessionStorage.setItem('myId',n)
          this.$router.push('/my')
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
        dianzan(id){
          if(this.infos.likeStatus){
            this.infos.likeStatus=0
            this.infos.likeCount-=1
            zan(id,0).then(res=>{
              if(res.data.flag){
              }
            }).catch()
          }else{
            this.infos.likeStatus=1
            this.infos.likeCount+=1
            zan(id,1).then(res=>{
              if(res.data.flag){
              }
            }).catch()
          }
        },
        //关注
        guanZhu(n){
          if(n){
            this.infos.fansStatus=0
            focus(this.infos.userId,0).then(res=>{
              if(res.data.flag){

              }
            }).catch()
          }else{
            this.infos.fansStatus=1
            focus(this.infos.userId,1).then(res=>{
              if(res.data.flag){

              }
            }).catch()
          }
        },
        jumpChatTan(index){
          if(this.chatTan==index){
            this.chatTan=-1
          }else{
            this.chatTan=index;
          }
        },
        jumpChild(index){
          if(this.chatChildTan==index){
            this.chatChildTan=-1
          }else{
            this.chatChildTan=index;
          }
        },
        //改变回复主题
        changeReply(n,name,id){
          this.replyFlag=n;
          this.dateinit='回复：'+name;
          this.chatTan=-1;
          this.ids=id;
        },
        //回复
        reply(){
          this.$toast.loading({
            duration:0,
            message:'加载中...'
          })
          ping(this.ids,this.replyFlag,this.replyTxt).then(res=>{
            this.$toast.clear();
            if(res.data.flag){
              detail(this.detailId).then(res=>{
                this.$toast.clear();
                if(res.data.flag){
                  this.infos=res.data.data;
                  this.len=res.data.data.imgs;
                  this.commentList=res.data.data.commentVOs
                }else{
                    this.info=''
                }
              }).catch()
            }
          }).catch()
        },
        goHome:function(){
          this.$router.push('/home');
        }
      }
    }
</script>

<style scoped>
  .diarydetail{
    height:100%;
    margin-bottom:58px;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
.name{
  font-size:16px;
  font-weight:400;
  color:rgba(46,50,51,1);
  margin-bottom:5px;
}
  .date{
    font-size:10px;
    font-weight:400;
    color:rgba(153,153,153,1);
  }
  .c_item_rZhu{
    width:60px;
    height:24px;
    background:rgba(27,193,176,1);
    border-radius:3px;
    text-align: center;
    line-height: 24px;
    font-size:14px;
    font-weight:400;
    color:rgba(255,255,255,1);
  }
  .had{
    background:rgba(153,153,153,1);
  }
.c_item_btnGroups{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
  .c_item_btnLeft{
    width:200px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .c_item_btnRight{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .jubao{
    font-size:10px;
    font-weight:400;
    color:rgba(96,100,102,1);
    margin-right:10px;
  }
  .jbImg{
    width:20px;
    height:20px;
  }
  .discuss{
    width:375px;
    background: #fff;
  }
  .discuss_num{
    height:40px;
    padding:0 15px;
    display:flex;
    justify-content: flex-start;
    align-items: center;
    border-bottom: 1px solid #ddd;
  }
  .d_n_txt{
    font-size:12px;
    font-weight:400;
    color:rgba(51,51,51,1);
  }
  .d_n_n{
    font-size:10px;
    font-weight:400;
    color:rgba(153,153,153,1);
  }
  .discuss_box{
    width:345px;
    padding:20px 15px 0;
  }
.discuss_box:after{
  display: table;
  content: '';
}
.discuss_item{
  position: relative;
}
  .discuss_item_header{
    display:flex;
    justify-content: space-between;
    align-items: center;
    height:30px;
  }
  .discuss_item_left{
    display:flex;
    justify-content: flex-start;
    align-items: center;
  }
  .discuss_item_userImg{
    width:30px;
    height:30px;
    border-radius: 50%;
    margin-right:10px;
  }
  .discuss_item_userName{
    font-size:14px;
    font-weight:500;
    color:rgba(96,100,102,1);
  }
  .discuss_item_hours{
    font-size:10px;
    font-weight:400;
    color:rgba(144,151,153,1);
    margin-left:10px;
  }
  .discuss_content{
    width:305px;
    padding-bottom:15px;
    margin-left:40px;
    font-size:14px;
    font-weight:400;
    color:rgba(96,100,102,1);
    border-bottom:0.5px solid #ddd;
    margin-bottom:15px;
    position: relative;
  }
  .discuss_c_item_txt{
    font-size:14px;
    font-weight:400;
    color:rgba(96,100,102,1);
    padding-left:30px;
  }
 .discuss_item:last-child .discuss_content:only-child{
    border-bottom: none;
  }
  .replay{
    width:345px;
    height:37px;
    padding:8px 15px;
    display:flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    position: fixed;
    bottom:0;
    left:0;
  }
  .replay_input{
    width:248.5px;
    height:37px;
    padding-left:15px;
    background:rgba(245,245,245,1);
    border-radius:3px;
    border:0.5px solid rgba(221,221,221,1);
  }
  .replay_btn{
    padding:0;
    width:65.5px;
    height:37px;
    background:rgba(27,193,176,1);
    border-radius:3.5px;
    font-size:16px;
    font-weight:400;
    color:rgba(255,255,255,1);
    text-align: center;
    line-height: 37px;
    border:none;
  }
  .tan_box{
    top:30px;
    z-index: 100;
  }
  .go_home{
    width:55px;
    height:55px;
    position: fixed;
    bottom:120px;
    right:30px;
  }
  .go_home_img{
    width:100%;
  }
</style>
