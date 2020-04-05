<template>
  <apexchart v-if="visible" :height="height || '100%'" :width="width || '100%'" :options="chartOptions" :series="series" />
</template>

<script>
import moment from 'moment';

import { numberSplitFormatter } from '@/utils/formatter';

const defaultChartOptions = {
  chart: { 
    type: 'bar',
    stacked: true,
    animations: {
      enabled: false,
    },
  },
  dataLabels: { enabled: false },
  legend: {
    position: 'left',
  },
  xaxis: {
    type: 'datetime',
  },
  yaxis: {
    labels: {
      show: false,
      formatter: numberSplitFormatter,
    }
  },
};

export default {
  name: 'UserCategoryHistory',

  props: {
    height: String,
    width: String,
    history: Array,
    id: String,
    group: String,
    value: String,
  },

  data: () => ({
    visible: true,
  }),

  computed: {
    minMaxDate() {
      if (!this.history) return {};
      var { minDate, maxDate } = this.history.reduce((prev, { date }) => {
        if (!prev.minDate || prev.minDate > date) prev.minDate = date;
        if (!prev.maxDate || prev.maxDate < date) prev.maxDate = date;
        return prev;
      }, { minDate: null, maxDate: null });
      return { minDate, maxDate };
    },
    dateRange() {
      if (!this.history) return [];
      var { minDate, maxDate } = this.minMaxDate;
      minDate = moment(minDate);
      maxDate = moment(maxDate);
      var range = [];
      while (minDate.isSameOrBefore(maxDate)) {
        range.push(minDate.format('YYYY-MM-DD'));
        minDate.add(1, 'day');
      }
      return range;
    },
    chartOptions() {
      if (!this.history) return defaultChartOptions;
      return {
        ...defaultChartOptions,
        chart: {
          ...defaultChartOptions.chart,
          id: this.id,
          group: this.group,
        },
        xaxis: {
          ...defaultChartOptions.xaxis,
          categories: this.dateRange,
        }
      };
    },
    series() {
      if (!this.history) return [];
      var { minDate } = this.minMaxDate;
      minDate = moment(minDate);
      var grouped = this.history.reduce((prev, curr) => {
        if (!(curr.id in prev)) {
          prev[curr.id] = {
            id: curr.id,
            name: curr.name,
            data: Array(this.dateRange.length).fill(0),
          };
        }
        prev[curr.id].data[moment(curr.date).diff(minDate, 'day')] = curr[this.value];
        return prev;
      }, {});
      var series = [];
      for (var k in grouped) {
        series.push(grouped[k]);
      }
      series.sort((a, b) => a.id < b.id ? -1 : 1).map(s => { s.name, s.data });
      return series;
    },
  },

  watch: {
    history() {
      // solution of apexchart group option bug
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
