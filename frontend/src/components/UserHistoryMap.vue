<template>
  <v-container class="px-2 pt-0 pb-1" fluid style="height: 100%;">
    <v-row dense style="height: 10%;">
      <v-range-slider
          class="align-center"
          v-model="sliderValue"
          min="0"
          :max="sliderMax"
          hide-details
      >
        <template v-slot:prepend>
            <v-text-field 
              :value="dates[sliderValue[0]]"
              dense
              readonly
              hide-details
              style="width: 90px"
              class="mt-0 pt-0"
            />
        </template>
        <template v-slot:append>
            <v-text-field 
              :value="dates[sliderValue[1]]"
              dense
              readonly
              hide-details
              style="width: 90px"
              class="mt-0 pt-0"
            />
        </template>
      </v-range-slider>
    </v-row>
    <v-row dense style="height: 90%;">
      <div  ref="historyMap" style="width:100%; height:100%;"></div>
    </v-row>
  </v-container>
</template>

<script>
import { DBSCAN } from 'density-clustering';
import { getCenter } from 'geolib';
import moment from 'moment-timezone';

import { numberSplitFormatter } from '@/utils/formatter';

const kakao = window.kakao;

export default {
  name: 'UserHistoryMap',

  props: {
    history: Array,
  },

  data: () => ({
    map: null,
    sliderValue: [0, 0],
    clusterer: null,
  }),

  computed: {
    dbscaned() {
      if (!this.history) return [];
      var gpsHistory = this.history.filter(h => h.latitude && h.longitude);
      var dbscan = new DBSCAN();
      var clusters = dbscan.run(gpsHistory.map(g => [g.latitude, g.longitude]), 0.02, 3);
      return clusters.flatMap((cluster, label) => 
        cluster.map(i => ({
          ...gpsHistory[i],
          label: label + 1,
        }))
      ).concat(dbscan.noise.map(i => ({
        ...gpsHistory[i],
        label: 0,
      })));
    },
    dates() {
      return Array.from(new Set(this.dbscaned.map(h => moment(h.ts).tz('Asia/Seoul').format('YYYY-MM-DD')))).sort((a, b) => a < b ? -1 : 1);
    },
    sliderMax() {
      if (!this.dates.length) return 0;
      return this.dates.length - 1;
    },
    centers() {
      var clustered = this.dbscaned.filter(g => g.label).reduce((prev, { label, latitude, longitude }) => {
        if (!(label in prev)) {
          prev[label] = [];
        }
        prev[label].push({
          latitude, longitude,
        });
        return prev;
      }, {});
      var centers = [];
      for (var label in clustered) {
        centers.push({
          ...getCenter(clustered[label]),
          label,
        })
      }
      return centers;
    },
    dateFiltered() {
      if (!this.history) return [];
      var minDate = this.dates[this.sliderValue[0]];
      var maxDate = this.dates[this.sliderValue[1]];
      return this.dbscaned.filter(({ts}) => {
        var dt = moment(ts).tz('Asia/Seoul').format('YYYY-MM-DD');
        return (minDate <= dt) && (dt <= maxDate);
      });
    },
    markers() {
      return this.dateFiltered.map(h => {
        var pos = new kakao.maps.LatLng(h.latitude, h.longitude);
        var infowindow = new kakao.maps.InfoWindow({
          content: `
            <div class="marker-info-wrap">
              <div class="marker-info">
                <div class="marker-info-title">
                  ${h.keyword}
                </div>
                <div class="marker-info-body">
                  <div class="marker-info-time">${moment(h.ts).tz('Asia/seoul').format('YYYY-MM-DD HH:mm:ss')}</div>
                  <div class="marker-info-merchant">매장명: ${[h.brandName || h.merchantName, h.storeName].filter(s => s).join(' ')}</div>
                  <div class="marker-info-category">카테고리: ${h.categoryName}</div>
                  <div class="marker-info-amount">금액: ${numberSplitFormatter(h.amount)}\uFFE6</div>
                  <div class="marker-info-gps">위경도: ${h.latitude}, ${h.longitude}</div>
                  <div class="marker-info-store-id">${h.storeId || ''}</div>
                  <div class="marker-info-brand-id">${h.brandId || ''}</div>
                </div>
              </div>
            </div>
          `, 
          position: pos,
          zIndex: 20,
        });
  
        var marker = new kakao.maps.Marker({ 
          position: pos,
        });
        marker.infowindow = infowindow;

        marker.mouseOverListener = () => {
          infowindow.open(this.map, marker);
        };

        marker.mouseClickListener = () => {
          if (infowindow.hold) infowindow.close();
          else infowindow.open(this.map, marker);
          infowindow.hold = !infowindow.hold;
        };

        marker.mouseOutListener = () => {
          if (infowindow.hold) return;
          infowindow.close();
        };

        if (h.label) {
          var imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png';
          var imageSize = new kakao.maps.Size(36, 37);
          var imgOptions =  {
            spriteSize : new kakao.maps.Size(36, 691),
            spriteOrigin : new kakao.maps.Point(0, ((h.label - 1) * 46) + 10),
            offset: new kakao.maps.Point(13, 37),
          };
          marker.setImage(new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions));
        }

        return marker;
      });
    },
    centerMarkers() {
      var geocoder = new kakao.maps.services.Geocoder();
      return this.centers.map(({ label, latitude, longitude }) => {
        var marker = new kakao.maps.Marker({
          position: new kakao.maps.LatLng(latitude, longitude),
          zIndex: 10,
          image: new kakao.maps.MarkerImage(
            'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png', 
            new kakao.maps.Size(24, 35)
          ),
        });

        geocoder.coord2RegionCode(longitude, latitude, (result, status) => {
          if (status !== kakao.maps.services.Status.OK) return;
          result = result.filter(r => r.region_type === 'H')[0];
          marker.setTitle(`${label}: ${result.region_1depth_name} ${result.region_2depth_name}`);
        });

        return marker;
      });
    },
  },

  watch: {
    dates(to) {
      if (!to) {
        this.sliderValue = [0, 0];
        return;
      }
      this.sliderValue = [0, to.length - 1];
    },
    dbscaned(to) {
      if (to) {
        var bounds = to.reduce((prev, curr) => {
          prev.extend(new kakao.maps.LatLng(curr.latitude, curr.longitude));
          return prev;
        }, new kakao.maps.LatLngBounds());
        this.map.setBounds(bounds);
      }
    },
    markers(to, from) {
      this.clusterer.clear();
      if (from) {
        from.forEach(marker => {
          kakao.maps.event.removeListener(marker, 'mouseover', marker.mouseOverListener);
          kakao.maps.event.removeListener(marker, 'click', marker.mouseClickListener);
          kakao.maps.event.removeListener(marker, 'mouseout', marker.mouseOutListener);
          marker.infowindow.close();
        });
      }
      if (to) {
        this.clusterer.addMarkers(to);
        to.forEach(marker => {
          kakao.maps.event.addListener(marker, 'mouseover', marker.mouseOverListener);
          kakao.maps.event.addListener(marker, 'click', marker.mouseClickListener);
          kakao.maps.event.addListener(marker, 'mouseout', marker.mouseOutListener);
        });
      }
    },
    centerMarkers(to, from) {
      if (from) from.map(marker => marker.setMap(null));
      if (to) to.map(marker => marker.setMap(this.map));
    },
  },

  mounted() {
    var container = this.$refs.historyMap;
    var options = {
      center: new kakao.maps.LatLng(0, 0),
    };
    this.map = new kakao.maps.Map(container, options);
    this.clusterer = new kakao.maps.MarkerClusterer({
      map: this.map,
      averageCenter: true,
      minLevel: 5,
    });
  },
}
</script>

