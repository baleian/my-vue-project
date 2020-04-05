<template>
  <v-container style="min-width: 500px;" fluid>
    <v-overlay :value="overlay" z-index="99">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-sheet class="my-2 pa-2" elevation="2">
      <v-row justify="center">
        <v-card class="float-left ma-2" outlined width="500" height="350">
          <UserProfile :user="user" />
        </v-card>
        <v-card class="float-left ma-2" outlined width="350" height="350">
          <UserRank :state="user.state" />
        </v-card>
      </v-row>
    </v-sheet>
    <v-sheet class="my-2 pa-2" elevation="2">
      <v-row justify="center">
        <v-card class="float-left ma-2" elevation="0" width="350" height="64">
          <v-row justify="center" dense>
            <v-switch class="float-left" v-model="unclassified" label="미분류"></v-switch>
            <v-radio-group class="float-left ml-2" v-model="category" row>
              <v-radio label="카테고리" value="category"></v-radio>
              <v-radio label="브랜드" value="brand"></v-radio>
            </v-radio-group>
          </v-row>
        </v-card>
        <v-card class="float-left ma-2" outlined width="350" height="350">
          <UserCategoryRank :state="categoryState" />
        </v-card>
        <v-card class="float-left ma-2" outlined width="800" height="350">
          <UserCategoryAverage :state="categoryState" />
        </v-card>
      </v-row>
      <v-row justify="center">
        <v-card class="float-left ma-2 pt-5" outlined width="350" height="350">
          <UserCategoryRate :state="categoryState" value="count" />
        </v-card>
        <v-card class="float-left ma-2 pt-5" outlined width="350" height="350">
          <UserCategoryRate :state="categoryState" value="amount" />
        </v-card>
        <v-card class="float-left ma-2" outlined width="800" height="500">
            <UserCategoryHistory :history="categoryHistory" value="count" id="cw" group="ch" height="235" />
            <UserCategoryHistory :history="categoryHistory" value="amount" id="aw" group="ch" height="235" />
        </v-card>
      </v-row>
    </v-sheet>
    <v-sheet class="my-2 pa-2" elevation="2">
      <v-row justify="center">
        <v-card class="float-left ma-2 pa-2" outlined width="740" height="560">
          <UserHistoryMap :history="user.history" />
        </v-card>
      </v-row>
    </v-sheet>
  </v-container>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { SET_USER_ID } from '@/store/modules/user';

import UserProfile from '@/components/UserProfile';
import UserRank from '@/components/UserRank';
import UserCategoryRank from '@/components/UserCategoryRank';
import UserCategoryAverage from '@/components/UserCategoryAverage';
import UserCategoryRate from '@/components/UserCategoryRate';
import UserCategoryHistory from '@/components/UserCategoryHistory';
import UserHistoryMap from '@/components/UserHistoryMap';


export default {
  name: 'UserPage',

  components: { 
    UserProfile,
    UserRank,
    UserCategoryRank, 
    UserCategoryAverage,
    UserCategoryRate,
    UserCategoryHistory,
    UserHistoryMap,
  },

  data: () => ({
    user: {},
    overlay: false,
    category: 'category',
    unclassified: true,
  }),

  computed: {
    ...mapState('user', ['userId']),
    categoryState() {
      if (!this.user) return null;
      var state;
      if (this.category === 'category') {
        if (!this.user.categoryState) return null;
        state = this.user.categoryState.map(h => ({ ...h, id: h.categoryId, name: h.categoryName }));
        if (this.unclassified) return state;
        return state.filter(h => h.id !== "00099");
      }
      else if (this.category === 'brand') {
        if (!this.user.brandState) return null;
        state = this.user.brandState.map(h => ({ ...h, id: h.brandId, name: h.brandName }));
        if (this.unclassified) return state;
        return state.filter(h => h.id !== "B999999");
      }
      return [];
    },
    categoryHistory() {
      if (!this.user) return null;
      var history;
      if (this.category === 'category') {
        if (!this.user.categoryHistory) return null;
        history = this.user.categoryHistory.map(h => ({ ...h, id: h.categoryId, name: h.categoryName }));
        if (this.unclassified) return history;
        return history.filter(h => h.id !== "00099");
      }
      else if (this.category === 'brand') {
        if (!this.user.brandHistory) return null;
        history = this.user.brandHistory.map(h => ({ ...h, id: h.brandId, name: h.brandName }));
        if (this.unclassified) return history;
        return history.filter(h => h.id !== "B999999");
      }
      return [];
    },
  },

  methods: {
    ...mapMutations('user', { SET_USER_ID }),
    async initPage(userId) {
      this.SET_USER_ID(userId);
      let overlayTimeout = setTimeout(() => {
        this.overlay = true;
      }, 0);
      var res = await this.$http.get(`/api/users/${userId}`);
      this.user = res.data;
      clearTimeout(overlayTimeout);
      this.overlay = false;
    },
  },

  beforeRouteUpdate(to, from, next) {
    this.initPage(to.params.userId);
    next();
  },

  created() {
    this.initPage(this.$route.params.userId);
  },

}
</script>

<style scoped>
  .subtitle {
    font-weight: 500;
  }
</style>