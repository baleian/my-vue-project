<template>
  <v-container style="min-width: 500px; max-width: 1200px;">
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-row class="my-8">
      <v-col>
        <v-row dense>
          <v-col>
            <div class="subtitle flex display-1">유저 정보</div>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col>
            <v-sheet elevation="2">
              <UserProfile :user="user" />
            </v-sheet>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row class="my-8">
      <v-col>
        <v-row dense>
          <v-col>
            <div class="subtitle flex display-1">카테고리/브랜드 별 사용</div>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col>
            <v-sheet elevation=2>
              <UserChart :user="user" />
            </v-sheet>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { SET_USER_ID } from '@/store/modules/user';

import UserProfile from '@/components/UserProfile';
import UserChart from '@/components/UserChart';

export default {
  name: 'UserPage',

  components: { UserProfile, UserChart },

  data: () => ({
    overlay: false,
    user: {},
  }),

  computed: {
    ...mapState('user', ['userId']),
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