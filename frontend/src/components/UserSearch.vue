<template>
  <v-autocomplete
    v-model="model"
    :items="items"
    @change="onChange"
    :loading="loading"
    :filter="filter"
    placeholder="Search User"
    append-icon="mdi-magnify"
    outlined
    rounded
    :solo="solo"
    :dense="dense"
    hide-no-data
    hide-details
  >
    <template v-slot:item="{ item }">
      <v-list-item-content>
        <v-list-item-title v-text="item.text"></v-list-item-title>
        <v-list-item-subtitle v-text="item.description"></v-list-item-subtitle>
      </v-list-item-content>
    </template>
  </v-autocomplete>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'UserSearch',

  props: {
    solo: Boolean,
    dense: Boolean,
  },

  data: () => ({
    model: null,
  }),

  computed: {
    ...mapState('user', ['userId', 'userList']),
    items() {
      return this.userList.map(user => ({
        text: user.name || user.id,
        value: user.id,
        description: user.description,
      }));
    },
    loading() {
      return this.items.length ? null : 'primary';
    },
  },

  methods: {
    onChange(value) {
      this.$router.push(`/${value}`);
    },
    filter(item, queryText, itemText) {
      if (item.value === queryText) return true;
      if (itemText.indexOf(queryText) > -1) return true;
      if (item.description.indexOf(queryText) > -1) return true;
      return false;
    },
  },

  created() {
    this.model = this.userId;
  },
}
</script>
