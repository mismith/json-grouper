<template>
  <div class="data-grouper" :class="{'bar-mode': barMode}">
    <group
      :data="grouped()"
      :collapsable="false"
      @collapse="handleCollapseAll()"
      @drag-drop="handleMove($event)"
      class="collapsable"
      :class="{collapsed: collapseAll}"
    >
      <md-button slot="header" @click.native="barMode = !barMode" class="md-icon-button md-raised barMode" :class="{'md-accent': barMode}">
        <md-icon>short_text</md-icon>
        <md-tooltip>Toggle bar mode</md-tooltip>
      </md-button>
    </group>
    <droppable class="groups" @drag-drop="handleMove($event, null)">
      <div>
        <group
          v-for="groupNum in groupNumsSortedByTotal"
          :key="groupNum"
          :group-num="groupNum"
          :data="grouped(groupNum)"
          :group-name="groupNames[groupNum]"
          @group-name-change="handleGroupNameChange($event)"
          @drag-drop="handleMove($event, groupNum)"
        />
      </div>
    </droppable>
  </div>
</template>

<script>
import CSVStringify from 'csv-stringify';
import Droppable from './Droppable';
import Group from './Group';

export default {
  name: 'data-grouper',
  props: {
    initialData: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      data: [],
      groupNames: {},
      collapseAll: false,
      barMode: false,
    };
  },
  computed: {
    numGroups() {
      return this.data.reduce((group, datum) => Math.max(group, datum.group || 0), 0);
    },
    groupNumsSortedByTotal() {
      const groupNums = [];
      for (let group = 1; group <= this.numGroups; group += 1) {
        groupNums.push({
          group,
          total: this.grouped(group || undefined)
            .reduce((votes, datum) => (votes + datum.votes), 0),
        });
      }
      return groupNums.sort((a, b) => (a.total - b.total) || (a.group - b.group))
        .reverse().map(groupNum => groupNum.group);
    },
  },
  methods: {
    grouped(group) {
      return this.data.filter(d => d.group === group);
    },
    handleMove([datum], group = undefined) {
      if (this.data) {
        const i = this.data.findIndex(d => d.$id === datum.$id);

        if (i >= 0) {
          this.$set(this.data[i], 'group', group === null ? (this.numGroups + 1) : group);
        }
      }
    },
    handleGroupNameChange([name, group]) {
      this.groupNames[group] = name || undefined;
    },
    handleCollapseAll() {
      if (this.collapseAll) {
        this.EventBus.$emit('group.expandAll');
      } else {
        this.EventBus.$emit('group.collapseAll');
      }
      this.collapseAll = !this.collapseAll;
    },

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
      const bundle = {
        groupNames: this.groupNames,
        data: this.data,
      };
      const json = JSON.stringify(bundle, null, 2);

      this.download(json, filename, 'json');
    },
    exportCsv(filename = undefined) {
      const groups = [];
      this.groupNumsSortedByTotal.concat(undefined).forEach((groupNum) => {
        groups.push(this.grouped(groupNum));
      });
      let rows = [];
      groups.forEach((items) => { // eslint-disable-line arrow-body-style
        rows = rows.concat(items.map((item) => { // eslint-disable-line arrow-body-style
          return {
            name: item.name,
            groupName: this.groupNames[item.group],
          };
        }));
      });
      CSVStringify(rows, (err, csv) => {
        this.download(csv, filename, 'csv');
      });
    },
  },
  mounted() {
    this.data = this.initialData.data || [];
    this.groupNames = this.initialData.groupNames || {};

    this.EventBus.$on('export-json', this.exportJson);
    this.EventBus.$on('export-csv', this.exportCsv);
  },
  beforeDestroy() {
    this.EventBus.$off('export-json', this.exportJson);
    this.EventBus.$off('export-csv', this.exportCsv);
  },
  components: {
    Droppable,
    Group,
  },
};
</script>

<style lang="scss">
.data-grouper {
  display: flex;
  flex-grow: 1;

  > .group {
    width: 25%;
    margin: 10px;
    margin-right: 0;
  }
  > .groups {
    width: 75%;
    padding: 5px;
  }
  &.bar-mode {
    > .groups {
      > div {
        flex-direction: column;
        flex-wrap: nowrap;

        .group {
          flex-grow: attr(data-votes integer, 1);
          min-width: 0;
          max-width: none;

          > header {
            .name {
              flex-shrink: 0;
            }
          }
          > div {
            display: none;
          }
        }
      }
    }
  }
}

.groups {
  display: flex;
  align-items: flex-start;
  overflow: auto;

  > div {
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
    position: relative;
    width: 100%;
    height: 100%;

    .group {
      min-width: 300px;
      max-width: calc(25% - 10px);
      max-height: calc(50vh - 10px);
    }
    &:before,
    &:after {
      display: none;
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 100px;
      height: 100px;
      background: #ccc;
      pointer-events: none;
    }
    &:before {
      height: 20px;
      margin-left: -40px;
    }
    &:after {
      width: 20px;
      margin-top: -40px;
    }
  }
  &.dragover {
    > div {
      &:before,
      &:after {
        display: block;
      }
    }
  }
}

.groups.dragover > div,
.group.dragover {
  box-shadow: 0 0 1px 2px #3f51b5;
}
</style>
