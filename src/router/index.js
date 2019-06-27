import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import first from '@/page/first/first'
import home from '@/page/home/home'
import search from '@/page/home/search'
import userMore from '@/page/home/userMore'
import main from '@/page/main/main'
import diarydetail from '@/page/diarydetail/diarydetail'
import my from '@/page/main/my'
import message from '@/page/main/message'
import myrelease from '@/page/main/myrelease'
import myfollow from '@/page/main/myfollow'
import myfollows from '@/page/main/myfollows'
import mycollect from '@/page/main/mycollect'
import reminder from '@/page/main/reminder'
import release from '@/page/release/release'
import report from '@/page/report/report'
import wenzi from '@/page/common/wenzi'
import tuwen from '@/page/common/tuwen'
import myGood from '@/page/main/mygood'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path:'/first',
      name:'first',
      component:first,
      children:[
        {
          path: '/home',
          name: 'home',
          component: home,
          meta:{
            title:'日记本'
          }
        },
        {
          path: '/wenzi',
          name: 'wenzi',
          component: wenzi,
          meta:{
            title:'文字'
          }
        },
        {
          path: '/tuwen',
          name: 'tuwen',
          component: tuwen,
          meta:{
            title:'图文'
          }
        },
        {
          path: '/main',
          name: 'main',
          component: main,
          meta:{
            title:'个人中心'
          }
        }
      ]
    },
    {
      path:'/search',
      name:'search',
      component:search,
      meta:{
        title:'搜索'
      }
    },
    {
      path:'/userMore',
      name:'userMore',
      component:userMore,
      meta:{
        title:'用户'
      }
    },
    {
      path:'/diarydetail',
      name:'diarydetail',
      component:diarydetail,
      meta:{
        title:'笔记详情'
      }
    },
    {
      path:'/my',
      name:'my',
      component:my,
      meta:{
        title:'个人主页'
      }
    },
    {
      path:'/message',
      name:'message',
      component:message,
      meta:{
        title:'我的消息'
      }
    },
    {
      path:'/myrelease',
      name:'myrelease',
      component:myrelease,
      meta:{
        title:'我的发布'
      }
    },
    {
      path:'/myfollow',
      name:'myfollow',
      component:myfollow,
      meta:{
        title:'我的关注'
      }
    },
    {
      path:'/myfollows',
      name:'myfollows',
      component:myfollows,
      meta:{
        title:'我的粉丝'
      }
    },
    {
      path:'/mycollect',
      name:'mycollect',
      component:mycollect,
      meta:{
        title:'我的收藏'
      }
    },
    ,
    {
      path:'/myGood',
      name:'myGood',
      component:myGood,
      meta:{
        title:'好友圈'
      }
    },
    {
      path:'/reminder',
      name:'reminder',
      component:reminder,
      meta:{
        title:'时间提醒'
      }
    },
    {
      path:'/release',
      name:'release',
      component:release,
      meta:{
        title:'发布内容'
      }
    },
    {
      path:'/report',
      name:'report',
      component:report,
      meta:{
        title:'举报'
      }
    },
    {
      path:'/',
      redirect:'/home'
    }
  ]
})
