<template>
    <div class="userMore">
      <!--搜索用户-->
      <div class="c_lists">
        <van-list
          v-model="loadings"
          :finished="finisheds"
          finished-text="没有更多了"
          @load="loadMores"
          :immediate-check="false"
          :offset="10"
        >
          <div class="myfollow_box">
            <div class="mf_item" v-for="(item,index) in userLists">
              <div class="mf_item_left">
                <img :src="item.img" alt="" class="mf_left_img" @click="goMy(item.id)">
                <div class="mf_left_txt">{{item.name}}</div>
              </div>
              <div class="mf_item_right" v-if="item.fansStatus==0"  @click="guanzhu(item.id,0,index)">关注</div>
              <div class="mf_item_right had" v-if="item.fansStatus==1" @click="guanzhu(item.id,1,index)">取消关注</div>
            </div>
          </div>
        </van-list>
      </div>
    </div>
</template>

<script>
  import {reSearch,focus} from "@/api/api";

  export default {
        name: "userMore",
      data(){
          return{
            userLists:[],
            ye:1,
            loadings: false,
            finisheds: false,
            txt:''
          }
      },
      created(){
          this.txt=sessionStorage.getItem('searchTxt')
        // this.$toast.loading({
        //   duration:0,
        //   message:'加载中'
        // })
        reSearch(1,this.txt,this.ye,10).then(res=>{
          // this.$toast.clear();
          console.log(res);
          if(res.data.flag){
            this.userLists=res.data.data.users
          }else{
            this.$toast(res.data.message);
          }
        }).catch()
      },
      methods:{
        loadMores(){
          // 异步更新数据
          this.ye+=1;
          reSearch(1,this.txt,this.ye,10).then(res=>{
            console.log(res);
            if(res.data.flag){
              for (let i = 0; i < res.data.data.users.length; i++) {
                this.userLists.push( res.data.data.users[i]);
              }
              console.log(this.userLists)
              this.loadings = false;
              // 数据全部加载完成
              if (res.data.data.users.length < 10) {
                console.log(1);
                this.finisheds = true;
                this.$toast({
                  message:'没有更多了'
                })
              }
            }
          }).catch()
        },
        goMy(n){
          sessionStorage.setItem('myId',n)
          this.$router.push('/my')
        },
        //关注
        guanzhu(id,n,index){
          if(n){
            this.userLists[index].fansStatus=0
            focus(id,0).then(res=>{
              if(res.data.flag){
                this.$toast('取消关注')
              }
            }).catch()
          }else{
            this.userLists[index].fansStatus=1
            focus(id,1).then(res=>{
              if(res.data.flag){
                this.$toast('关注成功')
              }
            }).catch()
          }
        }
      }
    }
</script>

<style scoped>
.userMore{
  height:100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
.myfollow_box{
  /*height:100%;*/
  background: #fff;
  width:345px;
  padding:0 15px;
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
