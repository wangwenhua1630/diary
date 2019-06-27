<template>
    <div class="wenzi">
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
              <div class="tan_item">收藏</div>
              <div class="tan_item" @click.stop="goReport">举报</div>
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
              <div class="good"  @click.stop="share(item.id)"><img src="../../assets/share.png" alt=""></div>
            </div>
          </div>
        </van-list>
      </div>
      <!--分享遮罩-->
      <div class="share_shadow" @click="close" v-if="shadow">
        <img src="../../assets/shares.png" alt="" style="width:80%;">
      </div>
    </div>
</template>

<script>
  import wx from 'weixin-js-sdk'
  import {getDiaryList,zan,wxjdk} from '../../api/api'
  import Vue from 'vue'
  import { ImagePreview } from 'vant';
  Vue.use(ImagePreview);
    export default {
        name: "wenzi",
      data(){
          return{
            lists:[],
            tan:-1,
            loading: false,
            finished: false,
            ye:1,
            shadow:false
          }
      },
      created(){
        //获取日记列表
        // this.$toast.loading({
        //   duration:0,
        //   message:'加载中'
        // })
        getDiaryList(0,'',this.ye).then(res=>{
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
        goDetail(n){
          // sessionStorage.setItem('detailId',n)
          // this.$router.push('/diarydetail')
          this.$router.push({path:'/diarydetail',query:{id:n}});
        },
        goMy(n){
          sessionStorage.setItem('myId',n)
          this.$router.push('/my')
        },
        goReport(){
          this.$router.push('/report')
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
          getDiaryList(0,'',this.ye).then(res=>{
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
.wenzi{
  height:100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
</style>
