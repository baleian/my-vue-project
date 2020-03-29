<template>
  <v-container>
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
              <v-row>
                <v-col class="px-6 pt-6" style="min-width: 300px;">
                  <v-form class="fill-height">
                    <v-text-field
                      v-model="user.user_id"
                      label="ID"
                      disabled
                      required
                      dense
                    />
                    <v-text-field
                      v-model="user.age"
                      label="Age"
                      disabled
                      required
                      dense
                    />
                    <v-text-field
                      v-model="user.gender"
                      label="Gender"
                      disabled
                      required
                      dense
                    />
                    <v-text-field
                      v-model="user.user_name"
                      label="Name"
                      :disabled="profileUpdating"
                      dense
                    />
                    <v-textarea
                      v-model="user.description"
                      label="Description"
                      :disabled="profileUpdating"
                      rows=2
                      dense
                    />
                    <v-btn color="primary" @click="updateUserProfile" :disabled="profileUpdating">Save</v-btn>
                  </v-form>
                </v-col>
                <v-col class="px-6 pt-6" style="min-width: 300px;">
                  <v-text-field
                    v-model="userRegion"
                    label="Region"
                    dense
                    required
                    disabled
                  />
                  <div id="map-profile" style="height:300px;"></div>
                </v-col>
              </v-row>
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
              <v-row dense class="px-2">
                <v-col>
                  <v-switch class="float-left" v-model="isOthers" label="미분류"></v-switch>
                  <v-radio-group class="float-left ml-2" v-model="chartValue" row>
                    <v-radio label="금액" value="amt"></v-radio>
                    <v-radio label="횟수" value="cnt"></v-radio>
                  </v-radio-group>
                </v-col>
              </v-row>
              <v-row dense justify="center">
                <v-col align="center" style="min-width:400px; max-width:600px;">
                  <DonutChart 
                    :items="categoryItems"
                    item-label="category_name"
                    :item-value="chartValue"
                    :value-formatter="chartValueFormatter"
                  ></DonutChart>
                </v-col>
                <v-col align="center" style="min-width:400px; max-width:600px;">
                  <DonutChart 
                    :items="brandItems"
                    item-label="brand_name"
                    :item-value="chartValue"
                    :value-formatter="chartValueFormatter"
                  ></DonutChart>
                </v-col>
              </v-row>
            </v-sheet>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { SET_USER_ID, SET_USER_LIST } from '@/store/modules/user';

import DonutChart from '@/components/DonutChart';

function numberSplitFormatter(value) {
  let vs = (''+value).split('').reverse();
  for (var i = 0; i < vs.length - 1; i++) {
    if (i % 3 === 2) {
      vs[i] = ',' + vs[i];
    }
  }
  return vs.reverse().join('');
}

export default {
  name: 'UserPage',

  components: { DonutChart },

  data: () => ({
    isOthers: true,
    overlay: false,
    user: {},
    chartValue: 'amt',
    profileMap: null,
    profileMapMarker: null,
    profileUpdating: false,
  }),

  computed: {
    ...mapState('user', ['userId']),
    categoryItems() {
      if (!this.user.categories) return [];
      return this.user.categories.filter(c => {
        if (!this.isOthers && !c.category_id) {
          return false;
        }
        return true;
      })
    },
    brandItems() {
      if (!this.user.brands) return [];
      return this.user.brands.filter(c => {
        if (!this.isOthers && !c.brand_id) {
          return false;
        }
        return true;
      })
    },
    chartValueFormatter() {
      if (this.chartValue === 'amt') {
        return (v) => numberSplitFormatter(v) + '\uFFE6';
      }
      else if (this.chartValue === 'cnt') {
        return numberSplitFormatter;
      }
      else return null;
    },
    userRegion() {
      if (!this.user.region1) return null;
      return `${this.user.region1} ${this.user.region2} ${this.user.region3}`.replace('  ', ' ').trim();
    },
  },

  methods: {
    ...mapMutations('user', { SET_USER_ID, SET_USER_LIST }),
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
    async updateUserProfile() {
      try {
        this.profileUpdating = true;
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
        this.profileUpdating = false;
      }
    },
  },

  watch: {
    userRegion(to) {
      let map = this.profileMap;
      let marker = this.profileMapMarker;
      
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

  beforeRouteUpdate(to, from, next) {
    this.initPage(to.params.userId);
    next();
  },

  created() {
    this.initPage(this.$route.params.userId);
  },

  mounted() {
    var container = document.getElementById('map-profile');
    var options = {
      center: new window.kakao.maps.LatLng(0, 0),
      level: 6,
    };
    this.profileMap = new window.kakao.maps.Map(container, options);
    this.profileMapMarker = new window.kakao.maps.Marker({
      map: this.profileMap,
      visible: false,
    });
  },
}
</script>

<style scoped>
  .subtitle {
    font-weight: 500;
  }
</style>