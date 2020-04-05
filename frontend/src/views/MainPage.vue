<template>
  <v-container style="display: flex; align-items: center; height: 100%; max-height: 1200px;">
    <v-row justify="center">
      <v-col align="center">
          <UserSearch style="max-width: 650px;" solo></UserSearch>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapMutations } from 'vuex';
import { SET_USER_ID } from '@/store/modules/user';

import UserSearch from '@/components/UserSearch';

export default {
  name: 'MainPage',

  components: {
    UserSearch,
  },

  methods: {
    ...mapMutations('user', { SET_USER_ID }),
  },

  created() {
    this.SET_USER_ID(null);
  },
}
</script>
