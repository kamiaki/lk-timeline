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

.vue

``` 
<template>
  <div>
    <lk-timeline
      :options="options"
      :dateTimes="dateTimes"
      @getDateFun="getDateFun"
      :interval="interval"
    ></lk-timeline>
  </div>
</template>

<script>
export default {
  name: '',
  data() {
    return {
      date: '',
      options: {
        speed: 1, // 速度
        speedMax: 10 // 速度最大值
      },
      interval: 200, // 日期间的间隔
      dateTimes: [
        '03-04',
        '03-05',
        '03-06',
        '03-07',
        '03-08',
        '03-09',
        '03-10',
        '03-11',
        '03-12',
        '03-13'
      ]
    }
  },
  methods: {
    getDateFun(time) {
      console.log(time)
    }
  }
}
</script>
```

## 组件内使用

``` 
<template>
  <div>
    <lk-timeline
      :options="options"
      :dateTimes="dateTimes"
      @getDateFun="getDateFun"
      :interval="interval"
    ></lk-timeline>
  </div>
</template>

<script>
import LkTimeline from 'lk-timeline'
export default {
  name: '',
  components: {
    LkTimeline
  },
  data() {
    return {
      date: '',
      options: {
        speed: 1, // 速度
        speedMax: 10 // 速度最大值
      },
      interval: 200, // 日期间的间隔
      dateTimes: [
        '03-04',
        '03-05',
        '03-06',
        '03-07',
        '03-08',
        '03-09',
        '03-10',
        '03-11',
        '03-12',
        '03-13'
      ]
    }
  },
  methods: {
    getDateFun(time) {
      console.log(time)
    }
  }
}
</script>
```
