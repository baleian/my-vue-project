<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="6">
          <UserSearch solo></UserSearch>
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
    this.SET_USER_ID(this.$route.params.userId);
  },
}
</script>
