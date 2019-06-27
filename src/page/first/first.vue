<template>
  <div class="first">
    <van-tabbar v-model="active" @change="qie" active-color="#333">
      <van-tabbar-item to="/home">
        <span>首页</span>
        <img
          slot="icon"
          slot-scope="props"
          :src="props.active ? icon.index_a : icon.index"
          class="tabbar_img"
        >
      </van-tabbar-item>
      <van-tabbar-item to="/wenzi">
        <span>文字</span>
        <img
          slot="icon"
          slot-scope="props"
          :src="props.active ? icon.txt_a : icon.txt"
          class="tabbar_img"
        >
      </van-tabbar-item>
      <van-tabbar-item to="/tuwen">
        <span>图片</span>
        <img
          slot="icon"
          slot-scope="props"
          :src="props.active ? icon.imgs_a : icon.imgs"
          class="tabbar_img"
        >
      </van-tabbar-item>
      <van-tabbar-item to="/main">
        <span>我的</span>
        <img
          slot="icon"
          slot-scope="props"
          :src="props.active ? icon.main_a : icon.main"
          class="tabbar_img"
        >
      </van-tabbar-item>
    </van-tabbar>
    <router-view></router-view>
  </div>
</template>

<script>
    export default {
        name: "first",
      data(){
          return{
            active:0,
            icon: {
              index: 'http://www.chayoueryuan.com/bozhi_h5/img/index.png',
              index_a: 'http://www.chayoueryuan.com/bozhi_h5/img/index_a.png',
              txt:'http://www.chayoueryuan.com/bozhi_h5/img/txt.png',
              txt_a:'http://www.chayoueryuan.com/bozhi_h5/img/txt_a.png',
              imgs:'http://www.chayoueryuan.com/bozhi_h5/img/imgs.png',
              imgs_a:'http://www.chayoueryuan.com/bozhi_h5/img/imgs_a.png',
              main: 'http://www.chayoueryuan.com/bozhi_h5/img/main.png',
              main_a: 'http://www.chayoueryuan.com/bozhi_h5/img/main_a.png'
            }
          }
      },
      created(){
        this.active=Number(localStorage.getItem('selected'))
      },
      methods:{
          qie(e){
            console.log(e);
            this.active=e;
          }
      },
      watch:{
          active(newvalue){
            if(newvalue==0){
              this.$router.push('/home')
            }else if(newvalue==1){
              this.$router.push('/wenzi')
            }else if(newvalue==2){
              this.$router.push('/tuwen')
            }else{
              this.$router.push('/main')
            }
          }
      }
    }
</script>

<style scoped>
.first{
  height:100%;
  width:375px;
  margin:0 auto 60px;
}
.van-tabbar{
  height:49px;
  color:#A2A2A2;
  font-size:10px;
}
.van-tabbar-item{
  height:49px;
}
.van-tabbar-item__icon{
  width:27px;
  height:27px;
}
.van-tabbar-item__text span{
  font-size:10px;
}
.tabbar_img{
  width:27px;height:27px;
}
</style>
