<template>
  <div id="app">
    <json-csv></json-csv>
  </div>
</template>

<script>
import 'vue-material/dist/vue-material.css';
import JsonCsv from './components/JsonCsv';

export default {
  name: 'app',
  components: {
    JsonCsv,
  },
};
</script>

<style lang="scss">
$font-mono: 'Monaco', Courier, monospace;
$color-darkred: darkred;

#app {
  font-family: $font-mono;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.md-snackbar-container {
  background: $color-darkred !important;
}
</style>
