<template>
  <md-button class="md-icon-button md-spinner">
    <md-icon>more_vert</md-icon>
  </md-button>
</template>

<style scoped>
@keyframes spin {
  0% { transform: rotate(0); }
  100% { transform: rotate(360deg); }
}
.md-spinner {
  animation: spin 1s infinite linear;
  margin: 0;
}
</style>
