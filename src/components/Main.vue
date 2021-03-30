<template>
  <div class="timeline_main">
    <div class="timeline_control">
      <!--播放-->
      <div class="menu_play">
        <i class="menu_icon icon_left"
           :class="{'menu_icon_disabled':playing}"
           @click="backward"></i>
        <i class="menu_icon"
           :class="{'icon_play':!playing, 'icon_pause':playing}"
           @click="togglePlay"
           @mouseleave="hoverIndex = -1"></i>
        <i class="menu_icon icon_right"
           :class="{'menu_icon_disabled':playing}"
           @click="forward"></i>
      </div>
      <!--速度调节-->
      <div class="menu_setting">
        <i class="menu_icon icon_up"
           :class="{'menu_icon_disabled':playing}"
           @click="speedSlow"></i>
        <i
          class="speed">{{ options.speed.toFixed(1) }}</i>
        <i class="menu_icon icon_down"
           :class="{'menu_icon_disabled':playing}"
           @click="speedQuick"></i>
      </div>
      <!--间隔选择-->
      <div style="float: left;margin-left: 10px">
        <span>间隔</span>
        <select @change="watchChange" v-model="step" style="height: 30px" :disabled="playing">
          <option :value="stepType" v-for="(stepType, index) in stepTypes" :key="index">
            {{stepType+'min'}}
          </option>
        </select>
      </div>
      <!--日期选择-->
      <div style="float: left;margin-left: 10px">
        <span>日期</span>
        <select @change="watchChange" v-model="selectDay" style="height: 30px" :disabled="playing">
          <option :value="obj.dateStr" v-for="(obj, index) in dateSelection" :key="index">{{obj.dateStr + ' ' +
            obj.event}}
          </option>
        </select>
      </div>
    </div>
    <!--时间轴-->
    <div class="wai">
      <div class="timeline_axis">
        <div class="axis_item"
             v-for="(obj, index) in dateTimes"
             :key="index">
          <div class="axis_item_tick"
               :class="{ 'axis_item_tick_active':index === highlightIndex ,
                'set_red': index === redIndex,
                'set_notRed': index !== redIndex}"
               @mouseenter="hoverIndex = index"
               @mouseleave="hoverIndex = -1"
               @click="tickClick(index)">
          </div>
          <div class="axis_item_label"
               v-if="dateTimeIndexes.indexOf(index) >=0 ">
            {{ obj.text}}
          </div>
          <div class="axis_item_tip"
               v-if="index === highlightIndex || index === hoverIndex">
            {{ obj.text}}
          </div>
        </div>
      </div>
    </div><!--wai-->
  </div><!--timeline_main-->
