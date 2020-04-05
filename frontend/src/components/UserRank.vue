<template>
  <apexchart :height="height || '100%'" :width="width || '100%'" :options="chartOptions" :series="series" />
</template>

<script>
import { zscoreToPercentage } from '@/utils/ztable';

const defaultChartOptions = {
  chart: { 
    type: 'radialBar',
  },
  plotOptions: {
    radialBar: {
      hollow: { size: '40%' },
      dataLabels: {
        name: {
          show: true,
        },
        value: {
          show: true,
          offsetY: 5,
          formatter: v => `${parseFloat(v).toFixed(1)}%`
        },
      },
    },
  },
  labels: ['결제 수', '결제 금액'],
};

export default {
  name: 'UserRank',

  props: {
    height: String,
    width: String,
    state: Object,
  },

  computed: {
    chartOptions() {
      return defaultChartOptions;
    },
    series() {
      if (!this.state) return [];
      var { countZscore, amountZscore } = this.state;
      return [
        zscoreToPercentage(countZscore) * 100, 
        zscoreToPercentage(amountZscore) * 100
      ];
    },
  },
}
</script>

<style scoped>

</style>
