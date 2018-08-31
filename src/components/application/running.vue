<template>
  <div class="body-wrapper body-transition">
    <div class="body-container">
      <div class="running-container">
        <h3>我的运动记录</h3>
        <div class="chart-control">
          <div class="chart-control-date">
            <date-picker v-model="dateRange" class="chart-date-picker" language="ch"
                         :range=true></date-picker>
          </div>
          <div class="chart-control-type">
            <div class="control-time-format">
              <button class="ui label mini" :class="{green:btnFullDate}"
                      v-on:click="btnDateTypeClick">日期
              </button>
              <button class="ui label mini " :class="{green:!btnFullDate}"
                      v-on:click="btnDateTypeClick">星期
              </button>
            </div>
            <div class="control-show-format">
              <i class="circular theme icon" :class="{purple:btnWeight,inverted:btnWeight}"
                 v-on:click="btnWeightClick"></i>
              <i class="circular paw icon" :class="{purple:btnFat, inverted:btnFat}"
                 v-on:click="btnFatClick"></i>
            </div>
          </div>
        </div>

        <div class="chart-container">
          <canvas id="myChart"></canvas>
        </div>
        <div class="table-container" v-if="datas.length <= 7 && datas.length > 0">
          <table class="ui fixed celled single line selectable table ">
            <thead>
            <tr class="center aligned">
              <th>日期</th>
              <th v-for="(item, index) in datas" v-bind:key="index">{{ dateFormatConvert(item.datetime) }}</th>
            </tr>
            </thead>

            <tr class="center aligned">
              <td><i class="icon rocket"></i></td>
              <td v-for="(item, index) in datas" v-bind:key="index">{{ item.runLen == null ? '--' : item.runLen + 'KM'
                }}
              </td>
            </tr>
            <tr class="center aligned">
              <td><i class="icon paw"></i></td>
              <td v-for="(item, index) in datas" v-bind:key="index">{{ item.walkLen == null ? '--' : item.walkLen}}</td>
            </tr>
            <tr class="center aligned">
              <td><i class="icon food"></i></td>
              <td v-for="(item, index) in datas" v-bind:key="index">
                <div class="ui rating star" :data-rating=item.food :data-max-rating=item.food></div>
              </td>
            </tr>
          </table>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import datePicker from '../util/Datepicker.vue'

const $ = window.$

