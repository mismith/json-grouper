<template>
  <div
    ref="droppable"
    class="droppable"
    :class="{dragover}"
    @drop.stop="dragover = false; $emit('drag-drop', getData($event))"
    @dragover.prevent.stop="checkBubbling($event)"
    @dragenter.stop="checkBubbling($event, 'drag-enter')"
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
    checkBubbling(e, type = 'drag-over') {
      // bubble up until we find a droppable parent
      let el = e.target;
      while (el && !el.classList.contains('droppable')) {
        el = el.parentElement;
      }
      // only enable dragover if no 'droppable' parents found
      if (el) {
        this.dragover = true;
        this.$emit(type, this.getData(e));
      }
    },
    getData(e) {
      const json = e.dataTransfer.getData('application/json') || '';

      return [json && JSON.parse(json), e];
    },
  },
};
</script>
