import CountTo from 'vue-count-to'
import { getProblemInfo, getSalesToday, getSalesVolume, getSalesYear } from '@/api/dataShow'
import router from '@/router'

export default {
  components: {
    CountTo
  },
  data() {
    return {
      cycle_switch: true,
      sales_volume: 0,
      start_sales_volume: 0,
      problem_info: 0,
      start_problem_info: 0,
      sales_today: 0,
      start_sales_today: 0,
      sales_year: 0,
      start_sales_year: 0,
      s_id: ''
    }
  },
  created() {
    this.get_sales_today()
    // 先把循环给关了
    // this.s_id = setInterval(this.loop_get,9000)
  },
  methods: {
    loop_get() {
      if (this.cycle_switch) {
        if (router.currentRoute.name !== 'data_show') {
          clearInterval(this.s_id)
        } else {
          this.get_sales_today()
        }
      }
    },
    get_sales_volume() {
      getSalesVolume().then(response => {
        this.start_sales_volume = this.sales_volume
        this.sales_volume = response.data
        this.get_problem_info()// 3
      })
    },
    get_sales_year() {
      getSalesYear().then(response => {
        this.start_sales_year = this.sales_year
        this.sales_year = response.data
        this.get_sales_volume()// 2
      })
    },
    get_sales_today() {
      this.cycle_switch = false
      getSalesToday().then(response => {
        this.start_sales_today = this.sales_today
        this.sales_today = response.data
        this.get_sales_year()// 1
      })
    },
    get_problem_info() {
      getProblemInfo().then(response => {
        this.start_problem_info = this.problem_info
        this.problem_info = response.data
        this.cycle_switch = true
      })
    }
  }
}