<style scoped>

</style>

<style>
  .marker-info-wrap {
    width: 280px;
    height: 130px;
    text-align: left;
    overflow: visible;
    font-size: 12px;
    font-family: 'Malgun Gothic', dotum, '돋움', sans-serif;
  }
  .marker-info {
    width: 284px;
    height: 132px;
    left: -2px;
    top: -2px;
    position: absolute;
    border: 0; 
    box-shadow: 0px 1px 2px #888;
    overflow: visible;
    background: #fff;
  }
  .marker-info:after {
    content: '';
    position: absolute;
    width: 22px; height: 12px;
    left: 50%; margin-left: -11px; bottom: -12px;
    background: url('https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/vertex_white.png')
  }
  .marker-info-title {
    padding: 4px 4px 4px 10px;
    height: 34px;
    overflow-x: auto;
    overflow-y: hidden;
    background: #eee;
    border-bottom: 1px solid #ddd;
    font-size: 16px;
    font-weight: bold;
    white-space: nowrap;
  }
  .marker-info-body {
    position: relative;
    overflow: auto;
    padding: 5px 5px 5px 10px;
    height: 96px;
  }
  .marker-info ::-webkit-scrollbar {
    width: 5px;
    height: 0px;
  }
  .marker-info ::-webkit-scrollbar-thumb {
    background-color: darkgrey;
  }
  .marker-info-time {
    font-size: 11px;
    color: #888;
    margin-top: -2px;
    margin-bottom: 2px;
  }

</style>
