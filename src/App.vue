<template>
  <div>
    <div style="cursor: pointer" @click="getmsg">点我知信息</div>
    <h2
      style="margin:0;text-align:center;">
      {{this.date}}
    </h2>
    <div class="timeline_div">
      <Main @getInitParams="getInitParams"
            @watchDateFun="watchDateFun"
            @watchChange="watchChange"
            :stepTypes="stepTypes"
            :dateSelection="dates"
            :isWarning="false"
            :warningHourRange="3"
            ref="timeLine"
      ></Main>
    </div>
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
      setInterval(() => {
        console.info('refreshtimeline')
        this.dates = [
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
        ]
        this.$refs.timeLine.refreshTimeLine()
      }, 2000)
      // 获取最近 2 天的日期
    },
    methods: {
      getmsg() {
        this.$refs.timeLine.refreshTimeLine()
        // 主动获取 所有帧
        // console.info('getDayDateTimes')
        // console.info(this.$refs.timeLine.getDayDateTimes());
        // 主动获取 当前帧
        // console.info('getTimeLineInfo')
        // console.info(this.$refs.timeLine.getTimeLineInfo());
      },
      getInitParams(step) {
        // 获取初始化
        // console.info('getInitParams')
        // console.info(step)
      },
      watchChange(day) {
        // 改变下拉框
        // console.info('watchChange')
        // console.info(day)
      },
      watchDateFun(time) {
        // 播放回调
        // console.log('watchDateFun')
        // console.log(time)
        this.date = time.selectDayDateTime
      }
    }
  }
</script>
<style>
  .timeline_div {
    background-color: rgba(17, 28, 110, 0.3);
    border-radius: 10px;
    position: absolute;
    bottom: 5px;
    left: 0;
    right: 0;
    margin: 0 auto;
    width: 55%;
    z-index: 999;
  }
</style>
