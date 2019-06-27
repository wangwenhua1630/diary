<template>
    <div class="report">
      <div>
        <div class="report_item" v-for="(item,index) in lists" @click="change(index,item.content)">
          <!--<span>{{item.content}}</span>-->
          <span :class="index==lists.length-1?'qita':''">{{item.content}}</span>
          <img src="../../assets/selected.png" alt="" v-if="flag==index">
        </div>
      </div>
      <textarea name="" id="" v-model="textInput" class="report_textarea" placeholder="请输入您的问题"></textarea>
      <div class="report_tiTxt">举报说明性文字</div>
      <button class="report_btn" @click="submit">提交</button>
    </div>
</template>

<script>
  import {reportList,jubao} from '../../api/api'
    export default {
        name: "report",
      data(){
          return{
            lists:[],
            flag:0,
            ids:'',
            textInput:'',
            reportTxt:''
          }
      },
      created(){
        this.ids=sessionStorage.getItem('reportId');
        // this.$toast.loading({
        //   duration:0,
        //   message:'加载中...'
        // })
        reportList().then(res=>{
          // this.$toast.clear();
          if(res.data.flag){
            this.lists=res.data.data
            var obj={id:0,content:'其他'}
            this.lists.push(obj);
            this.reportTxt=res.data.data[0].content;
          }
        }).catch()
      },
      methods:{
        change(n,txt){
          this.flag=n;
          this.reportTxt=txt;
        },
        submit(){
          var text=this.reportTxt+","+this.textInput;
          this.$toast.loading({
            duration:0,
            message:'加载中...'
          })
          jubao(this.ids,this.$route.params.flag,text).then(res=>{
            this.$toast.clear();
            if(res.data.flag){
              this.$toast({
                message:"提交成功"
              })
            }else{
              this.$toast({
                message:res.data.message
              })
            }
          }).catch()
        }
      }
    }
</script>

<style scoped>
.report{
  width:345px;
  padding:0 15px;
  height:100%;
  background: #fff;
}
  .report_item{
    width:100%;
    height:52px;
    display:flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 0.5px solid #ddd;
  }
  .report_item:last-child{
    border-bottom: none;
  }
.report_item>span{
  font-size:16px;
  font-weight:400;
  color:rgba(46,50,51,1);
}
.report_item>span.qita{
  font-weight:500;
  color:rgba(27,193,176,1);
}
  .report_item>img{
    width:27px;
    height:27px;
  }
  .report_textarea{
    padding:15px;
    width:315px;
    height:119.5px;
    background:rgba(247,247,247,1);
    border:0.5px solid rgba(238,238,238,1);
    font-size:14px;
    font-weight:400;
  }
  .report_tiTxt{
    font-size:12px;
    font-weight:400;
    color:rgba(144,151,153,1);
    margin-top:15px;
  }
  .report_btn{
    width:345px;
    height:42px;
    background:rgba(27,193,176,1);
    border-radius:5px;
    margin-top:30px;
    margin-bottom:30px;
    font-size:16px;
    font-weight:400;
    color:rgba(255,255,255,1);
    padding:0;
    border:none;
  }
</style>
