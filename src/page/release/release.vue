<template>
    <div class="release">
      <!--文字输入-->
      <textarea v-if="types==0||types==1" name="" id="" v-model="inputText" class="re_textarea" placeholder="写点什么吧" ref="elememt" @input="autoTextarea" :style=""></textarea>
      <!--图片上传-->
      <div class="re_upload" v-if="types==2||types==1">
        <div class="re_item" v-for="(item,index) in imgList">
          <img :src="item" alt="" class="re_img_item">
          <div class="re_item_del" @click="del(index)">+</div>
        </div>
        <!--<van-uploader :after-read="onRead" class="re_upload_box"  multiple  v-if="imgList.length<9">-->
            <!--<img src="../../assets/addImg.png" alt="" class="re_upload_img">-->
        <!--</van-uploader>-->
        <div class="re_upload_box"   v-if="imgList.length<9">
          <input type="file" class="img_upload"  multiple @change="upLoad">
          <img src="../../assets/addImg.png" alt="" class="re_upload_img">
        </div>
      </div>
      <!--分类-->
      <div class="release_style">
        <div class="re_s_item" :class="item.isCheck==1?'r5':''" v-for="(item,index) in tagList" @click="select(item.id,index)">{{item.content}}</div>
      </div>
      <!--公开隐私-->
      <div class="secret">
        <span class="secret_txt">隐私</span>
        <div class="secret_switch">
          <span class="ss_txt">关</span>
          <van-switch
            v-model="checked"
            active-color="#1BC1B0"
            size="25px"
          />
          <span class="ss_txt">开</span>
        </div>
      </div>

      <!--发布-->
      <button class="re_submit" @click="release">发布</button>
    </div>
</template>

