<template>
  <div id="chart">
    <h1>Plant watering chart</h1>
    <chart :chart-data="events" :options="options"></chart>
  </div>
</template>

<script>
import Chart from './Chart.js'
import axios from 'axios';
import oauth from 'axios-oauth-client';

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
      events: {},
      options: {},
      token: {},
      start: new Date(Date.now() - 86400000).setUTCHours(0, 0, 0, 0),
      end: new Date().setUTCHours(23, 59, 59, 999),
    }
  },
  async mounted() {
    this.token = await getClientCredentials().then((res) => {
      return res
    });

    this.fillData();
    this.fillOptions();
  },
  methods: {
    fillData() {
      const instance = axios.create({
        headers: {
          common: {
            Authorization: 'Bearer ' + this.token.access_token
          }
        }
      })
      instance.get(`${EVENTS_URL}?start=${Math.floor(this.start/1000)}&end=${Math.floor(this.end/1000)}`)
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
#chart {
  width:90%;
  height: 20%;
}
</style>
