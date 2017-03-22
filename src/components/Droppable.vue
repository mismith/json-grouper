<template>
  <div
    :class="{droppable: true, dragover}"
    ref="droppable"
    @drop.stop="dragover = false; $emit('drag-drop', getData($event))"
    @dragover.prevent="dragover = true; $emit('drag-over', getData($event))"
    @dragenter="dragover = true; $emit('drag-enter', getData($event))"
    @dragleave="dragover = false; $emit('drag-leave', getData($event))"
  >
    <slot />
  </div>
</template>

<script>
export default {
  name: 'droppable',
  data() {
    return {
      dragover: false,
    };
  },
  methods: {
    getData(e) {
      const json = e.dataTransfer.getData('application/json') || '';

      return [json && JSON.parse(json), e];
    },
  },
};
</script>
