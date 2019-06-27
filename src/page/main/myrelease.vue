<template>
    <div class="myrelease">
      <!--<div>-->
        <!--<button @click="lookThisMonth">查看当月</button>-->
      <!--</div>-->
      <!--<div>-->
        <!--<vue-calendar-swiper-->
          <!--ref="calendar1"-->
          <!--:events="calendar1.events"-->
          <!--:lunar="calendar1.lunar"-->
          <!--:value="calendar1.value"-->
          <!--:values="calendar1.values"-->
          <!--:weeks="calendar1.weeks"-->
          <!--:months="calendar1.months"-->
          <!--:totalMonth="calendar1.totalMonth"-->
          <!--@select="calendar1.select"-->
          <!--@selectMonth="calendar1.selectMonth"-->
          <!--@selectYear="calendar1.selectYear"-->
        <!--&gt;-->
        <!--</vue-calendar-swiper>-->
      <!--</div>-->
      <Calendar
        v-on:choseDay="clickDay"
        v-on:changeMonth="changeDate"
        v-on:isToday="clickToday"
        :markDate=arr
        :sundayStart="true"
      ></Calendar>
      <!--<div class="navBox">-->
        <!--<div class="nav">-->
          <!--<div class="nav_item" :class="flag==0?'nav_active':''" @click="change(0)">全部</div>-->
          <!--<div class="nav_item" :class="flag==1?'nav_active':''" @click="change(1)">文字</div>-->
          <!--<div class="nav_item" :class="flag==2?'nav_active':''" @click="change(2)">图文</div>-->
          <!--<div class="nav_item" :class="flag==3?'nav_active':''" @click="change(3)">图片</div>-->
        <!--</div>-->
      <!--</div>-->
      <div class="c_lists">
        <!--<van-list-->
          <!--v-model="loading"-->
          <!--:finished="finished"-->
          <!--finished-text="没有更多了"-->
          <!--@load="loadMore"-->
          <!--:immediate-check="false"-->
          <!--:offset="10"-->
        <!--&gt;-->
        <div class="c_item" @click="goDetail(item.id)" v-for="(item,index) in lists">
          <!--收藏与举报-->
          <div class="tan_box" v-if="tan==index">
            <div class="tan_item" @click.stop="goRelease(item.type,item.id)">编辑</div>
            <div class="tan_item" @click.stop="delD(item.id,index)">删除</div>
          </div>
          <div class="c_item_header">
            <div class="c_item_left"  @click.stop="goMy">
              <img :src="item.img" alt="" class="c_item_userImg">
              <div class="c_item_userName">
                <div class="name">{{item.name}}</div>
                <div style="display:flex;justify-content: flex-start;align-items: center">
                  <div class="date">{{item.createAt}}</div>
                  <div class="sceret" v-if="item.diaryStatus==0">公开</div>
                  <div class="sceret" v-if="item.diaryStatus==1">私密</div>
                </div>
              </div>
            </div>
            <img src="../../assets/more.png" alt="" class="c_item_right" @click.stop="jumpTan(index)">
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
        </div>
        <!--</van-list>-->
      </div>
    </div>
</template>

