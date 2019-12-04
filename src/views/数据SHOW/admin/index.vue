<template>
  <div class="dashboard-editor-container" :style="{'height': body_height}">
    <panel-group />
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="sale_chart_data" :options="sale_chart_data_options" />
    </el-row>
    <el-row v-show="false" :gutter="32">
      <el-col :xs="24" :sm="24" :lg="24">
        <div class="chart-wrapper">
          <pie-chart :char-data="sale_person_data" :options="sale_person_data_options" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import GithubCorner from '@/components/GithubCorner'
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import RaddarChart from './components/RaddarChart'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
import TransactionTable from './components/TransactionTable'
import TodoList from './components/TodoList'
import BoxCard from './components/BoxCard'

const sale_person_data = []
const sale_chart_data = {
  t_y_p: [1, 2, 3, 4, 5],
  n_y_p: [1, 2, 3, 0, 6]
}

export default {
  name: 'DatashowAdmin',
  components: {
    GithubCorner,
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart,
    TransactionTable,
    TodoList,
    BoxCard
  },
  data() {
    return {
      body_height: '600px',
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
          data: ['1', '1', '1', '1', '1', '1'],
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
          data: ['三年版', '一年版']
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
        series: [
          {
            name: '三年版',
            smooth: true,
            type: 'line',
            data: sale_chart_data.t_y_p,
            animationDuration: 2800,
            animationEasing: 'cubicInOut'
          },
          {
            name: '一年版',
            smooth: true,
            type: 'line',
            data: sale_chart_data.n_y_p,
            animationDuration: 2800,
            animationEasing: 'quadraticOut'
          }]
      }
    }
  },
  created() {
    this.body_height = window.innerHeight - 50 + 'px'
  },
  mounted() {
  },
  methods: {
    handleSetLineChartData() {

    }
  }
}
</script>

<style lang="scss" scoped>
  .dashboard-editor-container {
    padding: 32px;
    background-color: rgb(240, 242, 245);
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
