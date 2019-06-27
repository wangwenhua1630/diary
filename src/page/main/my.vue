<template>
    <div class="my">
      <div class="my_bgBox">
        <img src="../../assets/b1.png" alt="">
        <div class="my_photo">
          <img :src="infos.img" alt="" class="my_photo_img">
        </div>
      </div>
      <div class="my_info">
          <div class="my_info_txt">{{infos.name}}</div>
        <div class="my_info_btnGroup">
          <div class="siEmail" @click="reFlag=!reFlag">私信</div>
          <div class="getLook"  v-if="infos.fansStatus==0" @click="guanZhu(0)">关注</div>
          <div class="getLooked" v-if="infos.fansStatus==1" @click="guanZhu(1)">取消关注</div>
        </div>
      </div>
      <div class="my_getTotal">
          <div class="getTotal_item">
            <div class="total_num">{{infos.likeCount}}</div>
            <div class="total_txt">获赞</div>
          </div>
        <div class="getTotal_item">
          <div class="total_num">{{infos.diaryCount}}</div>
          <div class="total_txt">发布</div>
        </div>
        <div class="getTotal_item" @click="goMyFollow(1)">
          <div class="total_num">{{infos.fromFansCount}}</div>
          <div class="total_txt">关注</div>
        </div>
        <div class="getTotal_item" @click="goMyFollows(2)">
          <div class="total_num">{{infos.toFansCount}}</div>
          <div class="total_txt">粉丝</div>
        </div>
      </div>
      <div class="c_lists">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="loadMore"
          :immediate-check="false"
          :offset="10"
        >
        <div class="c_item" @click="goDetail(item.id)"  v-for="(item,index) in lists">
          <!--收藏与举报-->
          <div class="tan_box" v-if="tan==index">
            <div class="tan_item" v-if="item.collectCount==0" @click.stop="collect(item.id,item.collectCount,index)">收藏</div>
            <div class="tan_item" v-if="item.collectCount>0" @click.stop="collect(item.id,item.collectCount,index)">取消收藏</div>
            <div class="tan_item" @click.stop="goReport(item.id,1)">举报</div>
          </div>
          <div class="c_item_header">
            <div class="c_item_left">
              <img :src="item.img" alt="" class="c_item_userImg">
              <div class="c_item_userName">
                <div class="name">{{item.name}}</div>
                <div class="date">{{item.createAt}}</div>
              </div>
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
            <div class="good"  @click.stop="dianzan(item.id,index)">
              <img src="../../assets/good_sel.png" alt="" v-if="item.likeStatus==0">
              <img src="../../assets/good_unsel.png" alt="" v-else>
              <span class="ti_num" v-if="item.likeCount">{{item.likeCount}}</span>
            </div>
            <div class="good">
              <img src="../../assets/comment.png" alt="">
              <span class="ti_num" v-if="item.commentCount">{{item.commentCount}}</span>
            </div>
            <div class="good" @click.stop="share"><img src="../../assets/share.png" alt=""></div>
          </div>
        </div>
        </van-list>
      </div>
      <!--回复框-->
      <div class="replay" v-if="reFlag">
        <input type="text" v-model="replyTxt" class="replay_input" :placeholder="dateinit">
        <button class="replay_btn" @click="replySend">发送</button>
      </div>
      <!--分享遮罩-->
      <div class="share_shadow" @click="close" v-if="shadow">
        <img src="../../assets/shares.png" alt="" style="width:80%;">
      </div>
    </div>
</template>