<script>
  // import vueCalendarSwiper from 'vue-calendar-swiper/src/components/calendar';
  import Calendar from '../../components/calendar';
  import {mySend,delDiary,mySends,formatDate} from "../../api/api";
  import Vue from 'vue'
  import { ImagePreview } from 'vant';
  Vue.use(ImagePreview);
  export default {
        name: "myrelease",
      data(){
        return{
          flag:0,
          lists:[],
          tan:-1,
          loading: false,
          finished: false,
          ye:1,
          typeFlag:'',
          calendar1:{
            totalMonth:12, //一共显示几个月
            value:[], //默认日期，没有就默认为今天
            values:[],  //有哪些点被选中
            lunar:true,//显示农历
            weeks:['日','一','二','三','四','五','六'],
            months:['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
            events:{},
            select(value){
              console.log(value.toString());
            },
            selectMonth(month,year){
              console.log(month,year);
            },
            selectYear(year){
              console.log(year);
            },
          },
          arr:[]
        }
      },
    created(){
      // this.$toast.loading({
      //   duration:0,
      //   message:'加载中...'
      // })
      // mySend('',1).then(res=>{
      //   this.$toast.clear();
      //   if(res.data.flag){
      //     this.lists=res.data.data;
      //   }
      // }).catch()
      var now=formatDate(new Date());
      // this.$toast.loading({
      //   duration:0,
      //   message:'加载中...'
      // })
      mySends(now).then(res=>{
        // this.$toast.clear();
        if(res.data.flag){
          this.lists=res.data.data.diarys;
          this.arr=res.data.data.date;
        }
      }).catch()
    },
      methods:{
          lookThisMonth(){
            this.$refs.calendar1.setToday();
          },
        clickDay(data) {
          console.log(formatDate(new Date(data))); //选中某天
          var other=formatDate(new Date(data));
          mySends(other).then(res=>{
            if(res.data.flag){
              this.lists=res.data.data.diarys;
              this.arr=res.data.data.date;
            }
          }).catch()
        },
        changeDate(data) {
          console.log(data); //左右点击切换月份
        },
        clickToday(data) {
          //console.log(new Date(data)); //跳到了本月
        },
          change(n){
            this.flag=n;
            this.finished = false;
            if(n==0){
              this.typeFlag=''
              mySend('',1).then(res=>{
                this.$toast.clear();
                if(res.data.flag){
                  this.lists=res.data.data;
                }
              }).catch()
            }else if(n==1){
              this.typeFlag=0
              mySend(0,1).then(res=>{
                this.$toast.clear();
                if(res.data.flag){
                  this.lists=res.data.data;
                }
              }).catch()
            }else if(n==2){
              this.typeFlag=1
              mySend(1,1).then(res=>{
                this.$toast.clear();
                if(res.data.flag){
                  this.lists=res.data.data;
                }
              }).catch()
            }else if(n==3){
              this.typeFlag=2
              mySend(2,1).then(res=>{
                this.$toast.clear();
                if(res.data.flag){
                  this.lists=res.data.data;
                }
              }).catch()
            }
          },
        goDetail(n){
          // sessionStorage.setItem('detailId',n)
          // this.$router.push('/diarydetail')
          this.$router.push({path:'/diarydetail',query:{id:n}});
        },
        goMy(){
          this.$router.push('/my')
        },
        goRelease(n,id){
          this.$router.push({name:'release',params:{type:n,id:id}})
        },
        jumpTan(index){
          if(this.tan==index){
            this.tan=-1
          }else{
            this.tan=index;
          }
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
        //删除日记
        delD(id,index){
          delDiary(id).then(res=>{
            if(res.data.flag){
              this.$toast('删除成功')
              this.lists.splice(index,1);
              this.tan=-1
            }else{
              this.$toast(res.data.message);
            }
          }).catch()
        },
        loadMore(){
          // 异步更新数据
          this.ye+=1;
          mySend(this.typeFlag,this.ye).then(res=>{
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
      },
      components:{
        // vueCalendarSwiper
        Calendar
      }
    }
</script>

<style scoped>
  .myrelease{
    height:100%;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    background: #f1f1f1;
  }
  .navBox{
    width:375px;
    height:50px;
    display: flex;
    justify-content: flex-start;
    align-items: flex-end;
    background: #fff;
    margin-bottom:10px;
  }
  .nav{
    width:345px;
    padding-left:27px;
    height:38px;
    display:flex;
    justify-content: flex-start;
    align-items: center;
  }
  .nav_item{
    font-size:16px;
    font-weight:400;
    color:rgba(46,50,51,1);
    padding-bottom:7px;
    margin-right:36px;
    margin-top:2px;
  }
  .nav_active{
    font-size:18px;
    font-weight:500;
    color:rgba(27,193,176,1);
    border-bottom:2px solid rgba(27,193,176,1);
  }
  .wh_content_item > .wh_isToday{
    background:rgba(27,193,176,1);
  }
  .c_lists{
    margin-top:15px;
  }
  .sceret{
    font-size:10px;
    font-weight:400;
    color:rgba(27,193,176,1);
    margin-left:10px;
  }
</style>
