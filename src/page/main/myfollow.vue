<template>
  <van-pull-refresh v-model="isLoading" @refresh="onRefresh"  class="myfollow">
      <div class="mf_hr"></div>
      <div class="myfollow_box" v-if="lists.length>0">
        <div class="mf_item" v-for="(item,index) in lists">
          <div class="mf_item_left">
            <img :src="item.img" alt="" class="mf_left_img" @click="goMy(item.toUserId)">
            <div class="mf_left_txt">{{item.name}}</div>
          </div>
          <!--<div class="mf_item_right">关注</div>-->
          <div class="mf_item_right had" v-if="flag==1" @click="guanzhu(item.toUserId,index)">取消关注</div>
        </div>
      </div>
  </van-pull-refresh>
</template>

<script>
  import {myGuan,focus} from "@/api/api";

  export default {
        name: "myfollow",
      data(){
          return{
            lists:[],
            flag:'',
            isLoading: false
          }
      },
    created(){
      this.flag=sessionStorage.getItem('followFlag')
      // this.$toast.loading({
      //   duration:0,
      //   message:'加载中...'
      // })
      myGuan(this.flag).then(res=>{
        // this.$toast.clear();
        if(res.data.flag){
          this.lists=res.data.data;
        }
      }).catch()
    },
      methods:{
          //下拉刷新
        onRefresh() {
          myGuan(this.flag).then(res=>{
            if(res.data.flag){
              this.$toast('刷新成功');
              this.isLoading = false;
              this.lists=res.data.data;
            }
          }).catch()
        },
        goMy(n){
          sessionStorage.setItem('myId',n)
          this.$router.push('/my')
        },
        //调转关注方个人中心
        go(){

        },
        //关注
        guanzhu(id,index){
          focus(id,0).then(res=>{
            if(res.data.flag){
              this.$toast('取消关注')
              this.lists.splice(index,1);
            }
          }).catch()
        }
      }
    }
</script>

<style scoped>
.myfollow{
  height:100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
  .myfollow_box{
    height:100%;
    background: #fff;
    width:345px;
    padding:0 15px;
  }
  .mf_hr{
    width:375px;
    height:10px;
    background: #f7f7f7;
  }
  .mf_item{
    width:345px;
    height:78px;
    border-bottom: 0.5px solid #ddd;
    display:flex;
    justify-content: space-between;
    align-items: center;
  }
  .mf_item_left{
    display:flex;
    justify-content: space-between;
    align-items: center;
  }
  .mf_left_img{
    width:40px;
    height:40px;
    border-radius: 50%;
    margin-right:15px;
  }
  .mf_left_txt{
    font-size:14px;
    font-weight:500;
    color:rgba(46,50,51,1);
  }
  .mf_item_right{
    width:60px;
    height:24px;
    background:rgba(27,193,176,1);
    border-radius:3px;
    text-align: center;
    line-height: 24px;
    font-size:12px;
    font-weight:400;
    color:rgba(255,255,255,1);
  }
  .had{
    background:rgba(193,193,193,1);
    color:#fff;
  }
</style>