<script>
  import {tag,release,editDiary,upLoadImg,releases} from '../../api/api'
    export default {
        name: "release",
      data(){
          return{
            inputText:'',
            isHeight:true,
            minHeight:0,
            checked:false,
            tagList:[],
            // tagFlag:-1,
            // tagId:'',
            imgList:[],
            imgLists:[],
            types:'',
            ids:'',
          }
      },
      created(){
        this.types=this.$route.params.type;
        // console.log(this.$route.params.type);
        if(this.$route.params.id){
          this.ids=this.$route.params.id
          // this.$toast.loading({
          //   duration:0,
          //   message:'加载中...'
          // })
          editDiary(this.ids).then(res=>{
            // this.$toast.clear();
            if(res.data.flag){
              this.inputText=res.data.data.content;
              this.tagList=res.data.data.categorys;
              this.imgList=res.data.data.imgUrls;
              console.log(this.tagList)
              console.log(this.imgList)
              if(res.data.data.status){
                this.checked=true
              }else{
                this.checked=false
              }
            }
          }).catch()
        }else{
          // this.$toast.loading({
          //   duration: 0,
          //   message: '加载中...'
          // });
          tag().then(res=>{
            console.log(res);
            // this.$toast.clear();
            if(res.data.flag){
              this.tagList=res.data.data;
            }
          }).catch()
        }

      },
      methods:{
        autoTextarea() {
          var extra = 0,   //设置光标与输入框保持的距离(默认0)
            maxHeight = 667; //设置最大高度(可选)
          var _that = this;
          var isFirefox = !!document.getBoxObjectFor || 'mozInnerScreenX' in window,
            isOpera = !!window.opera && !!window.opera.toString().indexOf('Opera');
          var paddingTop,paddingBottom
          var style,_length,valueLength,stylHeight,scrollHeight,currHeight;

          this.$nextTick(function () {
            if(this.isHeight){
              this.isHeight =  false
              this.minHeight = parseFloat(window.getComputedStyle(this.$refs.elememt).height)
            }

            paddingTop = parseInt(window.getComputedStyle(this.$refs.elememt).paddingTop)
            paddingBottom = parseInt(window.getComputedStyle(this.$refs.elememt).paddingBottom)
            style = this.$refs.elememt.style
            _length = this.$refs.elememt._length
            valueLength = this.$refs.elememt.value.length
            stylHeight = this.$refs.elememt.style.height
            scrollHeight = this.$refs.elememt.scrollHeight
            currHeight = this.$refs.elememt.currHeight

            change()
          })

          function change(){
            var  height, padding = 0;

            if (_length === valueLength) return;
            _length = valueLength;

            if (!isFirefox && !isOpera) {
              padding = paddingTop + paddingBottom;
            };
            stylHeight = _that.minHeight + 'px';  //30px
            console.log(scrollHeight,_that.minHeight,maxHeight,padding)
            if (scrollHeight > _that.minHeight) {
              if (maxHeight && scrollHeight > maxHeight) {
                height = maxHeight - padding;
//              style.overflowY = 'auto';
                style.overflowY = 'hidden';
              } else {
                height = scrollHeight - padding;      //undefined 30 9
                style.overflowY = 'hidden';
              };

              style.height = height + extra + 'px';
              console.log(style)
              currHeight = parseInt(style.height);
            };
          }
        },
        upLoad(e){
          console.log(e);
          var files=e.target.files;
          for(var i=0;i<files.length;i++){
            console.log(files[i]);
            this.imgLists.push(files[i]);
          }
          let formData=new FormData();
          for(let i=0;i<files.length;i++){
            formData.append('files',files[i]);
          }
          if(this.imgList.length+files.length>9){
            this.$toast('发表图片不能超过9张')
          }else{
            this.$toast({
              duration:0,
              message:'上传中...'
            })
            upLoadImg(formData).then(res=>{
              this.$toast.clear()
              if(res.data.flag){
                for(var i=0;i<res.data.data.length;i++){
                  this.imgList.push(res.data.data[i])
                }
              }else{
                this.$toast(res.data.message);
              }
            }).catch()
          }

        },
        onRead(file,detail){
          console.log(file);
          console.log(detail);
          if(file.length){
            if(this.imgList.length+file.length>9){
              this.$toast({
                duration: 1500,
                message: '发表图片不能超过9张'
              });
            }else{
              for(var i=0;i<file.length;i++){
                this.imgList.push(file[i].content)
                console.log(file[i].file);
                this.imgLists.push(file[i].file);
              }
            }
          }else{
            this.imgList.push(file.content)
            console.log(file.file);
            this.imgLists.push(file.file);
            console.log(this.imgLists);
          }
        },
        //选择标签
        select(id,num){
          // console.log(id,num);
          // this.tagId=id;
          // this.tagFlag=num;
          if(this.tagList[num].isCheck){
            this.tagList[num].isCheck=0
          }else{
            this.tagList[num].isCheck=1
          }
        },
        //删除图片
        del(index){
          this.imgList.splice(index,1);
          this.imgLists.splice(index,1);
        },
        //发表
        release(){
          var arr=[];
          for(var i=0;i<this.tagList.length;i++){
            if(this.tagList[i].isCheck){
              arr.push(this.tagList[i].id)
            }
          }
          //隐私判断
          var status;
          if(this.checked){
            status=1;
          }else{
            status=0;
          }
          //发文解码
          var txt=encodeURIComponent(this.inputText)
          if(this.ids){
            if(this.types==0){
              if(this.inputText==''){
                this.$toast({
                  message:'说点什么吧...'
                })
              }else{
                this.$toast({
                  duration:0,
                  message:'发布中'
                })
                releases(this.ids,txt,this.types,status,arr,this.imgList).then(res=>{
                  this.$toast.clear();
                  if(res.data.flag){
                    this.$toast({
                      message:'发布成功'
                    })
                  }else{
                    this.$toast({
                      message:res.data.message
                    })
                  }
                }).catch()
              }
            }else if(this.types==2){
              if(this.imgList.length==0){
                this.$toast({
                  message:'发点图片吧...'
                })
              }else{
                this.$toast({
                  duration:0,
                  message:'发布中'
                })
                releases(this.ids,txt,this.types,status,arr,this.imgList).then(res=>{
                  this.$toast.clear();
                  if(res.data.flag){
                    this.$toast({
                      message:'发布成功'
                    })
                  }else{
                    this.$toast({
                      message:res.data.message
                    })
                  }
                }).catch()
              }
            }else{
              if(this.inputText==''&&this.imgList.length==0){
                this.$toast({
                  message:'说点什么吧...'
                })
              }else{
                this.$toast({
                  duration:0,
                  message:'发布中'
                })
                releases(this.ids,txt,this.types,status,arr,this.imgList).then(res=>{
                  this.$toast.clear();
                  if(res.data.flag){
                    this.$toast({
                      message:'发布成功'
                    })
                  }else{
                    this.$toast({
                      message:res.data.message
                    })
                  }
                }).catch()
              }
            }
          }else{
            // let formData=new FormData();
            // for(let i=0;i<this.imgLists.length;i++){
            //   formData.append('files',this.imgLists[i]);
            // }
            // formData.append('content',txt);
            // formData.append('type',this.types)
            // formData.append('status',status)
            // formData.append('categoryIds',arr)
            if(this.types==0){
              if(this.inputText==''){
                this.$toast({
                  message:'说点什么吧...'
                })
              }else{
                this.$toast({
                  duration:0,
                  message:'发布中'
                })
                release(txt,this.types,status,arr,this.imgList).then(res=>{
                  this.$toast.clear();
                  if(res.data.flag){
                    this.$toast({
                      message:'发布成功'
                    })
                  }else{
                    this.$toast({
                      message:res.data.message
                    })
                  }
                }).catch()
              }
            }else if(this.types==2){
              if(this.imgList.length==0){
                this.$toast({
                  message:'发点图片吧...'
                })
              }else{
                this.$toast({
                  duration:0,
                  message:'发布中'
                })
                release(txt,this.types,status,arr,this.imgList).then(res=>{
                  this.$toast.clear();
                  if(res.data.flag){
                    this.$toast({
                      message:'发布成功'
                    })
                  }else{
                    this.$toast({
                      message:res.data.message
                    })
                  }
                }).catch()
              }
            }else{
              if(this.inputText==''&&this.imgList.length==0){
                this.$toast({
                  message:'说点什么吧...'
                })
              }else{
                this.$toast({
                  duration:0,
                  message:'发布中'
                })
                release(txt,this.types,status,arr,this.imgList).then(res=>{
                  this.$toast.clear();
                  if(res.data.flag){
                    this.$toast({
                      message:'发布成功'
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
        }
      },
      watch:{
      }
    }
</script>

<style scoped>
.release{
  height:100%;
  background: #fff;
  padding:0 15px;
}
.release:before{
  display:table;
  content: '';
}
  .re_textarea{
    width:325px;
    min-height: 60px;
    border:none;
    border-bottom: 0.5px solid #ddd;
    padding:10px;
    font-size:18px;
    font-weight:500;
    color:rgba(153,153,153,1);
    /*margin-bottom:20px;*/
  }
  .re_upload{
    width:345px;
    display:flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    margin-top:20px;
  }
  .re_upload_box{
    width:100px;
    height:100px;
    background:rgba(238,238,238,1);
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom:15px;
    position: relative;
  }
  .img_upload{
    width:100px;
    height:100px;
    border:none;
    position: absolute;
    top:0;
    left:0;
    opacity: 0;
  }
  .re_upload_img{
    width:40px;
    height:40px;
  }
  .re_item{
    position: relative;
    margin-right:20px;
    margin-bottom:15px;
  }
  .re_img_item{
    width:100px;
    height:100px;
  }
  .re_item_del{
    width:15px;
    height:15px;
    border-radius: 50%;
    background: red;
    color:#fff;
    transform: rotate(45deg);
    font-size:16px;
    text-align: center;
    line-height: 15px;
    position: absolute;
    top:-5px;
    right:-5px;
  }
.re_item:nth-child(3n+3){
  margin-right:0px;
  }
  .release_style{
    margin-top:15px;
    width:345px;
    display: flex;
    flex-wrap: wrap;
    justify-content:flex-start;
    align-items: center;
  }
  .re_s_item{
    width:48px;
    height:17px;
    background:rgba(27,193,176,0.5);
    border-radius:3px;
    font-size:10px;
    font-weight:400;
    color:rgba(255,255,255,1);
    line-height: 20px;
    margin-right:15px;
    text-align: center;
    margin-bottom:10px;
  }
  .r2{
    background:rgba(255,186,62,0.5);
  }
  .r3{
    background:rgba(61,202,212,0.5);
  }
  .r4{
    background:rgba(255,81,120,0.5);
  }
  .r5{
    background:rgba(190,53,181,0.5);
  }
  .re_submit{
    width:345px;
    height:40.5px;
    background:rgba(27,193,176,1);
    border-radius:3px;
    margin-top:20px;
    text-align: center;
    line-height: 40.5px;
    font-size:18px;
    font-weight:400;
    color:rgba(255,255,255,1);
    border: none;
  }
  .secret{
    width:345px;
    height:30px;
    margin-top:20px;
    display: flex;
    justify-content:space-between;
    align-items: center;
  }
  .secret_txt{
    font-size:16px;
    font-weight:400;
  }
  .secret_switch{
    width:100px;
    display: flex;
    justify-content:space-between;
    align-items: center;
  }
  .ss_txt{
    font-size:14px;
    font-weight:400;
  }
</style>
