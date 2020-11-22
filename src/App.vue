<template>
  <div>
    <div style="cursor: pointer" @click="getmsg">点我知信息</div>
    <h2
      style="margin:0;text-align:center;">
      {{this.date}}
    </h2>
    <Main @watchDateFun="watchDateFun"
          @watchDate="watchDate"
          @watchStep="watchStep"
          :stepTypes="stepTypes"
          :dateSelection="dates"
          :isWarning="true"
          :warningHourRange="24"
          ref="timeLine"></Main>
  </div>
</template>

<script>
  import {dateFormat} from 'aki_js_utils'
  import Main from './components/Main'

  export default {
    name: 'app',
    data() {
      return {
        date: undefined,
        dates: [
          {dateStr: '2020-11-22', event: '雷电'},
          {dateStr: '2020-11-23', event: '雷电'},
          {dateStr: '2020-11-24', event: ''}
        ],
        stepTypes: ['10', '30', '60', '180']
      }
    },
    components: {
      Main
    },
    mounted() {
      // 获取最近 10 天的日期
      let list = []
      for (let i = 0; i < 10; i++) {
        list.unshift(
          dateFormat(
            new Date(
              new Date().setDate(new Date().getDate() - i)
            ).toLocaleDateString(),
            'MM-dd'
          )
        )
      }
      // this.date = list[0]
      // this.dateTimes = list
      this.date = 'asdsadsa'
    },
    methods: {
      getmsg(){
        console.info(this.$refs.timeLine.getTimeLineInfo());
      },
      watchStep(step) {
        console.info(step)
      },
      watchDate(day) {
        console.info(day)
      },
      watchDateFun(time) {
        console.log(time)
        this.date = time.dateTimes
      }
    }
  }
</script>
