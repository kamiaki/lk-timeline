# lk-timeline 王小秋改造自用版本



主要解决了 npm安装之后，直接全屏了的问题，其实就是打包的时候，没用index.js造成的

# Install

From npm:

``` 
npm install aki_vue_timeline --save
```



## 全局使用

main.js

``` 
import LkTimeline from 'lk-timeline'
Vue.use(LkTimeline)
```

用例

``` vue
<template>
  <div>
    <div style="cursor: pointer" @click="getmsg">点我知信息</div>
    <h2
      style="margin:0;text-align:center;">
      {{this.date}}
    </h2>
    <Main @getInitParams="getInitParams"
          @watchDateFun="watchDateFun"
          @watchChange="watchChange"

          :stepTypes="stepTypes"
          :dateSelection="dates"

          :isWarning="true"
          :warningHourRange="3"

          ref="timeLine"
    ></Main>
  </div>
</template>

<script>
  import {dateFormat} from 'aki_js_utils'
  import Main from './components/Main'

  export default {
    name: 'app',
    data() {
      return {
        date: '标题',
        dates: [
          {dateStr: dateFormat(new Date(), 'yyyy-MM-dd'), event: '♦'},
          {
            dateStr: dateFormat(new Date(new Date().setDate(new Date().getDate() - 1)), 'yyyy-MM-dd'),
            event: ''
          },
          {
            dateStr: dateFormat(new Date(new Date().setDate(new Date().getDate() - 2)), 'yyyy-MM-dd'),
            event: ''
          },
          {
            dateStr: dateFormat(new Date(new Date().setDate(new Date().getDate() - 3)), 'yyyy-MM-dd'),
            event: ''
          }
        ],
        stepTypes: ['10', '30', '60', '180']
      }
    },
    components: {
      Main
    },
    mounted() {
      // 获取最近 2 天的日期
    },
    methods: {
      getmsg() {
        // 主动获取 所有帧
        console.info('getDayDateTimes')
        console.info(this.$refs.timeLine.getDayDateTimes());
        // 主动获取 当前帧
        console.info('getTimeLineInfo')
        console.info(this.$refs.timeLine.getTimeLineInfo());
      },
      getInitParams(step) {
        // 获取初始化
        console.info('getInitParams')
        console.info(step)
      },
      watchChange(day) {
        // 改变下拉框
        console.info('watchChange')
        console.info(day)
      },
      watchDateFun(time) {
        // 播放回调
        console.log('watchDateFun')
        console.log(time)
        this.date = time.selectDayDateTime
      }
    }
  }
</script>

```

## 参数 以及方法

``` 
@getInitParams="getInitParams"	// 初始化触发方法
@watchDateFun="watchDateFun"	// 改变帧触发
@watchChange="watchChange"		// 改变 步长 和 时间触发

:stepTypes="stepTypes"	// 步长select options
:dateSelection="dates" // 日期select options

:isWarning="true"		// 是否开启当前预警
:warningHourRange="3"	// 预警天数 前3 后3

// 主动调用方法
ref="timeLine"	
// 主动获取 所有帧
console.info(this.$refs.timeLine.getDayDateTimes());
// 主动获取 当前帧
console.info(this.$refs.timeLine.getTimeLineInfo());
```
