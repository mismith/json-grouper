<template>
  <draggable :drag-data="datum.name" class="datum">
    <header>
      <div class="name">
        <small v-if="datum.action" :class="`action action-${datum.action.toLowerCase()}`">{{ datum.action }}</small>
        {{ datum.name }}
      </div>
      <div class="total">
        {{ datum.votes }}
      </div>
    </header>
  </draggable>
</template>

<script>
import Draggable from './Draggable';

export default {
  name: 'datum',
  props: {
    datum: {
      type: Object,
      required: true,
    },
  },
  components: {
    Draggable,
  },
};
</script>

<style lang="scss">
.datum {
  padding: 5px 10px;
  border-radius: 10px;
  cursor: move;

  > header {
    display: flex;
    align-items: flex-start;
    flex-shrink: 0;

    .name {
      flex-grow: 1;
      padding-right: 10px;

      .action {
        background-color: rgba(0,0,0,.1);
        padding: 1px 4px;
        border-radius: 10px;

        &.action-start {
          background-color: rgba(0,255,0,.1);
        }
        &.action-continue {
          background-color: rgba(0,0,255,.1);
        }
        &.action-change {
          background-color: rgba(255,255,0,.1);
        }
        &.action-stop {
          background-color: rgba(255,0,0,.1);
        }
      }
    }
    .total {
      min-height: 1.5em;
      min-width: 1.5em;
      line-height: 1.5em;
      background-color: rgba(0,0,0,.1);
      text-align: center;
      border-radius: 50%;
    }
  }
  &:nth-child(odd) {
    background-color: rgba(0,0,0,.1);
  }

  &.dragging {
    opacity: .25;
  }
}
</style>
