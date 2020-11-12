<template>
  <div>
    <h2
      style="margin:0;text-align:center;">
      {{this.date}}
    </h2>
    <Main :options="options"
          :dateTimes="dateTimes"
          @getDateFun="getDateFun"
          :interval="interval"
          @getDate="getDate"
          :dateSelection="dates"></Main>
  </div>
</template>

<script>
  import {dateFormat} from './util/formatdate.js'
  import Main from './components/Main'

  export default {
    name: 'app',
    data() {
      return {
        date: '',
        options: {
          speed: 1, // 速度
          speedMax: 10 // 速度最大值
        },
        interval: 200, // 日期间的间隔
        dates: [
          {dateStr: '2020-11-17', event: '雷电'},
          {dateStr: '2020-11-16', event: '雷电'},
          {dateStr: '2020-11-15', event: '雷电'},
          {dateStr: '2020-11-14', event: '雷电'},
          {dateStr: '2020-11-13', event: '雷电'},
          {dateStr: '2020-11-12', event: '雷电'},
          {dateStr: '2020-11-11', event: '雷电'},
          {dateStr: '2020-11-10', event: ''}
        ],
        dateTimes: [
          '01',
          '02',
          '03',
          '04',
          '05',
          '06',
          '07',
          '08',
          '09',
          '10'
        ]
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
      this.date = this.dateTimes[0]
    },
    methods: {
      getDate(day) {
        console.info(day)
      },
      getDateFun(time) {
        console.log(time)
        this.date = time.time
      }
    }
  }
</script>
