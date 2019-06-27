<template>
  <div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh"  class="message">
      <div class="c_lists">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="loadMore"
          :immediate-check="false"
          :offset="10"
        >
          <div class="c_item"  @click="goDetail(item.diaryId,item.type)" v-for="(item,index) in lists">
            <!--收藏与举报-->
            <div class="tan_box"  v-if="tan==index">
              <div class="tan_item" v-if="item.type==0" @click.stop="siHui(item.id)">回复</div>
              <div class="tan_item" @click.stop="del(item.id,index)">删除</div>
            </div>
            <div class="c_item_header">
              <div class="c_item_left">
                <img :src="item.img" alt="" class="c_item_userImg" @click.stop="goMy(item.userId)">
                <div class="c_item_userName">
                  <div class="name">{{item.name}}</div>
                  <div class="date">{{item.createAt}}</div>
                </div>
                <div class="ping_txt">{{item.title}}</div>
              </div>
              <img src="../../assets/more.png" alt="" class="c_item_right" v-if="n==2"   @click.stop="jumpTan(index)">
            </div>
            <div class="message_replay" v-if="item.comment">
              <div class="m_r_txt">回复:</div>
              <div class="m_r_msg">{{item.comment}}</div>
            </div>
            <div class="c_item_txt">{{item.content}}</div>
          </div>
        </van-list>
      </div>
    </van-pull-refresh>
    <!--回复框-->
    <div class="replay" v-if="reFlag">
      <input type="text" v-model="replyTxt" class="replay_input" :placeholder="dateinit">
      <button class="replay_btn" @click="reHui">回复</button>
    </div>
  </div>
</template>

<script>
  import {myMsg,delMsg,reSi} from '../../api/api'
    export default {
        name: "message",
      data(){
          return{
            lists:[],
            tan:-1,
            isLoading: false,
            loading: false,
            finished: false,
            ye:1,
            replyTxt:'',
            dateinit:'回复:',
            reFlag:false,
            ids:'',
            n:''
          }
      },
      created(){
          // this.$toast.loading({
          //   duration:0,
          //   message:'加载中...'
          // })
        this.n=sessionStorage.getItem('msgFlag');
        myMsg(1,this.n).then(res=>{
          // this.$toast.clear();
          if(res.data.flag){
            console.log(res.data);
            this.lists=res.data.data;
          }
        }).catch()
      },
      methods:{
        jumpTan(index){
          if(this.tan==index){
            this.tan=-1
          }else{
            this.tan=index;
          }
        },
        goDetail(n,index){
          if(index){
            // sessionStorage.setItem('detailId',n)
            // this.$router.push('/diarydetail')
            this.$router.push({path:'/diarydetail',query:{id:n}});
          }
        },
        goMy(n){
          sessionStorage.setItem('myId',n)
          this.$router.push('/my')
        },
        //下拉刷新
        onRefresh() {
          myMsg(1,this.n).then(res=>{
            if(res.data.flag){
              this.$toast('刷新成功');
              this.isLoading = false;
              this.lists=res.data.data;
            }else{
              this.isLoading = false;
              this.$toast({
                message:res.data.message
              })
            }
          }).catch()
        },
        loadMore(){
          // 异步更新数据
          this.ye+=1;
          myMsg(this.ye,this.n).then(res=>{
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
        //删除消息
        del(id,index){
          delMsg(id).then(res=>{
            if(res.data.flag){
              this.$toast('删除成功')
              this.lists.splice(index,1);
              this.tan=-1
            }else{
              this.$toast(res.data.message);
            }
          }).catch()
        },
        //私信回复
        siHui(id){
          this.tan=-1
          this.reFlag=true;
          this.ids=id;
        },
        reHui(){
          reSi(this.ids,this.replyTxt).then(res=>{
            this.reFlag=false
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
  .message{
    height:100%;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
.tan_box{
  top:45px;
}
  .c_item_txt{
    box-sizing: border-box;
    padding:10px;
    margin-bottom: 0;
    background:rgba(247,247,247,1);
    border-radius:3px;
  }
  .ping_txt{
    height:35px;
    font-size:14px;
    font-weight:400;
    color:rgba(46,50,51,1);
    margin-left:9px;
  }
  .message_replay{
    width:345px;
    display:flex;
    justify-content: space-between;
    align-items: flex-start;
    padding-bottom:10px;
    border-bottom: 0.5px solid #ddd;
    margin-bottom:10px;
  }
  .m_r_txt{
    width:42px;
    font-size:14px;
    font-weight:400;
    color:rgba(46,50,51,1);
  }
  .m_r_msg{
    width:330px;
    font-size:14px;
    font-weight:400;
    color:rgba(46,50,51,1);
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
