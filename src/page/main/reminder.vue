<template>
    <div class="reminder">
      <div class="reminder_header">
        <div class="reminder_left">
          <img src="../../assets/timeti.png" alt="" class="r_l_img">
          <span class="r_l_txt">每日提醒</span>
        </div>
        <div class="r_l_r">
          <van-switch
            v-model="checked"
            active-color="#1BC1B0"
            size="25px"
            @input="onInput"
          />
        </div>
      </div>
      <div class="reminder_time">
        <span>时</span>
        <div class="hours" @click="hoursShow">{{hours}}</div>
        <span>分</span>
        <div class="seconds" @click="secondShow">{{minutes}}</div>
      </div>
      <button class="re_btn" @click="set">确定</button>

      <!--小时弹出层-->
      <van-popup v-model="show" position="bottom">
        <van-picker
          show-toolbar
          :columns="columns"
          @cancel="onCancel"
          @confirm="onConfirm"
          :default-index='m'
        />
      </van-popup>
      <!--分钟弹出层-->
      <van-popup v-model="shows" position="bottom">
        <van-picker
          show-toolbar
          :columns="columnss"
          @cancel="onCancels"
          @confirm="onConfirms"
          :default-index="n"
        />
      </van-popup>
    </div>
</template>

<script>
  import {timeTi,setTime} from "@/api/api";
  export default {
        name: "reminder",
      data(){
          return{
            checked:true,
            hours:'00',
            minutes:'00',
            m:0,
            n:0,
            show:false,
            shows:false,
            columns: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12','13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
            columnss: ['00', '01', '02', '03', '04','05', '06', '07', '08', '09','10', '11', '12', '13', '14','15', '16', '17', '18', '19','20', '21', '22', '23', '24','25', '26', '27', '28', '29','30', '31', '32', '33', '34','35', '36', '37', '38', '39','40', '41', '42', '43', '44','45', '46', '47', '48', '49','50', '51', '52', '53', '54','55', '56', '57', '58', '59']
          }
      },
      created(){
        // this.$toast.loading({
        //   duration:0,
        //   message:'加载中...'
        // })
        timeTi().then(res=>{
          // this.$toast.clear();
          if(res.data.flag){
            if(res.data.data.remind){
              this.checked==true
            }else{
              this.checked=false
            }
            this.hours=(res.data.data.remindHour>=10?res.data.data.remindHour:'0'+res.data.data.remindHour);
            this.minutes=(res.data.data.remindMinute>=10?res.data.data.remindMinute:'0'+res.data.data.remindMinute);
            this.m=parseInt(res.data.data.remindHour)-1;
            this.n=parseInt(res.data.data.remindMinute);
          }else{
            this.$toast(res.data.message);
          }
        }).catch()
      },
      methods:{
        hoursShow(){
          this.show=true
        },
        secondShow(){
          this.shows=true
        },
        onConfirm(value, index) {
          // this.$toast(`当前值：${value}, 当前索引：${index}`);
          this.hours=value;
          this.show=false
        },
        onCancel() {
          // this.$toast('取消');
          this.show=false
        },
        onConfirms(value, index) {
          // this.$toast(`当前值：${value}, 当前索引：${index}`);
          this.minutes=value;
          this.shows=false
        },
        onCancels() {
          // this.$toast('取消');
          this.shows=false
        },
        onInput(checked) {
          if(checked){
            this.$dialog.confirm({
              title: '提醒',
              message: '是否打开提醒？'
            }).then(() => {
              this.checked = checked;
            }).catch(()=>{
              this.checked = !checked;
            });
          }else{
            this.$dialog.confirm({
              title: '提醒',
              message: '是否关闭提醒？'
            }).then(() => {
              this.checked = checked;
            }).catch(()=>{
              this.checked = !checked;
            });
          }

        },
        set(){
          var flag;
          if(this.checked){
            flag=1
          }else{
            flag=0
          }
          setTime(this.hours,this.minutes,flag).then(res=>{
            if(res.data.flag){
              this.$toast("设置成功")
            }else{
              this.$toast(res.data.message)
            }
          }).catch()
        }
      }
    }
</script>

<style scoped>
  .reminder{
    height:100%;
    background: #fff;
  }
  .reminder:before{
    display: table;
    content: '';
  }
  .reminder_header{
    width:345px;
    margin:20px auto 0;
    height:54px;
    border-bottom: 0.5px solid #ddd;
    display:flex;
    justify-content: space-between;
    align-items: center;
  }
  .reminder_left{
    display:flex;
    justify-content: flex-start;
    align-items: center;
  }
  .r_l_img{
    width:26px;
    height:26px;
    margin-right:9px;
  }
  .r_l_txt{
    font-size:18px;
    font-weight:500;
    color:rgba(46,50,51,1);
  }
  .reminder_time{
    width:375px;
    height:65px;
    display:flex;
    justify-content: center;
    align-items: center;
    font-size:16px;
    font-weight:400;
    color:rgba(46,50,51,1);
  }
  .hours,.seconds{
    width:60px;
    height:34px;
    line-height: 34px;
    background:rgba(238,238,238,1);
    border-radius:5px 0px 0px 5px;
    border:none;
    margin:0 5px;
    text-align: center;
    font-size:18px;
    font-weight:500;
    color:rgba(46,50,51,1);
  }
  .seconds{
    border-radius:0px 5px 5px 0px;
    margin:0 5px;
  }
  .re_btn{
    width:345px;
    height:42px;
    background:rgba(27,193,176,1);
    border-radius:5px;
    position: fixed;
    bottom:80px;
    left:15px;
    padding:0;
    border:none;
    font-size:16px;
    font-weight:400;
    color:rgba(255,255,255,1);
  }
</style>
