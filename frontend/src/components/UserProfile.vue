<template>
  <v-container class="pa-5" fluid>
      <v-overlay :value="updating">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
    <v-form>
      <v-text-field
        v-model="user.userId"
        label="ID"
        placeholder=" "
        readonly
        dense
      />
      <v-text-field
        v-model="user.age"
        label="Age"
        placeholder=" "
        readonly
        dense
      />
      <v-text-field
        v-model="user.gender"
        label="Gender"
        placeholder=" "
        readonly
        dense
      />
      <v-text-field
        v-model="user.userName"
        label="Name"
        placeholder=" "
        dense
      />
      <v-textarea
        v-model="user.description"
        label="Description"
        placeholder=" "
        rows=1
        dense
      />
      <v-btn color="primary" @click="updateProfile" :disabled="updating">Save</v-btn>
    </v-form>
  </v-container>
</template>

<script>
import { mapMutations } from 'vuex';
import { SET_USER_LIST } from '@/store/modules/user';

export default {
  name: 'UserProfile',

  props: {
    user: Object
  },
  
  data: () => ({
    updating: false,
  }),

  methods: {
    ...mapMutations('user', { SET_USER_LIST }),
    async updateProfile() {
      try {
        this.updating = true;
        await this.$http.put(`/api/users/${this.user.userId}`, {
          userName: this.user.userName,
          description: this.user.description,
        });
      } catch (e) {
        alert(e);
      } finally {
        var res = await this.$http.get('/api/users')
        this.SET_USER_LIST(res.data);
        this.updating = false;
      }
    },
  },
}
</script>

<style scoped>

</style>
