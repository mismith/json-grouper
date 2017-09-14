<template>
  <div id="app">
    <md-toolbar class="md-dense">
      <h1 class="md-title">List Grouper</h1>

      <span style="flex-grow: 1;"></span>

      <md-button class="md-icon-button file-upload-button">
        <md-icon>file_upload</md-icon>
        <input type="file" accept="text/plain,application/json" @change="handleFileUpload($event.target.files[0])" @drop="handleFileUpload($event.dataTransfer.files[0])" />
        <md-tooltip>Upload</md-tooltip>
      </md-button>

      <md-menu md-size="3">
        <md-button class="md-icon-button" md-menu-trigger>
          <md-icon>file_download</md-icon>
          <md-tooltip>Download...</md-tooltip>
        </md-button>
        <md-menu-content>
          <md-menu-item @click.native="EventBus.$emit('export-json', uploadedFilename)">
            <md-icon>file_download</md-icon>
            <span>JSON</span>
          </md-menu-item>
          <md-menu-item @click.native="EventBus.$emit('export-csv', uploadedFilename)">
            <md-icon>file_download</md-icon>
            <span>CSV</span>
          </md-menu-item>
        </md-menu-content>
      </md-menu>

      <span style="flex-grow: 1;"></span>

    </md-toolbar>

    <data-grouper v-if="data" :initial-data="data" />
    <aside v-else>
      <div>No data loaded.</div>
    </aside>
  </div>
</template>

<script>
import DataGrouper from './components/DataGrouper';

export default {
  name: 'app',
  data() {
    return {
      data: undefined,
      file: undefined,
    };
  },
  computed: {
    uploadedFilename() {
      return (this.file && this.file.name && this.file.name.replace(/\.\w+$/, '')) || undefined;
    },
  },
  methods: {
    handleFileUpload(file) {
      this.data = undefined;
      this.file = undefined;

      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        switch (file.type) {
          case 'application/json':
            this.parseJson(JSON.parse(content));
            break;
          case 'text/plain':
          default:
            this.parseText(content);
            break;
        }
        this.file = file;
      };
      reader.readAsText(file);
    },

    fetchText(url) {
      return fetch(url)
        .then(res => res.text());
    },
    fetchJson(url) {
      return fetch(url)
        .then(res => res.json());
    },

    parseText(text) {
      const data = [];
      const lines = text.replace(/^\s+|\s+$/ig, '').split('\n');
      lines.forEach((line, i) => {
        const value = line.replace(/^\s+|\s+$/ig, '');
        if (value !== '') { // skip empty lines
          data.push({
            $id: i,
            name: value,
            votes: 1,
          });
        }
      });
      this.data = {
        data,
      };
    },
    parseJson(json) {
      let data = {};
      if (json.data) {
        data = json;
      } else {
        data = {
          data: json,
        };
      }
      this.data = data;
    },

    loadText(url) {
      return this.fetchText(url)
        .then(this.parseText);
    },
    loadJson(url) {
      return this.fetchJson(url)
        .then(this.parseJson);
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

<style lang="scss">
html,
body,
#app {
  height: 100%;
  margin: 0;
}
#app {
  display: flex;
  flex-direction: column;

  > aside {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-grow: 1;
  }
}

.file-upload-button {
  position: relative;

  input[type=file] {
    position: absolute;
    top: 0;
    left: 0;
    font-size: 1000px;
    opacity: 0;
  }
}
</style>
