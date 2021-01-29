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
        console.info('getDayDateTimes')
        console.info(this.$refs.timeLine.getDayDateTimes());
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
