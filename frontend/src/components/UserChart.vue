<template>
  <v-container fluid>
    <v-row dense>
      <v-col>
        <v-switch class="float-left" v-model="isOthers" label="미분류"></v-switch>
        <v-radio-group class="float-left ml-2" v-model="value" row>
          <v-radio label="금액" value="amt"></v-radio>
          <v-radio label="횟수" value="cnt"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>
    <v-row dense justify="center">
      <v-col align="center" style="min-width:400px;">
        <DonutChart 
          :items="categoryItems"
          item-label="category_name"
          :item-value="value"
          :value-formatter="valueFormatter"
        ></DonutChart>
      </v-col>
      <v-col align="center" style="min-width:400px;">
        <DonutChart 
          :items="brandItems"
          item-label="brand_name"
          :item-value="value"
          :value-formatter="valueFormatter"
        ></DonutChart>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import DonutChart from '@/components/DonutChart';

function numberSplitFormatter(value) {
  let vs = (''+value).split('').reverse();
  for (var i = 0; i < vs.length - 1; i++) {
    if (i % 3 === 2) {
      vs[i] = ',' + vs[i];
    }
  }
  return vs.reverse().join('');
}

export default {
  name: 'UserChart',

  components: { DonutChart },

  props: {
    user: Object
  },

  data: () => ({
    isOthers: true,
    value: 'amt',
  }),

  computed: {
    categoryItems() {
      if (!this.user.categories) return [];
      return this.user.categories.filter(c => {
        if (!this.isOthers && !c.category_id) {
          return false;
        }
        return true;
      })
    },
    brandItems() {
      if (!this.user.brands) return [];
      return this.user.brands.filter(c => {
        if (!this.isOthers && !c.brand_id) {
          return false;
        }
        return true;
      })
    },
    valueFormatter() {
      if (this.value === 'amt') {
        return (v) => numberSplitFormatter(v) + '\uFFE6';
      }
      else if (this.value === 'cnt') {
        return numberSplitFormatter;
      }
      else return null;
    },
  }
}
</script>

<style scoped>

</style>
