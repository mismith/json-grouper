<template>
  <draggable :drag-data="datum" class="datum">
    <header>
      <div class="name">{{ datum.name }}</div>
      <div class="total">{{ datum.votes }}</div>
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