<script>
  import wx from 'weixin-js-sdk'
  import {zhuye,shoucan,zan,si,focus,wxjdk} from "@/api/api";
  import Vue from 'vue'
  import { ImagePreview } from 'vant';
  Vue.use(ImagePreview);
  export default {
        name: "my",
      data(){
          return{
            tan:-1,
            ye:1,
            infos:'',
            lists:[],
            ids:'',
            loading: false,
            finished: false,
            replyTxt:'',
            dateinit:'回复:',
            reFlag:false,
            shadow:false
          }
      },
      created(){
          this.ids=sessionStorage.getItem('myId');
          // this.$toast.loading({
          //   duration:0,
          //   message:'加载中...'
          // })
        zhuye(this.ids,1).then(res=>{
          // this.$toast.clear();
          if(res.data.flag){
            this.infos=res.data.data;
            this.lists=res.data.data.diaryDetailVO
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
        goMyFollow(n){
          sessionStorage.setItem('followFlag',n)
          this.$router.push('/myfollow');
        },
        goMyFollows(n){
          sessionStorage.setItem('followFlag',n)
          this.$router.push('/myfollows');
        },
        goDetail(n){
          // sessionStorage.setItem('detailId',n)
          // this.$router.push('/diarydetail')
          this.$router.push({path:'/diarydetail',query:{id:n}});
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
        goReport(n,flag){
          sessionStorage.setItem('reportId',n)
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
          zhuye(this.ids,this.ye).then(res=>{
            this.$toast.clear();
            console.log(res);
            if(res.data.flag){
              for (let i = 0; i < res.data.data.diaryDetailVO.length; i++) {
                this.lists.push( res.data.data.diaryDetailVO[i]);
              }
              console.log(this.lists)
              this.loading = false;
              // 数据全部加载完成
              if (res.data.data.diaryDetailVO.length < 10) {
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
        },
        //关注
        guanZhu(n){
          if(n){
            this.infos.fansStatus=0
            focus(this.infos.id,0).then(res=>{
              if(res.data.flag){

              }
            }).catch()
          }else{
            this.infos.fansStatus=1
            focus(this.infos.id,1).then(res=>{
              if(res.data.flag){

              }
            }).catch()
          }
        },
        //私信
        siEmail(){
          this.reFlag=true;
        },
        //私信发送
        replySend(){
          si(this.ids,this.replyTxt).then(res=>{
            this.reFlag=false;
            if(res.data.flag){
              this.$toast('发送成功')
            }else{
              this.$toast('发送失败')
            }
          }).catch()

        }
      }
    }
</script>

<style scoped>
  .my{
    height:100%;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
.my_bgBox{
  width:375px;
  height:150px;
  position: relative;
}
  .my_bgBox>img{
    width:375px;
    height:150px;
  }
  .my_photo{
    position: absolute;
    width:85px;
    height:85px;
    background:rgba(255,255,255,1);
    border-radius: 50%;
    top:50%;
    left:50%;
    margin-top:-42.5px;
    margin-left:-42.5px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .my_photo_img{
    width:80px;
    height:80px;
    border-radius: 50%;
  }
  .my_info{
    height:58.5px;
    width:345px;
    padding:0 15px;
    display:flex;
    justify-content: space-between;
    align-items: center;
    border-bottom:1px solid #ddd;
    background: #fff;
  }
  .my_info_txt{
    font-size:16px;
    font-weight:500;
    color:rgba(0,0,0,1);
  }
  .my_info_btnGroup{
    display:flex;
    justify-content: flex-start;
    align-items: center;
  }
  .siEmail,.getLook,.getLooked{
    width:60px;
    height:24px;
    border-radius:3px;
    border:1px solid rgba(27,193,176,1);
    margin-right:15px;
    font-size:12px;
    font-weight:400;
    color:rgba(27,193,176,1);
    text-align: center;
    line-height: 24px;
  }
  .getLook{
    margin-right:0;
  }
  .getLooked{
    background:rgba(193,193,193,1);
    border:none;
    color:#fff;
    margin-right:0;
    height:25px;
  }
  .my_getTotal{
    width:345px;
    padding:0 15px;
    height:78.5px;
    display:flex;
    justify-content: space-around;
    align-items: center;
    background: #fff;
    margin-bottom: 10px;
  }
  .total_num{
    font-size:14px;
    font-weight:500;
    color:rgba(51,51,51,1);
    text-align: center;
  }
  .total_txt{
    font-size:12px;
    font-weight:400;
    color:rgba(144,151,153,1);
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
</style>
