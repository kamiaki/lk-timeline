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
        <select @change="watchChange" v-model="step" style="height: 30px" :disabled="dateSelect">
          <option :value="stepType" v-for="(stepType, index) in stepTypes" :key="index">
            {{stepType+'min'}}
          </option>
        </select>
      </div>
      <!--日期选择-->
      <div style="float: left;margin-left: 10px">
        <span>日期</span>
        <select @change="watchChange" v-model="selectDay" style="height: 30px" :disabled="dateSelect">
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
             v-for="(time, index) in dateTimes"
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
            {{ time }}
          </div>
          <div class="axis_item_tip"
               v-if="index === highlightIndex || index === hoverIndex">
            {{ time}}
          </div>
        </div>
      </div>
    </div><!--wai-->
  </div><!--timeline_main-->
</template>
<script>
  import mainjs from './mainjs'
  import {dateFormat, minToHour, hourToMin} from 'aki_js_utils' // 日期格式化
  const mark = 'T'

  export default {
    name: 'lk-timeline',
    data() {
      return {
        // 没什么用的 //////////////////////////////////////////
        dateTimeIndexes: [], // 日期刻度列表
        // 播放相关 //////////////////////////////////////////
        options: {
          speed: 1, // 当前速度速度
          speedMax: 5 // 速度最大值
        },
        intervalTimer: null, // 定时器
        playing: false, // 播放
        activeIndex: 0, // 当前的时间位置
        hoverIndex: 0, // 鼠标移入的时间位置
        dateSelect: false,  // 播放时,不可选择间隔和日期
        redIndex: -1, // 预警红色格子的位置 -1代表没有
        // 参数相关 //////////////////////////////////////////
        selectDay: '',  // 选择的日期
        step: 0,  // 选择的间隔步长 例如 10min 30min
        dateTimes: [] // 显示多少个格子
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
          this.intervalTimer = setInterval(() => {
            this.activeIndex = (this.activeIndex + 1) % this.dateTimes.length
          }, this.options.speed * 1000)
          // 日期不让选
          this.dateSelect = true
        } else {
          if (this.intervalTimer) {
            clearInterval(this.intervalTimer)
            this.intervalTimer = null
          }
          // 日期让选
          this.dateSelect = false
        }
      },
      // 只要播放，数据发生改变，就调用
      activeIndex() {
        this.$emit('watchDateFun', {
          dateTime: this.dateTimes[this.activeIndex],
          selectDay: this.selectDay,
          step: this.step,
          selectDayDateTime: this.selectDay + mark + this.dateTimes[this.activeIndex]
        })
      }
    },
    mounted() {
      this.selectDay = this.dateSelection[0].dateStr // 默认天数
      this.step = this.stepTypes[0] // 默认步长
      this.setDateTimes() // 设置格子
      this.initTimeLineScale()// 初始化刻度尺
      // 初始化传送相关参数
      let selectDayDateTimes = []
      for (let i = 0; i < this.dateTimes.length; i++) {
        selectDayDateTimes.push(this.selectDay + mark + this.dateTimes[i])
      }
      // 初始化可以用这个方法拿到参数
      this.$emit('getInitParams', {
        dateTime: this.dateTimes[this.activeIndex],
        selectDay: this.selectDay,
        step: this.step,
        selectDayDateTime: this.selectDay + mark + this.dateTimes[this.activeIndex],
        selectDayDateTimes: selectDayDateTimes
      });
    },
    methods: {
      // ////////////////// 设置刻度 关键方法
      setDateTimes() {
        this.dateTimes.length = 0
        // 判断是不是预警
        if (this.isWarning && this.selectDay === dateFormat(new Date(), 'yyyy-MM-dd')) {
          // 获取当前时间 ，整到小时
          let nowDate = dateFormat(new Date(), 'HH:mm')
          let minute = hourToMin(nowDate.substr(0, nowDate.length - 1) + '0')
          // 将当前时间减少，warningHourRange 小时
          let minMinute = minute - this.warningHourRange * 60
          let maxMinute = minute + this.warningHourRange * 60
          let dayCount = Math.ceil(this.warningHourRange / 24)  // 这个使用来看 超过了几天
          // 根据减 warningHourRange 小时的这个时间，去叠加 step，一共叠加到 warningHourRange * 2 小时
          for (let i = minMinute; i < maxMinute; i += Number(this.step)) {
            let str
            let ii
            if (i < 0) {
              ii = i + 1440
              str = '-' + minToHour(ii)
            } else if (i > 1440) {
              ii = i - 1440
              str = '+' + minToHour(ii)
            } else {
              ii = i
              str = minToHour(ii)
            }
            this.dateTimes.push(str)
          }
          this.redIndex = this.dateTimes.length / 2
        } else {
          if (this.selectDay === dateFormat(new Date(), 'yyyy-MM-dd')) {
            // 如果选择的是今天
            for (let i = 0; i <= 1440; i += Number(this.step)) {// 1440 = 24 * 60
              let str
              str = minToHour(i)
              this.dateTimes.push(str)
            }
          } else {
            // 不是今天
            for (let i = 0; i <= 1440; i += Number(this.step)) {// 1440 = 24 * 60
              let str
              str = minToHour(i)
              this.dateTimes.push(str)
            }
          }
          // 设置非预警
          this.redIndex = -1
        }
      },
      //////////////////////////// 之前的方法
      // 初始化时间轴刻度
      initTimeLineScale() {
        return;// 不要刻度
        mainjs.initTimeLineScale(this)
      },
      // 点击刻度
      tickClick(index) {
        mainjs.tickClick(this, index)
      },
      // 播放和暂停
      togglePlay() {
        mainjs.togglePlay(this)
      },
      // 时间退后一日
      backward() {
        mainjs.backward(this)
      },
      // 时间前进一日
      forward() {
        mainjs.forward(this)
      },
      // 减慢速度
      speedSlow() {
        mainjs.speedSlow(this)
      },
      // 加快速度
      speedQuick() {
        mainjs.speedQuick(this)
      },
      /////////////////////////////////////////////////// 主动调用的方法
      // 主动获取时间轴数据 ref="timeLine" this.$refs.timeLine.getTimeLineInfo()
      getTimeLineInfo() {
        return mainjs.getTimeLineInfo(this)
      },
      // 主动获取 刻度对应的数组 如[2020-11-11T00:00, 2020-11-11T10:00] ref="timeLine" this.$refs.timeLine.getDayDateTimes()
      getDayDateTimes() {
        return mainjs.getDayDateTimes(this)
      },
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
