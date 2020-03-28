<template>
  <v-container class="fill-height" fluid>
    <v-row justify="center">
      <v-col align="center" cols="6">
        <h1>USER ID</h1>
        <span>{{ userId }}</span>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col align="center" cols="6">
        <apexchart type="donut" :options="chartOptions" :series="series"></apexchart>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { SET_USER_ID } from '@/store/modules/user';

function toMoneyString(value) {
  let vs = (''+value).split('').reverse();
  for (var i = 0; i < vs.length - 1; i++) {
    if (i % 3 === 2) {
      vs[i] = ',' + vs[i];
    }
  }
  return vs.reverse().join('') + '\uFFE6';
}

export default {
  name: 'UserPage',

  data: () => ({
    series: [ 316060, 93870, 38000, 17600, 700, 44200 ],
    chartOptions: {
      labels: ['온라인쇼핑', '편의점', '마트', '커피와 디저트', '생활', '카테고리 미지정'],
      legend: {
        position: 'top',
      },
      chart: { type: 'donut', },
      dataLabels: {
        dropShadow: { enabled: true, },
      },
      tooltip: {
        y: { formatter: toMoneyString }
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              value: {
                formatter: toMoneyString,
              },
              total: {
                show: true,
                formatter: (v) => {
                  let total = v.globals.series.reduce((a, b) => a + b);
                  return toMoneyString(total);
                },
              }, 
            },
          }
        }
      }
    },
  }),

  computed: {
    ...mapState('user', ['userId']),
  },

  methods: {
    ...mapMutations('user', { SET_USER_ID }),
    initPage(userId) {
      this.SET_USER_ID(userId);
    },
  },

  created() {
    this.initPage(this.$route.params.userId);
  },

  beforeRouteUpdate(to, from, next) {
    this.initPage(to.params.userId);
    next();
  }
}
</script>
