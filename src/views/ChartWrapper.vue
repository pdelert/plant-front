<template>
  <div>
    <div>
      <img src="@/assets/logo.png" alt="logo">
    </div>
    <div class="container">
      <v-card class="item">
        <h1>See how my plant's doing !</h1>
        <p>The chart displays time points when measurements are made.</p>
        <p>As soon as the threshold is crossed the watering kicks in.</p>
        <a href="https://github.com/pdelert/plant-monitor-project" target="_blank">See project's repository</a>
      </v-card>
      <v-card class="item">
        <v-date-picker v-model="datetime" :model-config="modelConfig" mode="date" @input="fillData"/>
      </v-card>
    </div>
    <div class="container-chart">
      <v-card class="chart item">
        <chart :chart-data="events" :options="options"></chart>
      </v-card>
      <v-card class="item">
        <img alt="plant" class="resize" src="@/assets/IMG_2493.jpg">
      </v-card>
    </div>
  </div>
</template>

<script>
import Chart from './Chart.js'
import axios from 'axios';
import oauth from 'axios-oauth-client';
import Vue from 'vue';
import {ACCESS_TOKEN} from '@/constants';

const EVENTS_URL = `${process.env.VUE_APP_BACKEND_URL}/plant/server/events`;

const getClientCredentials = oauth.client(axios.create(), {
  url: `${process.env.VUE_APP_AUTH_URL}/oauth/token`,
  grant_type: 'client_credentials',
  client_id: `${process.env.VUE_APP_CLIENT_ID}`,
  client_secret: `${process.env.VUE_APP_CLIENT_SECRET}`,
  audience: `${process.env.VUE_APP_AUTH_AUDIENCE}`
});

export default {
  components: {
    Chart
  },
  data() {
    return {
      datetime: new Date(),
      modelConfig: {
        type: 'number',
      },
      events: {},
      options: {},
      token: {},
      start: {},
      end: {},
    }
  },
  async mounted() {
    this.token = await getClientCredentials().then((res) => {
      Vue.$cookies.set(ACCESS_TOKEN,
          res[ACCESS_TOKEN],
          process.env.VUE_APP_AUTH_COOKIE_AT_EXP_TIME,
          process.env.VUE_APP_AUTH_COOKIE_PATH,
          process.env.VUE_APP_AUTH_COOKIE_DOMAIN,
          process.env.VUE_APP_AUTH_COOKIE_SECURE);
      return res;
    });

    this.fillData();
    this.fillOptions();
  },
  methods: {
    fillData() {
      this.start = new Date(this.datetime).setUTCHours(0, 0, 0, 0);
      this.end =  new Date(this.datetime).setUTCHours(23, 59, 59, 999);
      const instance = axios.create({
        headers: {
          common: {
            Authorization: 'Bearer ' + Vue.$cookies.get(ACCESS_TOKEN)
          }
        }
      })
      instance.get(`${EVENTS_URL}?start=${Math.floor(this.start / 1000)}&end=${Math.floor(this.end / 1000)}`)
          .then((response) => {
            const labels = [];
            const data = [];
            const threshold = [];
            for (const element of response.data) {
              labels.push(element['time'])
              data.push(element['dry_level'])
              threshold.push(element['threshold'])
            }
            this.events = {
              labels: labels,
              datasets: [{
                label: 'Dry level',
                backgroundColor: '#5EC4EE',
                borderColor: '#5EC4EE',
                data: data
              },
                {
                  label: 'Threshold',
                  backgroundColor: '#EEB45E',
                  borderColor: '#EEB45E',
                  data: threshold,
                  fill: false,
                  borderWidth: 2,
                }]
            }
            return this.events;
          });
    },
    fillOptions() {
      this.options = {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: false,
            }
          }]
        }
      }
    }
  }
}
</script>
<style>
.container {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-around;
}

.container-chart {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-around;
}

@media all and (max-width: 800px){
  .container-chart {
    flex-direction: column;
  }

  .chart {
    width: 100%;
  }

  .resize {
    width: 100% !important;
  }

  #line-chart {
    min-width: 350px !important;
    min-height: 350px !important;
  }
}

.resize {
  margin-top: 10px;
  width: 35vw;
  height: auto;
}
.item {

}

.chart {
  margin-top: 10px;
  height: auto;
  width: 50%;
}

</style>
