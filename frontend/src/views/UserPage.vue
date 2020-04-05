<template>
  <v-container style="min-width: 500px;" fluid>
    <v-overlay :value="overlay" z-index="99">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-row justify="center">
      <v-sheet class="float-left ma-2" elevation="2" width="350" height="350">
        <UserRank :state="user.state" />
      </v-sheet>
      <v-sheet class="float-left ma-2" elevation="2" width="350" height="350">
        <UserCategoryRank :state="user.categoryState" />
      </v-sheet>
      <v-sheet class="float-left ma-2" elevation="2" width="800" height="350">
        <UserCategoryAverage :state="user.categoryState" />
      </v-sheet>
      <v-sheet class="float-left ma-2" elevation="2" width="350" height="350">
        <UserCategoryRate :state="user.categoryState" value="count" />
      </v-sheet>
      <v-sheet class="float-left ma-2" elevation="2" width="350" height="350">
        <UserCategoryRate :state="user.categoryState" value="amount" />
      </v-sheet>
      <v-sheet class="float-left ma-2" elevation="2" width="800" height="500">
          <UserCategoryHistory :history="user.categoryHistory" value="count" id="cw" group="ch" height="235" />
          <UserCategoryHistory :history="user.categoryHistory" value="amount" id="aw" group="ch" height="235" />
      </v-sheet>
      <v-sheet class="float-left ma-2 pa-2" elevation="2" width="740" height="560">
        <UserHistoryMap :history="user.history" />
      </v-sheet>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { SET_USER_ID } from '@/store/modules/user';

import UserRank from '@/components/UserRank';
import UserCategoryRank from '@/components/UserCategoryRank';
import UserCategoryAverage from '@/components/UserCategoryAverage';
import UserCategoryRate from '@/components/UserCategoryRate';
import UserCategoryHistory from '@/components/UserCategoryHistory';
import UserHistoryMap from '@/components/UserHistoryMap';


export default {
  name: 'UserPage',

  components: { 
    UserRank, 
    UserCategoryRank, 
    UserCategoryAverage,
    UserCategoryRate,
    UserCategoryHistory,
    UserHistoryMap,
  },

  data: () => ({
    overlay: false,
    user: {},
  }),

  computed: {
    ...mapState('user', ['userId']),
    count() {
      if (!this.user.state) return '';
      return this.user.state.count;
    },
    amount() {
      if (!this.user.state) return '';
      return this.user.state.amount;
    }
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