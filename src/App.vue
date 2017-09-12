<template>
  <div id="app">
    <md-toolbar class="md-dense">
      <h1 class="md-title">JSON Grouper</h1>
      <span style="flex-grow: 1"></span>
      <md-button @click.native="EventBus.$emit('group.collapseAll')" class="md-icon-button">
        <md-icon>remove_circle</md-icon>
        <md-tooltip>Collapse All</md-tooltip>
      </md-button>
      <md-button @click.native="EventBus.$emit('group.expandAll')" class="md-icon-button">
        <md-icon>add_circle</md-icon>
        <md-tooltip>Expand All</md-tooltip>
      </md-button>
      <md-button @click.native="EventBus.$emit('export-json')" class="md-icon-button">
        <md-icon>file_download</md-icon>
        <md-tooltip>Export JSON</md-tooltip>
      </md-button>
      </md-button>
    </md-toolbar>
    <data-grouper v-if="data" :initial-data="data" />
  </div>
</template>

<script>
import DataGrouper from './components/DataGrouper';

export default {
  name: 'app',
  data() {
    return {
      data: undefined,
    };
  },
  methods: {
    loadText(url) {
      return fetch(url)
        .then(res => res.text())
        .then((text) => {
          const data = [];
          const lines = text.replace(/^\s+|\s+$/ig, '').split('\n');
          lines.forEach((line, i) => {
            data.push({
              $id: i,
              name: line.replace(/^\s+|\s+$/ig, ''),
              votes: 1,
            });
          });
          this.data = {
            data,
          };
        });
    },
    loadJson(url) {
      return fetch(url)
        .then(res => res.json())
        .then((json) => {
          let data = {};
          if (json.data) {
            data = json;
          } else {
            data = {
              data: json,
            };
          }
          this.data = data;
        });
    },
  },
  created() {
    this.loadJson('/static/grouped.json');
  },
  components: {
    DataGrouper,
  },
};
</script>

<style>
html,
body,
#app {
  height: 100%;
  margin: 0;
}
#app {
  display: flex;
  flex-direction: column;
}
</style>