</template>
<script>
  import mainjs from './mainjs'
  import akiUtils from 'aki_js_utils' // 日期格式化
  const mark = 'T'

  export default {
    name: 'lk-timeline',
    data() {
      return {
        // 没什么用的 //////////////////////////////////////////
        dateTimeIndexes: [], // 日期刻度列表 记录那些刻度需要显示标尺标识
        // 播放相关 //////////////////////////////////////////
        options: {
          speed: 1, // 当前速度速度
          speedMax: 5 // 速度最大值
        },
        intervalTimer: null, // 定时器 number
        playing: false, // 播放
        activeIndex: 0, // 当前的时间位置
        hoverIndex: 0, // 鼠标移入的时间位置
        redIndex: -1, // 预警红色格子的位置 -1代表没有
        // 参数相关 //////////////////////////////////////////
        selectDay: undefined,  // 选择的日期
        step: undefined,  // 选择的间隔步长 例如 10min 30min
        dateTimes: [], // 所有帧内容的集合
        isPlayToday: false // 是否播放最新的一天
      }
    },
    props: {
      // 预警前后 小时数 不要超过24小时
      warningHourRange: {
        type: Number,
        default() {
          return 5
        }
      },
      // 是否开启当天预警
      isWarning: {
        type: Boolean,
        default() {
          return false
        }
      },
      // 可选择的间隔
      stepTypes: {
        type: Array,
        default() {
          return ['10', '60']
        }
      },
      // 可选择的天
      dateSelection: {
        type: Array,
        default() {
          return [
            {dateStr: '2020-11-11', event: '备注'},
            {dateStr: '2020-11-10', event: ''}
          ]
        }
      }
    },
    computed: {
      // 高亮显示， 如果不为空，当前index是这个index
      highlightIndex() {
        return (
          (this.activeIndex === -1 && this.dateTimes.length - 1) ||
          this.activeIndex
        )
      }
    },
    watch: {
      playing() {
        if (this.playing) {
          // 是否播放最新的一天
          if (this.selectDay === akiUtils.dateFormat(new Date(), 'yyyy-MM-dd')) {
            this.isPlayToday = true
          } else {
            this.isPlayToday = false
          }
          this.intervalTimer = setInterval(() => {
            this.activeIndex = (this.activeIndex + 1) % this.dateTimes.length
          }, this.options.speed * 1000)
        } else {
          if (this.intervalTimer) {
            clearInterval(this.intervalTimer)
            this.intervalTimer = null
          }
        }
      },
      // 只要播放，数据发生改变，就调用
      activeIndex() {
        this.$emit('watchDateFun', {
          dateTimeText: this.dateTimes[this.activeIndex].text,
          selectDay: this.selectDay,
          step: this.step,
          selectDayDateTime: this.dateTimes[this.activeIndex].value
        })
      }
    },
    mounted() {
      this.refreshTimeLine()
    },
    methods: {
      refreshTimeLine() {
        // 如果是播放状态, 先停止播放, 记录下之前是播放着的
        let beforeIsPlay = false
        if (this.playing) {
          if (this.intervalTimer) {
            clearInterval(this.intervalTimer)
            this.intervalTimer = null
            beforeIsPlay = true
          }
        }
        // 初始化各种参数
        if (!this.selectDay || this.isPlayToday) {
          this.selectDay = this.dateSelection[0].dateStr // 如果选择天数为空, 播的是最新的一天, 就刷新选择天数据
        }
        if (!this.step) {
          this.step = this.stepTypes[0] // 默认步长 如果步长没有值, 就赋值
        }
        this.setDateTimes() // 设置格子
        this.initTimeLineScale()// 初始化刻度尺
        let selectDayDateTimes = []
        for (let i = 0; i < this.dateTimes.length; i++) {
          selectDayDateTimes.push(this.dateTimes[i].value)
        }
        // 初始化可以用这个方法拿到参数
        this.$emit('getInitParams', {
          dateTimeText: this.dateTimes[this.activeIndex].text,
          selectDay: this.selectDay,
          step: this.step,
          selectDayDateTime: this.dateTimes[this.activeIndex].value,
          selectDayDateTimes: selectDayDateTimes
        });
        // 根据之前是否播放来播放
        if (beforeIsPlay) {
          this.intervalTimer = setInterval(() => {
            this.activeIndex = (this.activeIndex + 1) % this.dateTimes.length
          }, this.options.speed * 1000)
        }
      }
      ,
      // ////////////////// 设置刻度 关键方法
      setDateTimes() {
        const step = new Number(this.step)
        const warningHourRange = new Number(this.warningHourRange)
        let newDate = new Date()
        this.dateTimes.length = 0
        // 判断是不是预警
        if (this.isWarning && this.selectDay === akiUtils.dateFormat(newDate, 'yyyy-MM-dd')) {
          // 获取当前时间 ，取整到 60分钟
          let floorDate = akiUtils.floorTo10Minutes(newDate)
          // 将当前时间减少，warningHourRange 小时
          let startDate = akiUtils.changeDate(floorDate, 'HH', -warningHourRange)
          let endDate = akiUtils.changeDate(floorDate, 'HH', warningHourRange)
          let after = new Date(startDate)
          while (after <= endDate) {
            let obj = {
              text: akiUtils.dateFormat(after, 'HH:mm')
              , value: akiUtils.dateFormat(after, 'yyyy-MM-ddTHH:mm:ss')
            }
            this.dateTimes.push(obj)
            after = akiUtils.changeDate(after, 'mm', step)
          }
          this.redIndex = Math.floor(this.dateTimes.length / 2)
        } else {
          if (this.selectDay === akiUtils.dateFormat(newDate, 'yyyy-MM-dd')) {
            // 如果选择的是今天
            // 获取当前时间 ，取整到 10分钟
            let floorDate = akiUtils.floorTo60Minutes(newDate)
            // 将当前时间减少，24 小时
            let startDate = akiUtils.changeDate(floorDate, 'HH', -24)
            let endDate = new Date(floorDate)
            let after = new Date(startDate)
            while (after <= endDate) {
              let obj = {
                text: akiUtils.dateFormat(after, 'HH:mm')
                , value: akiUtils.dateFormat(after, 'yyyy-MM-ddTHH:mm:ss')
              }
              this.dateTimes.push(obj)
              after = akiUtils.changeDate(after, 'mm', step)
            }
          } else {
            // 不是今天
            const selectDay = new String(this.selectDay)
            let formatDate = selectDay.replace(/-/g, '/')
            let startDate = new Date(formatDate)
            let endDate = akiUtils.changeDate(startDate, 'HH', 24)
            let after = new Date(startDate)
            while (after <= endDate) {
              let obj = {
                text: akiUtils.dateFormat(after, 'HH:mm')
                , value: akiUtils.dateFormat(after, 'yyyy-MM-ddTHH:mm:ss')
              }
              this.dateTimes.push(obj)
              after = akiUtils.changeDate(after, 'mm', step)
            }
          }
          // 设置非预警
          this.redIndex = -1
        }
      }
      ,
      //////////////////////////// 之前的方法
      // 初始化时间轴刻度
      initTimeLineScale() {
        return;// 不要刻度
        mainjs.initTimeLineScale(this)
      }
      ,
      // 点击刻度
      tickClick(index) {
        mainjs.tickClick(this, index)
      }
      ,
      // 播放和暂停
      togglePlay() {
        mainjs.togglePlay(this)
      }
      ,
      // 时间退后一日
      backward() {
        mainjs.backward(this)
      }
      ,
      // 时间前进一日
      forward() {
        mainjs.forward(this)
      }
      ,
      // 减慢速度
      speedSlow() {
        mainjs.speedSlow(this)
      }
      ,
      // 加快速度
      speedQuick() {
        mainjs.speedQuick(this)
      }
      ,
      /////////////////////////////////////////////////// 主动调用的方法
      // 主动获取时间轴数据 ref="timeLine" this.$refs.timeLine.getTimeLineInfo()
      getTimeLineInfo() {
        return mainjs.getTimeLineInfo(this)
      }
      ,
      // 主动获取 刻度对应的数组 如[2020-11-11T00:00, 2020-11-11T10:00] ref="timeLine" this.$refs.timeLine.getDayDateTimes()
      getDayDateTimes() {
        return mainjs.getDayDateTimes(this)
      }
      ,
      // 重新选择条件 之后触发的获取事件
      watchChange() {
        mainjs.watchChange(this)
      }
    }
  }
</script>
<style scoped lang="scss">
  @import "mainstyle";
</style>
