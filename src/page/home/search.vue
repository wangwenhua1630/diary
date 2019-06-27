<template>
    <div class="searchBox">
      <div class="home_header">
        <div class="search">
          <div class="search_box">
            <input type="text" v-model="searchTxt" class="search_input" placeholder="搜索文章/个人">
            <img src="../../assets/search.png" alt="" class="search_img">
          </div>
          <span class="search_cancel" @click="search(searchTxt)">确认</span>
        </div>
        <div class="nav">
          <div class="nav_box">
            <div class="nav_item" :class="flag==0?'nav_active':''" @click="change(0,5)">全部</div>
            <div class="nav_item" :class="flag==1?'nav_active':''" @click="change(1,10)">用户</div>
            <div class="nav_item" :class="flag==2?'nav_active':''" @click="change(2,5)">日记</div>
          </div>
        </div>
      </div>
      <!--搜索人物列表-->
      <div class="search_people_box" v-if="userLists.length>0&&flag==0">
        <div class="p_box_item" v-for="(item,index) in userLists" @click="goMy(item.id)">
          <img :src="item.img" alt="">
          <div>{{item.name}}</div>
        </div>
        <div class="p_box_item"  v-if="userLists.length==5" @click="more">
          <img src="../../assets/wei.png" alt="">
          <div>更多</div>
        </div>
      </div>
      <!--搜索日记列表-->
      <div class="c_lists" v-if="lists.length>0&&flag!=1">
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
              <div class="good"><img src="../../assets/share.png" alt=""></div>
            </div>
          </div>
        </van-list>

      </div>
      <!--搜索用户-->
      <div class="c_lists" v-if="flag==1&&userLists.length>0">
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
  import {zan,shoucang,reSearch,focus} from '../../api/api'
  import Vue from 'vue';
  import { ImagePreview } from 'vant';
  Vue.use(ImagePreview);
  export default{
    name: "search",
    data(){
      return{
        flag:0,
        userFlag:0,
        lists:[],
        userLists:[],
        tan:-1,
        loading: false,
        finished: false,
        loadings: false,
        finisheds: false,
        ye:1,
        ids:'',
        searchTxt:''
      }
    },
    created(){
      this.searchTxt=sessionStorage.getItem('searchTxt');
      reSearch(0,this.searchTxt,this.ye,5).then(res=>{
        console.log(res);
        if(res.data.flag){
          this.lists=res.data.data.diarys;
          this.userLists=res.data.data.users
        }else{
          this.$toast(res.data.message);
        }
      }).catch()
    },
    mounted(){

    },
    methods:{
      change(e,limit){
        this.flag=e;
        this.ye=1;
        this.finished = false;
        this.finisheds = false;
        reSearch(e,this.searchTxt,this.ye,limit).then(res=>{
          console.log(res);
          if(res.data.flag){
            this.lists=res.data.data.diarys;
            this.userLists=res.data.data.users
          }else{
            this.$toast(res.data.message);
          }
        }).catch()
      },
      //搜索
      search(txt){
        this.flag=0;
        sessionStorage.setItem('searchTxt',txt)
        this.$toast.loading({
          duration:0,
          message:'加载中'
        })
        reSearch(0,this.searchTxt,this.ye,5).then(res=>{
          this.$toast.clear();
          console.log(res);
          if(res.data.flag){
            this.lists=res.data.data.diarys;
            this.userLists=res.data.data.users
          }else{
            this.$toast(res.data.message);
          }
        }).catch()
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
      goMy(n){
        sessionStorage.setItem('myId',n)
        this.$router.push('/my')
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
      //更多
      more(){
        // this.$router.push({name:'userMore',params:{text:txt}})
        this.$router.push('/userMore');
      },
      loadMore(){
        // 异步更新数据
        this.ye+=1;
        reSearch(this.flag,this.searchTxt,this.ye,5).then(res=>{
          console.log(res);
          if(res.data.flag){
            for (let i = 0; i < res.data.data.diarys.length; i++) {
              this.lists.push( res.data.data.diarys[i]);
            }
            console.log(this.lists)
            this.loading = false;
            // 数据全部加载完成
            if (res.data.data.diarys.length < 5) {
              console.log(1);
              this.finished = true;
              this.$toast({
                message:'没有更多了'
              })
            }
          }
        }).catch()
      },
      loadMores(){
        // 异步更新数据
        this.ye+=1;
        reSearch(1,this.searchTxt,this.ye,10).then(res=>{
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
.searchBox{
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
  padding-left:27px;
  height:35px;
  overflow-x: auto;
}
.nav_box{
  width:300px;
  display:flex;
  justify-content: flex-start;
  align-items: center;
}
.nav_item{
  /*display: inline-block;*/
  width:40px;
  text-align: center;
  font-size:16px;
  font-weight:400;
  color:rgba(46,50,51,1);
  padding-bottom:4px;
  margin-right:27px;
  margin-top:2px;
}
.nav_active{
  font-size:18px;
  font-weight:500;
  color:rgba(27,193,176,1);
  border-bottom:2px solid rgba(27,193,176,1);
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
.myfollow_box{
  /*height:100%;*/
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
