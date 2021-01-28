const mark = 'T'
// 初始化时间轴刻度
const initTimeLineScale = (VUE) => {
  const interval = 100 // 间隔多少px，显示一个时间刻度, 这个越大现实的越少
  // 时间轴的宽度
  const timelineWidth = VUE.$el.offsetWidth - 40
  // 日期个数
  const dateTimesSize = VUE.dateTimes.length
  // 如果时间全部显示，时间轴的理想宽度
  const dateTimesWidth = dateTimesSize * interval
  // 如果时间轴的宽度小于理想宽度
  if (timelineWidth >= dateTimesWidth) {
    VUE.dateTimeIndexes = VUE.dateTimes.map((dateTime, index) => {
      return index
    })
    return
  }
  // 当前时间轴的宽度最大能容纳多少日期刻度
  const maxTicks = Math.floor(timelineWidth / interval)
  // 间隔刻度数
  const gapTicks = Math.floor(dateTimesSize / maxTicks)
  // 记录需要显示的日期索引
  VUE.dateTimeIndexes = []
  for (let t = 0; t <= maxTicks; t++) {
    VUE.dateTimeIndexes.push(t * gapTicks)
  }
  const len = VUE.dateTimeIndexes.length
  // 最后一项需要特殊处理
  if (len > 0) {
    const lastIndex = VUE.dateTimeIndexes[len - 1]
    if (lastIndex + gapTicks > dateTimesSize - 1) {
      VUE.dateTimeIndexes[len - 1] = dateTimesSize - 1
    } else {
      VUE.dateTimeIndexes.push(dateTimesSize - 1)
    }
  }
}

// 播放和暂停
const togglePlay = (VUE) => {
  VUE.playing = !VUE.playing
}
// 时间退后一日
const backward = (VUE) => {
  if (VUE.playing) {
    return
  }
  VUE.activeIndex = VUE.activeIndex - 1
  if (VUE.activeIndex === -1) {
    VUE.activeIndex = VUE.dateTimes.length - 1
  }
}
// 时间前进一日
const forward = (VUE) => {
  if (VUE.playing) {
    return
  }
  VUE.activeIndex = (VUE.activeIndex + 1) % VUE.dateTimes.length
}

// 点击刻度
const tickClick = (VUE, index) => {
  if (VUE.playing) {
    return
  }
  VUE.activeIndex = index
}

// 减慢速度
const speedSlow = (VUE) => {
  if (VUE.playing || VUE.options.speed >= VUE.options.speedMax) {
    return
  }
  VUE.options.speed = VUE.options.speed + 0.5
}
// 加快速度
const speedQuick = (VUE) => {
  if (VUE.playing || VUE.options.speed <= 0.5) {
    return
  }
  VUE.options.speed = VUE.options.speed - 0.5
}

// 主动获取时间轴数据 ref="timeLine"
// VUE.$refs.timeLine.getTimeLineInfo()
const getTimeLineInfo = (VUE) => {
  let msgObj = {
    dateTime: VUE.dateTimes[VUE.activeIndex],
    selectDay: VUE.selectDay,
    step: VUE.step,
    selectDayDateTime: VUE.selectDay + mark + VUE.dateTimes[VUE.activeIndex]
  }
  return msgObj
}
// 主动获取 刻度对应的数组 如[2020-11-11T00:00, 2020-11-11T10:00] ref="timeLine"
// VUE.$refs.timeLine.getDayDateTimes()
const getDayDateTimes = (VUE) => {
  let selectDayDateTimes = []
  for (let i = 0; i < VUE.dateTimes.length; i++) {
    selectDayDateTimes.push(VUE.selectDay + mark + VUE.dateTimes[i])
  }
  return {selectDayDateTimes}
}
// 重新选择条件 之后触发的获取事件
const watchChange = (VUE) => {
  VUE.activeIndex = 0 //指针归零
  VUE.setDateTimes() // 设置格子
  let selectDayDateTimes = []
  for (let i = 0; i < VUE.dateTimes.length; i++) {
    selectDayDateTimes.push(VUE.selectDay + mark + VUE.dateTimes[i])
  }
  VUE.$emit('watchChange', {
    dateTime: VUE.dateTimes[VUE.activeIndex],
    selectDay: VUE.selectDay,
    step: VUE.step,
    selectDayDateTime: VUE.selectDay + mark + VUE.dateTimes[VUE.activeIndex],
    selectDayDateTimes
  });
}

export default {
  getTimeLineInfo,
  getDayDateTimes,
  watchChange,
  initTimeLineScale,
  togglePlay,
  backward,
  forward,
  tickClick,
  speedSlow,
  speedQuick
}
export {
  getTimeLineInfo,
  getDayDateTimes,
  watchChange,
  initTimeLineScale,
  togglePlay,
  backward,
  forward,
  tickClick,
  speedSlow,
  speedQuick
}
