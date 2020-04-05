<template>
  <apexchart :height="height || '100%'" :width="width || '100%'" :options="chartOptions" :series="series" />
</template>

<script>
import { numberSplitFormatter } from '@/utils/formatter';

const defaultChartOptions = {
  chart: { 
    type: 'donut',
  },
  legend: {
    position: 'bottom',
  },
  tooltip: { enabled: false },
  stroke: {
    width: 1.4,
  },
};

export default {
  name: 'UserCategoryRate',

  props: {
    height: String,
    width: String,
    state: Array,
    value: String,
  },

  computed: {
    chartOptions() {
      if (!this.state) return defaultChartOptions;
      return {
        ...defaultChartOptions,
        labels: this.state.map(s => s.categoryName),
        plotOptions: {
          pie: {
            donut: {
              labels: {
                show: true,
                value: {
                  formatter: v => numberSplitFormatter(v) + (this.value === 'amount' ? '\uFFE6' : ''),
                },
                total: {
                  show: true,
                  color: '#373D3F',
                  formatter: (v) => {
                    let total = v.globals.series.reduce((a, b) => a + b);
                    return numberSplitFormatter(total) + (this.value === 'amount' ? '\uFFE6' : '');
                  },
                }, 
              },
            }
          }
        }
      };
    },
    series() {
      if (!this.state) return [];
      return this.state.map(s => s[this.value]);
    },
  },
}
</script>

<style scoped>

</style>
