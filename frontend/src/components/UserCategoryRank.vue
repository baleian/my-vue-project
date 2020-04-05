<template>
  <apexchart :height="height || '100%'" :width="width || '100%'" :options="chartOptions" :series="series" />
</template>

<script>
import { zscoreToPercentage } from '@/utils/ztable';

const defaultChartOptions = {
  chart: { 
    type: 'radar',
  },
  dataLabels: {
    enabled: true,
    formatter: v => parseFloat(v).toFixed(1)
  },
  plotOptions: {
    radar: {
      polygons: {
        fill: {
          colors: ['#f8f8f8', '#ffffff']
        }
      }
    }
  },
  markers: {
    size: 5,
    strokeWidth: 1,
  },
  tooltip: {
    y: {
      formatter: v => `${parseFloat(v).toFixed(2)}%`
    }
  },
  fill: { opacity: 0.1 },
  yaxis: {
    min: 0,
    max: 100,
    tickAmount: 5,
  },
};

export default {
  name: 'UserCategoryRank',

  props: {
    height: String,
    width: String,
    state: Array,
    label: String,
  },

  computed: {
    chartOptions() {
      if (!this.state) return defaultChartOptions;
      return {
        ...defaultChartOptions,
        xaxis: {
          ...defaultChartOptions.xaxis,
          categories: this.state.map(s => s.name),
        },
      };
    },
    series() {
      if (!this.state) return [];
      return [
        {
          name: '결제 수',
          data: this.state.map(s => zscoreToPercentage(s.countZscore) * 100),
        },
        {
          name: '결제 금액',
          data: this.state.map(s => zscoreToPercentage(s.amountZscore) * 100),
        }
      ];
    },
  },
}
</script>

<style scoped>

</style>
