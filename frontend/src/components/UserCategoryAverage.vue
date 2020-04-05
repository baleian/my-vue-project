<template>
  <apexchart v-if="visible" :height="height || '350'" :options="chartOptions" :series="series" />
</template>

<script>
import { numberSplitFormatter } from '@/utils/formatter';

const defaultChartOptions = {
  chart: { 
    type: 'line',
  },
  dataLabels: { enabled: false },
  fill: {
    type:'solid',
    opacity: [0.7, 1, 0.7, 1],
  },
  colors: ['#008FFB', '#008FFB', '#00E396', '#00E396'],
  stroke: {
    width: [1, 2, 1, 2],
    curve: 'smooth',
    dashArray: [0, 8, 0, 8]
  },
  markers: {
    size: 2,
    shape: 'square',
    strokeWidth: 0,
  },
  xaxis: {
    tooltip: { enabled: false },
  },
};

export default {
  name: 'UserCategoryAverage',

  props: {
    height: String,
    state: Array,
    label: String,
  },

  data: () => ({
    visible: true,
  }),

  computed: {
    chartOptions() {
      if (!this.state) return defaultChartOptions;
      var { maxCount, maxAmount } = this.state.reduce((prev, curr) => {
        if (prev.maxCount < curr.count) prev.maxCount = curr.count;
        if (prev.maxCount < curr.userCountAverage) prev.maxCount = curr.userCountAverage;
        if (prev.maxAmount < curr.amount) prev.maxAmount = curr.amount;
        if (prev.maxAmount < curr.userAmountAverage) prev.maxAmount = curr.userAmountAverage;
        return prev;
      }, { maxCount: 0, maxAmount: 0});
      maxCount = maxCount < 5 ? 5 : Math.ceil(maxCount);
      return {
        ...defaultChartOptions,
        xaxis: {
          ...defaultChartOptions.xaxis,
          categories: this.state.map(s => s.name),
        },
        yaxis: [
          {
            seriesName: '결제 수',
            axisTicks: { show: true, },
            min: 0, max: maxCount, tickAmount: 5,
            labels: { formatter: v => {
              return v.toFixed(1);
            }},
          },
          {
            seriesName: '평균 결제 수',
            show: false,
            min: 0, max: maxCount, tickAmount: 5,
            labels: { formatter: v => {
              return v.toFixed(1);
            }},
          },
          {
            seriesName: '결제 금액',
            opposite: true,
            axisTicks: { show: true, },
            min: 0, max: maxAmount, tickAmount: 5,
            labels: { formatter: v => numberSplitFormatter(v) + '\uFFE6' },
          },
          {
            seriesName: '평균 결제 금액',
            show: false,
            min: 0, max: maxAmount, tickAmount: 5,
            labels: { formatter: v => numberSplitFormatter(v) + '\uFFE6' },
          },
        ],
      };
    },
    series() {
      if (!this.state) return [];
      return [
        {
          name: '결제 수',
          type: 'column',
          data: this.state.map(s => s.count),
        },
        {
          name: '평균 결제 수',
          type: 'line',
          data: this.state.map(s => s.userCountAverage),
        },
        {
          name: '결제 금액',
          type: 'column',
          data: this.state.map(s => s.amount),
        },
        {
          name: '평균 결제 금액',
          type: 'line',
          data: this.state.map(s => s.userAmountAverage),
        }
      ];
    },
  },

  watch: {
    state() {
      // solution of apexchart yaxis max bug
      this.visible = false;
      this.$nextTick(() => {
        this.visible = true;
      });
    },
  },
}
</script>

<style scoped>

</style>
