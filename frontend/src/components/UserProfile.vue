<template>
  <v-container class="pa-5" fluid>
    <v-row dense justify="center">
      <v-overlay :value="updating">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
      <v-col style="min-width: 400px;">
        <v-form>
          <v-text-field
            v-model="user.user_id"
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
            v-model="user.user_name"
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
      </v-col>
      <v-col style="min-width: 400px;">
        <v-text-field
          v-model="region"
          label="Region"
          placeholder=" "
          readonly
          dense
        />
        <div id="map-profile" style="width:100%; height:300px;"></div>
      </v-col>
    </v-row>
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
    map: null,
    marker: null,
    updating: false,
  }),

  computed: {
    region() {
      if (!this.user.region1) return null;
      return `${this.user.region1} ${this.user.region2} ${this.user.region3}`.replace('  ', ' ').trim();
    },
  },

  methods: {
    ...mapMutations('user', { SET_USER_LIST }),
    async updateProfile() {
      try {
        this.updating = true;
        await this.$http.put(`/api/users/${this.user.user_id}`, {
          params: {
            user_name: this.user.user_name,
            description: this.user.description,
          }
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

  watch: {
    region(to) {
      let map = this.map;
      let marker = this.marker;
      
      if (!to) {
        map.setCenter(new window.kakao.maps.LatLng(0, 0));
        marker.setVisible(false);
        return;
      }

      let geocoder = new window.kakao.maps.services.Geocoder();
      geocoder.addressSearch(to, function(result, status) {
        if (status === window.kakao.maps.services.Status.OK) {
          var coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
          map.panTo(coords);
          marker.setPosition(coords);
          marker.setVisible(true);
        }
        else {
          map.setCenter(new window.kakao.maps.LatLng(0, 0));
          marker.setVisible(false);
        }
      });
    },
  },

  mounted() {
    var container = document.getElementById('map-profile');
    var options = {
      center: new window.kakao.maps.LatLng(0, 0),
      level: 6,
    };
    this.map = new window.kakao.maps.Map(container, options);
    this.marker = new window.kakao.maps.Marker({
      map: this.map,
      visible: false,
    });
  },

}
</script>

<style scoped>

</style>
