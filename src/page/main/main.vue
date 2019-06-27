<template>
  <van-pull-refresh v-model="isLoading" @refresh="onRefresh"  class="mains">
      <div class="user_info">
        <div class="user_photo">
          <img :src="infos.img" alt="" class="user_photo_img">
        </div>
        <div class="user_msg">
          <div class="user_name">{{infos.name}}</div>
          <div class="user_total">
              <div class="total_item"  @click="goMsg(1)">
                <div class="total_num">{{infos.likeCount}}</div>
                <div class="total_txt">获赞</div>
                <div class="total_item_dian" v-if="infos.likeNotice==1"></div>
              </div>
            <div class="total_item"  @click="goMyFollow(1)">
              <div class="total_num">{{infos.fromFansCount}}</div>
              <div class="total_txt">关注</div>
            </div>
            <div class="total_item"  @click="goMyFollows(2)">
              <div class="total_num">{{infos.toFansCount}}</div>
              <div class="total_txt">粉丝</div>
            </div>
          </div>
        </div>
      </div>
      <div class="mains_hr"></div>
      <div class="mains_box">
        <div class="m_b_item" @click="goMsg(2)">
            <div class="m_b_left">
              <img src="../../assets/m1.png" alt="" class="m_b_icon">
              <div class="m_b_txt">我的消息</div>
            </div>
          <img src="../../assets/arrow.png" alt="" class="m_b_right">
          <div class="m_b_dian" v-if="infos.commentNotice"></div>
        </div>
        <div class="m_b_item" @click="goMyRelease">
          <div class="m_b_left">
            <img src="../../assets/m2.png" alt="" class="m_b_icon">
            <div class="m_b_txt">我的发布</div>
          </div>
          <img src="../../assets/arrow.png" alt="" class="m_b_right">
        </div>
        <div class="m_b_item" @click="goMyFollow(1)">
          <div class="m_b_left">
            <img src="../../assets/m3.png" alt="" class="m_b_icon">
            <div class="m_b_txt">我的关注</div>
          </div>
          <img src="../../assets/arrow.png" alt="" class="m_b_right">
        </div>
        <div class="m_b_item" @click="goMyCollect">
          <div class="m_b_left">
            <img src="../../assets/m4.png" alt="" class="m_b_icon">
            <div class="m_b_txt">我的收藏</div>
          </div>
          <img src="../../assets/arrow.png" alt="" class="m_b_right">
        </div>
        <div class="m_b_item" @click="goMyGood">
          <div class="m_b_left">
            <img src="../../assets/m6.png" alt="" class="m_b_icon">
            <div class="m_b_txt">好友圈</div>
          </div>
          <img src="../../assets/arrow.png" alt="" class="m_b_right">
        </div>
        <div class="m_b_item" @click="goReminder">
          <div class="m_b_left">
            <img src="../../assets/m5.png" alt="" class="m_b_icon">
            <div class="m_b_txt">时间提醒</div>
            <div class="m_b_she">设定时间 每日打卡吧</div>
          </div>
          <img src="../../assets/arrow.png" alt="" class="m_b_right">
        </div>
      </div>
      <a href="http://www.mozhifang.net/" class="company_link">&copy;魔之方科技技术支持</a>
  </van-pull-refresh>
</template>

<script>
  import wx from 'weixin-js-sdk'
  import {mains,wxjdk} from '../../api/api'
    export default {
        name: "mains",
      data(){
          return{
            infos:'',
            isLoading: false
          }
      },
      created(){
        // this.$toast.loading({
        //   duration:0,
        //   message:'加载中...'
        // })
        mains().then(res=>{
          // this.$toast.clear();
          if(res.data.flag){
            this.infos=res.data.data;
          }else{
            this.$toast({
              message:res.data.message
            })
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
      },
      methods:{
        goMsg(n){
          sessionStorage.setItem('msgFlag',n);
          this.$router.push('/message');
        },
        goMyRelease(){
          this.$router.push('/myrelease');
        },
        goMyFollow(n){
          sessionStorage.setItem('followFlag',n);
          this.$router.push('/myfollow');
        },
        goMyFollows(n){
          sessionStorage.setItem('followFlag',n);
          this.$router.push('/myfollows');
        },
        goMyCollect(){
          this.$router.push('/mycollect');
        },
        goMyGood(){
          this.$router.push('/myGood');
        },
        goReminder(){
          this.$router.push('/reminder');
        },
        //下拉刷新
        onRefresh() {
          mains().then(res=>{
            this.$toast.clear();
            if(res.data.flag){
              this.$toast('刷新成功');
              this.isLoading = false;
              this.infos=res.data.data;
            }else{
              this.isLoading = false;
              this.$toast({
                message:res.data.message
              })
            }
          }).catch()
        },
      }
    }
</script>

<style scoped>
.mains{
  height:100%;
  background: #fff;
  overflow-y: auto;
}
  .user_info{
    width:345px;
    height:93px;
    padding:17.5px 15px;
    display:flex;
    justify-content: space-between;
    align-items: center;
    border-top:1px solid #ddd;
  }
  .user_photo{
    width:83px;
    height:83px;
    border-radius: 50%;
    background:rgba(27,193,176,0.5);
    display:flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }
  .user_photo_img{
    width:80px;
    height:80px;
    border-radius: 50%;
  }
  .user_msg{
    width:236px;
    height:93px;
    display:flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }
  .user_name{
    width:236px;
    height:46px;
    line-height: 46px;
    border-bottom: 0.5px solid #ddd;
    font-size:16px;
    font-weight:500;
    color:rgba(46,50,51,1);
  }
  .user_total{
    width:236px;
    height:46px;
    display:flex;
    justify-content: space-between;
    align-items: center;
  }
  .total_item{
    display:flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
  }
  .total_item_dian{
    width:10px;
    height:10px;
    border-radius: 50%;
    background: red;
    position: absolute;
    top:-5px;
    right:-5px;
  }
  .total_num{
    font-size:14px;
    font-weight:500;
    color:rgba(46,50,51,1);
  }
  .total_txt{
    font-size:12px;
    font-weight:400;
    color:rgba(144,151,153,1);
  }
  .mains_hr{
    width:375px;
    height:7px;
    background:rgba(27,193,176,1);
    border-radius:100px 100px 0px 0px;
  }
  .mains_box{
    width:345px;
    padding:0 15px;
  }
  .m_b_item{
    width:345px;
    height:54px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom:0.5px solid #ddd;
    position: relative;
  }
  .m_b_dian{
    width:15px;
    height:15px;
    border-radius: 50%;
    background: red;
    position: absolute;
    top:20px;
    right:20px;
  }
  .m_b_left{
    height:54px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .m_b_icon{
    width:20px;
    height:20px;
    margin-right:13px;
  }
  .m_b_txt{
    font-size:14px;
    font-weight:400;
    color:rgba(102,102,102,1);
  }
  .m_b_she{
    font-size:10px;
    font-weight:400;
    color:rgba(144,151,153,1);
    margin-left:13px;
  }
  .m_b_right{
    width:10px;
    height:18px;
  }
  .company_link{
    width:100%;
    display:inline-block;
    text-align: center;
    font-size:10px;
    font-weight:400;
    color:rgba(144,151,153,1);
    margin:60px auto;
  }
</style>
