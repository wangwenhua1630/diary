<template>
  <div id="app">
    <!--<img src="./assets/logo.png">-->
    <div v-wechat-title="$route.meta.title"></div>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  data(){
    return{
      selected:''
    }
  },
  watch: {
    $route(to, from) {
      if(to.path=='/home'){
        this.selected=0
      }else if(to.path=='/wenzi'){
        this.selected=1
      }else if(to.path=='/tuwen'){
        this.selected=2
      }else if(to.path=='/main'){
        this.selected=3
      }
      localStorage.setItem('selected',this.selected);
    }
  }
}
</script>

<style>
  html,body{
    height:100%;
    background: #f7f7f7;
    overflow-y: auto;
  }
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*text-align: center;*/
  /*color: #2c3e50;*/
  /*margin-top: 60px;*/
  height:100%;
}

  .c_lists{
    width:375px;
  }
  .c_item{
    width:345px;
    padding:15px;
    background: #fff;
    margin-bottom:10px;
    position: relative;
  }
  .c_item_header{
    height:40px;
    display:flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom:10px;
  }
  .c_item_left{
    display:flex;
    justify-content: flex-start;
    align-items: center;
  }
  .c_item_userImg{
    width:40px;
    height:40px;
    border-radius: 50%;
    margin-right:15px;
  }
  .c_item_userName{
    font-size:16px;
    font-weight:500;
    color:rgba(46,50,51,1);
  }
  .c_item_right{
    width:25px;
    height:5px;
  }
  .c_item_txt{
    font-size:14px;
    font-weight:400;
    color:rgba(96,100,102,1);
    margin-bottom:10px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 6;
  }
  .c_item_imgList{
    display:flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    margin-bottom:15px;
  }
  .c_item_imgList1{
    width:228px;
    display:flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
  }
  .c_item_imgOne{
    width:100%;
    max-height:160px;
    overflow: hidden;
  }
  .c_item_imgOne>img{
    max-width: 100%;
  }
  .c_item_img,.c_item_img1{
    width:110px;
    height:75px;
    border-radius:3px;
    overflow: hidden;
    margin-right:7.5px;
    margin-bottom:7.5px;
  }
  .c_item_img1{
    margin-right:0px;
  }
  .c_item_img:nth-child(3n+3){
    margin-right:0px;
  }
  .c_item_img>img{
    width:100%;
  }
  .c_item_img1>img{
    width:100%;
  }
  .c_item_btnGroup{
    display:flex;
    justify-content: space-around;
    align-items: center;
    margin-top:15px;
  }
  .good{
    width:20px;
    height:20px;
    position:relative;
  }
  .good>img{
    width:20px;
    height:20px;
  }
  .ti_num{
    position: absolute;
    right:-15px;
    top:0;
    font-size:10px;
    font-weight:400;
    color:rgba(144,151,153,1);
  }
  .tan_box{
    width:80px;
    position: absolute;
    right:15px;
    top:60px;
    box-shadow:0px 2px 6px 0px rgba(0,0,0,0.3);
    border-radius:6px;
    z-index: 10;
  }
  .tan_item{
    width:80px;
    height:35px;
    border-bottom:1px solid #ddd;
    text-align: center;
    line-height: 35px;
    font-size:14px;
    font-weight:400;
    color:rgba(51,51,51,1);
    background: #fff;
  }
  .tan_item:last-child{
    border:none;
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
  .share_shadow{
    position:fixed;
    top:0;
    right:0;
    bottom:0;
    left:0;
    background: rgba(0,0,0,0.6);
    z-index: 200;
    display:flex;
    justify-content: center;
    align-items: flex-start;
  }
  .share_shadow img{
    margin-top:10px;
  }
</style>
