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
      <md-button @click.native="EventBus.$emit('download')" class="md-icon-button">
        <md-icon>file_download</md-icon>
        <md-tooltip>Download</md-tooltip>
      </md-button>
    </md-toolbar>
    <data-grouper :initial-data="data" />
  </div>
</template>

<script>
import DataGrouper from './components/DataGrouper';
import data from '../static/grouped.json';

export default {
  name: 'app',
  data() {
    return {
      data,
    };
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
