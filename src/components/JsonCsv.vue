<template>
  <md-layout class="json-csv" md-column-xsmall>
    <md-layout class="panel input" md-column md-flex-xsmall md-flex-small="50" md-flex>
      <h3>JSON</h3>
      <textarea class="text" md-flex="100"></textarea>
    </md-layout>
    <md-layout class="panel output" md-column md-flex-xsmall md-flex-small="50" md-flex>
      <h3>CSV</h3>
      <textarea class="text" md-flex="100"></textarea>
    </md-layout>
  </md-layout>
</template>

<script>
export default {
  name: 'jsoncsv',
};
</script>

<style lang="scss" scoped>
$font-mono: 'Monaco', Courier, monospace;
$font-size: 14px;

$padding-sm: 20px;

$color-blue:      #08b;
$color-darkgrey:  #202024;
$color-lightgrey: #bbb;
$color-white:     #ddd;

.json-csv {
    height: 100vh;

    color: $color-lightgrey;
    background: $color-darkgrey;
}


.panel {
  border-right: 1px solid $color-blue;
  border-bottom: 1px solid $color-blue;
}

h3 {
  margin: 0;
  padding: $padding-sm 0 0 $padding-sm;
}

.text {
    font-family: $font-mono;
    font-size: $font-size;

    padding: $padding-sm;

    resize: none;

    color: $color-white;
    border: none;
    outline: none;
    background: transparent;

    flex: 1;
}

</style>
