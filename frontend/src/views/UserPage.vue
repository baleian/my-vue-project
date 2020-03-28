<template>
  <v-container class="fill-height" fluid>
    <v-row justify="center">
      <v-col align="center" cols="6">
        <h1>USER ID</h1>
        <span>{{ userId }}</span>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { SET_USER_ID } from '@/store/modules/user';

export default {
  name: 'UserPage',

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
