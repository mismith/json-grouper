<template>
  <div class="data-grouper">
    <group :data="grouped()" :collapsable="false" @drag-drop="handleMove($event)" />
    <droppable class="groups" @drag-drop="handleMove($event, null)">
      <div>
        <group v-for="groupNum in groupNumsSortedByTotal" :key="groupNum" :group-num="groupNum" :data="grouped(groupNum)" :group-name="groupNames[groupNum]" @group-name-change="handleGroupNameChange($event)" @drag-drop="handleMove($event, groupNum)" />
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

    download(contents, filename = undefined) {
      const a = document.createElement('a');
      a.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(contents)}`);
      a.setAttribute('download', filename);
      a.click();
    },
    exportJson() {
      const bundle = {
        groupNames: this.groupNames,
        data: this.data,
      };
      const json = JSON.stringify(bundle, null, 2);

      this.download(json, 'grouped.json');
    },
    exportCsv() {
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
        this.download(csv, 'grouped.csv');
      });
    },
  },
  mounted() {
    this.data = this.initialData.data || [];
    this.groupNames = this.initialData.groupNames || {};

    this.EventBus.$on('export-json', this.exportJson);
    this.EventBus.$on('export-csv', this.exportCsv);
  },
  components: {
    Droppable,
    Group,
  },
};
</script>

<style lang="scss" scoped>
.data-grouper {
  display: flex;
  flex-grow: 1;

  > .group {
    width: 25%;
    margin: 10px;
  }
  > .groups {
    width: 75%;
    padding: 5px 5px 5px 0;
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

    .group {
      min-width: 300px;
      max-width: calc(25% - 10px);
      max-height: calc(50vh - 10px);
    }
  }
}
</style>
