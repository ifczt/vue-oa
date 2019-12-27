<template>
  <div class="dashboard-editor-container">
    <panel-group />
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="sale_chart_data" :options="sale_chart_data_options" />
    </el-row>
    <el-row v-if="roles.includes('IFCZT')||roles.includes('FINANCE')||roles.includes('ADMIN')||roles.includes('FINANCE')||roles.includes('SUPER_ADMIN')" :gutter="32">
      <el-col :xs="24" :sm="24" :lg="24">
        <div class="chart-wrapper">
          <pie-chart :char-data="sale_person_data" :options="sale_person_data_options" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PanelGroup from './components/四维图/PanelGroup'
import LineChart from './components/曲线图/LineChart'
import PieChart from './components/PieChart'
import { getLineData, getLineOptions, getPieData } from '../../../api/dataShow'
import { mapGetters } from 'vuex'
const sale_person_data = []
const sale_chart_data = {}
const bb = function() {
  console.log(this)
}
export default {
  name: 'DatashowAdmin',
  components: {
    PanelGroup,
    LineChart,
    PieChart
  },
  data() {
    return {
      sale_person_data_options: {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: []
        },
        series: [
          {
            name: '加盟商业绩图',
            type: 'pie',
            roseType: 'radius',
            radius: [30, 120],
            center: ['50%', '38%'],
            data: sale_person_data,
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      },
      sale_person_data: sale_person_data,
      sale_chart_data: sale_chart_data,
      sale_chart_data_options: {
        title: {
          text: 'Null',
          textStyle: {
            color: '#606060',
            fontStyle: 'normal',
            fontWeight: 'normal',
            fontSize: 12,
            align: 'center'
          }
        },
        xAxis: {
          data: [],
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          data: []
        },
        toolbox: {
          show: true,
          right: 10,
          showTitle: false,
          feature: {
            my_prev_month: {
              symbol: 'circle',
              show: true,
              icon: 'path://M704 908.8 307.2 512 704 115.2c25.6-25.6 25.6-70.4 0-96-25.6-25.6-70.4-25.6-96 0L166.4 460.8C147.2 480 140.8 492.8 140.8 512s6.4 32 19.2 51.2l441.6 441.6c25.6 25.6 70.4 25.6 96 0C729.6 979.2 729.6 934.4 704 908.8z'
            },
            my_next_month: {
              show: true,
              onclick: function() {
                bb()
              },
              icon: 'path://M294.4 908.8 684.8 512 294.4 115.2c-25.6-25.6-25.6-70.4 0-96 25.6-25.6 70.4-25.6 96 0L832 460.8c12.8 12.8 19.2 32 19.2 51.2S844.8 544 832 563.2l-441.6 441.6c-25.6 25.6-70.4 25.6-96 0C262.4 979.2 262.4 934.4 294.4 908.8z'
            }
          },
          iconStyle: {
            color: 'rgb(128, 128, 128)',
            borderWidth: 0
          },
          emphasis: {
            iconStyle: {
              color: '#28b73d'
            }
          }
        },
        series: []
      }
    }
  },
  created() {
    this.setLineChartOptions()
  },
  mounted() {
  },
  beforeCreate() {
    window.document.body.style.backgroundColor = '#F0F2F5'
    next()
  },
  beforeDestroy() {
    window.document.body.style.backgroundColor = ''
    next()
  },
  methods: {
    setPieData() {
      getPieData().then(response => {
        const data = response.data
        this.sale_person_data_options.legend.data = data.legend
        this.sale_person_data_options.series[0].data = data.data
      })
    },
    setLineChartOptions(month) {
      getLineOptions().then(response => {
        const data = response.data
        this.sale_chart_data_options.title.text = data.title
        this.sale_chart_data_options.xAxis.data = data.xAxis
        this.sale_chart_data_options.legend.data = data.legend
        this.setLineChartData()
      })
    },
    setLineChartData(month) {
      getLineData().then(response => {
        this.sale_chart_data_options.series = response.data
        this.setPieData()
      })
    },
    next_month() {
      console.log(123)
    },
    prev_month() {
      console.log(123)
    }
  },
  computed: {
    ...mapGetters(['name', 'roles'])
  }
}
</script>

<style lang="scss" scoped>
  .dashboard-editor-container {
    padding: 32px;
    position: relative;

    .github-corner {
      position: absolute;
      top: 0px;
      border: 0;
      right: 0;
    }

    .chart-wrapper {
      background: #fff;
      padding: 16px 16px 0;
      margin-bottom: 32px;
    }
  }

  @media (max-width: 1024px) {
    .chart-wrapper {
      padding: 8px;
    }
  }
</style>
