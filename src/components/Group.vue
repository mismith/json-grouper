<template>
  <droppable
    v-if="!groupNum || (groupNum && data.length)"
    @drag-drop="$emit('drag-drop', $event)"
    class="group"
    :class="{collapsable, collapsed}"
    :style="{width: collapsable ? `${totalVotes}%` : ''}"
  >
    <header :style="{backgroundColor: getGroupColor(groupNum)}">
      <div class="name">
        <div v-if="!groupNum">Ungrouped</div>
        <md-input-container v-else>
          <md-input :value="groupName" v-model="name" :placeholder="`Group ${groupNum}`" @input="handleNameChange($event)" />
        </md-input-container>
      </div>
      <slot name="header" />
      <md-button class="md-icon-button total" :disabled="!collapsable" @click.native="handleCollapse($event)">
        {{ totalVotes }}
      </md-button>
    </header>
    <div v-show="!collapsed">
      <datum v-for="datum in sortedData" :key="datum.name" :datum="datum" />
    </div>
    <slot />
  </droppable>
</template>

<script>
import RandomColor from 'randomcolor';
import Droppable from './Droppable';
import Datum from './Datum';

export default {
  name: 'group',
  props: {
    groupNum: {
      type: Number,
    },
    data: {
      type: Array,
    },
    groupName: {
      type: String,
    },
    collapsable: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      name: undefined,
      collapsed: false,
    };
  },
  computed: {
    sortedData() {
      return this.data.sort((a, b) => (b.votes - a.votes)
        || (b.group - a.group)
        || (a.name || '').localeCompare(b.name || ''));
    },
    totalVotes() {
      return this.data.reduce((votes, datum) => votes + datum.votes, 0);
    },
  },
  methods: {
    getGroupColor(groupNum) {
      return groupNum && RandomColor({
        luminosity: 'light',
        seed: groupNum * groupNum,
      });
    },
    handleCollapse(event) {
      if (this.collapsable) {
        this.collapsed = !this.collapsed;
      }
      this.$emit('collapse', event);
    },
    handleNameChange(e) {
      this.$emit('group-name-change', [this.name, this.groupNum, e]);
    },
  },
  mounted() {
    this.EventBus.$on('group.expandAll', () => {
      if (this.collapsable) this.collapsed = false;
    });
    this.EventBus.$on('group.collapseAll', () => {
      if (this.collapsable) this.collapsed = true;
    });
  },
  components: {
    Droppable,
    Datum,
  },
};
</script>

<style lang="scss">
.group {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  min-width: 100px;
  background-color: rgba(0,0,0,.1);
  margin: 5px;

  > header {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    padding: 10px;

    .name {
      padding: 0 10px;
      font-size: 16px;
      flex-grow: 1;
    }
    .total {
      min-height: 3em;
      min-width: 3em;
      background-color: rgba(0,0,0,.2);
      text-align: center;

      &:hover {
        background-color: rgba(0,0,0,.1) !important;
      }
    }
  }
  > div {
    overflow: auto;
  }
  &.collapsable {
    > header {
      .total {
        cursor: pointer;
      }
    }
    &.collapsed {
      > header {
        .total {
          background-color: rgba(0,0,0,.5);
          color: rgba(255,255,255,1);

          &:hover {
            background-color: rgba(0,0,0,.4) !important;
          }
        }
      }
    }
  }
}
.md-input-container {
  min-height: 0;
  padding: 0;
  margin: 0;
}
</style>
