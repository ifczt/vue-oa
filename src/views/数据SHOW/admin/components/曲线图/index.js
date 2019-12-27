import echarts from 'echarts'

require('echarts/theme/macarons') // echarts theme
import resize from '../mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      required: true
    },
    options: {
      type: Object
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    // chartData: {
    //   deep: true,
    //   handler(val) {
    //     this.chart.setOption({series:val})
    //   }
    // },
    options: {
      handler(options) {
        this.chart.setOption(this.options)
      },
      deep: true
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.chart.setOption(this.options)
    }
  }
}
