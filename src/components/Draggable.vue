<template>
  <div
    :class="{draggable: true, dragging}"
    ref="draggable"
    draggable
    @dragstart="dragging = true; $emit('drag-start', setData($event))"
    @dragend="dragging = false; $emit('drag-end', getData($event))"
  >
    <slot />
  </div>
</template>

<script>
export default {
  name: 'draggable',
  props: {
    dragData: {
      required: false,
    },
  },
  data() {
    return {
      dragging: false,
    };
  },
  methods: {
    setData(e) {
      e.dataTransfer.setData('application/json', JSON.stringify(this.dragData || ''));

      return [this.dragData, e];
    },
    getData(e) {
      const json = e.dataTransfer.getData('application/json') || '';

      return [json && JSON.parse(json), e];
    },
  },
};
</script>