export default {
  data () {
    return {
      chart: null,
      dateRange: ['', ''],
      dateCount: 7,
      btnWeight: true,
      btnFat: true,
      btnFullDate: false, // True 是按日期显示，False 按周显示
      datas: [
        // {datetime: '2017-08-27', weight: '52.4', fat: '16.9', runLen: '25', walkLen: '14360', food: '3'},
        // {datetime: '2017-08-28', weight: '53.4', fat: '17.9', runLen: '25', walkLen: '14360', food: '3'},
        // {datetime: '2017-08-29', weight: '51.4', fat: '16.9', runLen: '25', walkLen: '14360', food: '3'},
        // {datetime: '2017-08-08', weight: '53.5', fat: '26.9', runLen: '25', walkLen: '14360', food: '3'},
        // {datetime: '2017-08-31', weight: '50.4', fat: '11.9', runLen: '25', walkLen: '14360', food: '3'},
        // {datetime: '2017-08-08', weight: '53.4', fat: '9.9', runLen: '25', walkLen: '14360', food: '3'},
        // {datetime: '2017-09-02', weight: '51.4', fat: '16.9', runLen: '25', walkLen: '14360', food: '3'}
      ]
    }
  },
  computed: {
    // 提取体重数据y，x横坐标由当前日期显示格式决定
    weightArray: function () {
      let array = []
      if (!this.btnWeight) return []
      for (let i = 0; i < this.datas.length; i++) {
        let temp = {x: '', y: ''}
        temp.x = this.$moment(this.datas[i].datetime).format('YYYY-MM-DD')
        if (!this.btnFullDate) {
          temp.x = this.$moment(temp.x).format('ddd')
        }
        temp.y = this.datas[i].weight
        array.push(temp)
      }
      return array
    },
    // 提取体脂数据y，x横坐标由当前日期显示格式决定
    fatArray: function () {
      let array = []
      if (!this.btnFat) return []
      for (let i = 0; i < this.datas.length; i++) {
        let temp = {x: '', y: ''}
        temp.x = this.$moment(this.datas[i].datetime).format('YYYY-MM-DD')
        if (!this.btnFullDate) {
          temp.x = this.$moment(temp.x).format('ddd')
        }
        temp.y = this.datas[i].fat
        array.push(temp)
      }
      return array
    },
    // 由选择的日期范围，生成日期array
    dateArray: function () {
      let array = []
      let timeCnt = this.$moment(this.dateRange[0]).format('YYYY-MM-DD')
      let timeEnd = this.$moment(this.dateRange[1]).format('YYYY-MM-DD')
      let safety = 365
      let i = 0
      do {
        array.push(timeCnt)
        timeCnt = this.$moment(timeCnt).add(1, 'days').format('YYYY-MM-DD')
        i++
        if (i >= safety) {
          break
        }
      } while (timeCnt !== timeEnd)
      array.push(timeCnt)
      let that = this
      that.dateCount = i + 1
      return array
    },
    // 由日期Array，生成星期array
    weekArray: function () {
      let array = []
      for (let i = 0; i < this.dateArray.length; i++) {
        array.push(this.$moment(this.dateArray[i]).format('ddd'))
      }
      return array
    }
  },
  methods: {
    dateFormatConvert (date) {
      return this.$moment(date).format('YYYY-MM-DD')
    },
    getDatas (value) {
      if (this.$moment(value[1]).isBefore(value[0])) {
        this.$root.eventHub.$emit('showAlert', '查询范围输入有误')
        return false
      }
      this.$http.get(this.$api.appAPI.getRunningDatas, {
        params: {startDate: value[0], endDate: value[1]}
      }).then((res) => {
        const data = res.data
        if (data.status === 0) {
          this.datas = data.content
          // 获得新数据后，要刷新chart中的数据（不会自动更新）
          this.flushData()
          this.chart.update()
          setTimeout(function () {
            $('.ui.rating').rating('disable') // 显示星星
          }, 500)
        } else {
          this.$root.eventHub.$emit('showAlert', data.msg)
        }
      })
      // $.ajax({
      //   url: '/appAPI/getRunningDatas',
      //   type: 'get',
      //   data: {startDate: value[0], endDate: value[1]},
      //   beforeSend: function () {
      //     if (this.$moment(value[1]).isBefore(value[0])) {
      //       this.$root.eventHub.$emit('showAlert', '查询范围输入有误')
      //       return false
      //     }
      //     return true
      //   },
      //   success: (data) => {
      //     if (data.status === 0) {
      //       this.datas = data.content
      //       // 获得新数据后，要刷新chart中的数据（不会自动更新）
      //       this.flushData()
      //       this.chart.update()
      //       setTimeout(function () {
      //         $('.ui.rating').rating('disable') // 显示星星
      //       }, 500)
      //     } else {
      //       this.$root.eventHub.$emit('showAlert', data.msg)
      //     }
      //   }
      // })
    },
    // 是否显示Weight数据
    btnWeightClick () {
      this.btnWeight = !this.btnWeight
      // 改变数据时，要刷新chart中的数据（不会自动更新）
      this.flushData()
      this.chart.update(800)
      $('.ui.rating').rating('disable') // 显示星星
    },
    // 是否显示Fat数据
    btnFatClick () {
      this.btnFat = !this.btnFat
      // 改变数据时，要刷新chart中的数据（不会自动更新）
      this.flushData()
      this.chart.update(800)
      $('.ui.rating').rating('disable') // 显示星星
    },
    // 日期显示格式（日期/星期）
    btnDateTypeClick () {
      // 若查询天数大于7天，则只能使用日期格式
      if (this.dateCount > 7) {
        this.btnFullDate = true
        return
      }
      this.btnFullDate = !this.btnFullDate
      this.changeLabel()
      // 获得新数据后，要刷新chart中的数据（不会自动更新）
      this.flushData()
      this.chart.update(800)
      $('.ui.rating').rating('disable') // 显示星星
    },
    changeLabel () {
      if (this.btnFullDate) {
        this.chart.data.labels = this.dateArray
      } else {
        this.chart.data.labels = this.weekArray
      }
      this.chart.update(800)
    },
    flushData () {
      this.chart.data.datasets[0].data = this.weightArray
      this.chart.data.datasets[1].data = this.fatArray
    }
  },
  created () {
    this.$moment.locale('zh-cn')
    // 日期选择发生变化，触发数据请求
    this.$watch('dateRange', function (newValue, oldValue) {
      this.getDatas(newValue)
      // 需要刷新Label
      this.changeLabel()
    })
    // 日期范围大于7天，触发只能以日期格式显示
    this.$watch('dateCount', function (newValue) {
      if (newValue > 7) {
        this.btnFullDate = true
        this.changeLabel()
        this.chart.update()
      }
    })
  },
  components: {
    datePicker: datePicker
  },
  mounted () {
    $('.ui.rating').rating('disable')

    let ctx = document.getElementById('myChart').getContext('2d')
    let setting = {
      type: 'line',
      data: {
        labels: this.weekArray,
        datasets: [
          {
            label: '体重',
            data: this.weightArray,
            backgroundColor: [
              'rgba(54, 162, 235, 0.2)'
            ],
            borderColor: [
              'rgba(54, 162, 235, 1)'
            ],
            borderWidth: 2,
            yAxisID: 'left-y',
            fill: false
          },
          {
            label: '体脂',
            data: this.fatArray,
            backgroundColor: [
              'rgba(153, 102, 255, 0.2)'
            ],
            borderColor: [
              'rgba(153, 102, 255, 1)'
            ],
            borderWidth: 2,
            yAxisID: 'right-y'
          }
        ]
      },
      options: {
        scales: {
          yAxes: [
            {
              id: 'left-y',
              position: 'left',
              ticks: {
                min: 45,
                max: 75
              },
              gridLines: {
                lineWidth: 0.1
              }
            },
            {
              id: 'right-y',
              position: 'right',
              ticks: {
                min: 10,
                max: 25,
                callback: function (value, index, values) {
                  return value.toFixed(1) + '%'
                }
              },
              gridLines: {
                lineWidth: 0.1
              }
            }
          ]
        },
        tooltips: {
          mode: 'nearest'
        },
        legend: {
          display: true,
          labels: {
            fontColor: 'rgba(143, 114, 207, 0.87)'
          },
          position: 'bottom'
        }
      }
    }
    this.chart = new window.Chart(ctx, setting)
    this.dateRange = [this.$moment().subtract(6, 'days').format('YYYY-MM-DD'), this.$moment().format('YYYY-MM-DD')]
  }
}
</script>
<style src="../../assets/css/body-wrapper.css"></style>

<style scoped>
  .running-container {
    width: 60%;
    margin: 0 auto;
  }

  .chart-control {
    width: 100%;
    height: 3em;
    margin: 1em auto;
    margin-top: 4em;
    line-height: 3em;
  }

  .chart-control-date {
    display: inline-block;
    float: left;
  }

  .chart-control-date .chart-date-picker {
    display: inline-block;
    width: 18em;
    line-height: 1.5em;
  }

  .chart-control-date button {
    margin-left: 2em;
    outline: none;
  }

  .chart-control-type {
    display: inline-block;
    float: right;
  }

  .chart-control-type .control-time-format {
    display: inline-block;
    outline: none;
    margin-right: 2em;
  }

  .control-time-format button {
    outline: none;
  }

  .chart-control-type .control-show-format {
    display: inline-block;

  }

  .chart-control-type i {
    cursor: pointer;
    font-size: 1.3em;
    transition: 0.5s ease;
    box-shadow: 0px 0px 10px 1px gray !important;
  }

  .chart-container {
    margin-top: 1em;
  }

  .table-container {
    width: 95%;
    margin: 2em auto;
  }
</style>
