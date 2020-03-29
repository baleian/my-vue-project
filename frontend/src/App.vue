<template>
  <v-app>
    <v-app-bar app dense dark color="primary">
      <v-toolbar-title>
        <router-link to="/" style="cursor: pointer;" tag="span">Vue Tutorial</router-link>
      </v-toolbar-title>
      <v-spacer />
      <UserSearch v-if="userId" style="max-width: 650px;" dense></UserSearch>
    </v-app-bar>
    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { SET_USER_LIST } from '@/store/modules/user';
import UserSearch from '@/components/UserSearch';

export default {
  name: 'App',

  components: {
    UserSearch
  },

  computed: {
    ...mapState('user', ['userId']),
  },

  methods: {
    ...mapMutations('user', { SET_USER_LIST }),
  },

  created() {
    this.$http.get('/api/users')
      .then(res => {
        this.SET_USER_LIST(res.data);
      });
  },
}
</script>

<style>

</style>
