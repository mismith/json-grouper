<template>
  <div id="app">
    <md-toolbar class="md-dense">
      <div>
        <h1 class="md-title" style="margin-right: auto;">List Grouper</h1>

        <md-button class="md-icon-button file-upload-button">
          <md-icon>file_upload</md-icon>
          <input type="file" accept="text/plain,application/json" @change="handleFileUpload($event.target.files[0])" @drop="handleFileUpload($event.dataTransfer.files[0])" />
          <md-tooltip>Upload</md-tooltip>
        </md-button>
      </div>
      <div>
        <md-menu md-size="3">
          <md-button class="md-icon-button" md-menu-trigger>
            <md-icon>file_download</md-icon>
            <md-tooltip>Download</md-tooltip>
          </md-button>
          <md-menu-content>
            <md-menu-item @click.native="exportJson(uploadedFilename)">
              <md-icon>file_download</md-icon>
              <span>JSON</span>
            </md-menu-item>
            <md-menu-item @click.native="exportCsv(uploadedFilename)">
              <md-icon>file_download</md-icon>
              <span>CSV</span>
            </md-menu-item>
          </md-menu-content>
        </md-menu>

        <span style="flex-grow: 1;"></span>
      </div>
    </md-toolbar>

    <data-grouper v-if="data" ref="dataGrouper" :initial-list="data" />
    <aside v-else>
      <div>No data loaded.</div>
    </aside>
  </div>
</template>

<script>
import CSVStringify from 'csv-stringify';
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
    // import
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

    // export
    download(contents, filename = 'grouped', extension = 'txt') {
      const a = document.createElement('a');
      let mime;
      switch (extension) {
        case 'json':
          mime = 'application/json';
          break;
        case 'csv':
          mime = 'text/csv';
          break;
        case 'txt':
        default:
          mime = 'text/plain';
          break;
      }
      a.setAttribute('href', `data:${mime};charset=utf-8,${encodeURIComponent(contents)}`);
      a.setAttribute('download', `${filename}.${extension}`);
      a.click();
    },
    exportJson(filename = undefined) {
      const jsonBundle = this.$refs.dataGrouper.bundleJson();

      const json = JSON.stringify(jsonBundle, null, 2);

      this.download(json, filename, 'json');
    },
    exportCsv(filename = undefined) {
      const jsonBundle = this.$refs.dataGrouper.bundleJson();

      const rows = jsonBundle.data.map(datum => ({
        ...datum,
        group: jsonBundle.groupNames[datum.group],
      }));
      CSVStringify(rows, (err, csv) => {
        if (err) throw new Error(err);

        this.download(csv, filename, 'csv');
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

.md-toolbar {
  > div {
    display: flex;
    align-items: center;

    &:first-child {
      width: 25%;
      margin-right: 4px;
    }
    &:last-child {
      flex: 1;
      margin-left: 8px;
    }
  }
  .md-title {
    white-space: nowrap;
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
