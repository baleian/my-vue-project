<template>
  <apexchart 
    type="donut" 
    :options="chartOptions" 
    :series="series">
  </apexchart>
</template>

<script>
export default {
  name: 'DonutChart',

  props: {
    items: Array,
    itemLabel: String,
    itemValue: String,
    valueFormatter: Function,
  },

  data: () => ({
    itemFieldIndex: 0,
  }),

  computed: {
    orderdItem() {
      if (!this.items) return [];
      return Array.from(this.items).sort((a, b) => b[this.itemValue] - a[this.itemValue]);
    },
    series() {
      return this.orderdItem.map(item => item[this.itemValue]);
    },
    chartOptions() {
      return {
        labels: this.orderdItem.map(item => item[this.itemLabel]),
        legend: {
          position: 'top',
        },
        chart: { type: 'donut', },
        dataLabels: {
          dropShadow: { enabled: true, },
        },
        tooltip: {
          y: { formatter: this.valueFormatter }
        },
        plotOptions: {
          pie: {
            donut: {
              labels: {
                show: true,
                value: {
                  formatter: this.valueFormatter,
                },
                total: {
                  show: true,
                  formatter: (v) => {
                    let total = v.globals.series.reduce((a, b) => a + b);
                    return this.valueFormatter(total);
                  },
                }, 
              },
            }
          }
        }
      };
    },
  },
};
</script>

<style scoped>

</style>
