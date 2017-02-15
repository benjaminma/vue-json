<template>
  <md-layout class="json-csv" md-column-xsmall>

    <md-layout class="panel input" md-column md-flex-xsmall md-flex-small="50" md-flex>
      <h3>JSON</h3>
      <textarea class="text"></textarea>
      <md-layout class="controls" md-column>
        <md-button class="md-icon-button" disabled>
          <md-icon>cloud_download</md-icon>
          <md-tooltip md-delay="200" md-direction="left">Load URL</md-tooltip>
        </md-button>
        <md-button class="md-icon-button" @click.native="$refs.snackbar.open()">
          <md-icon>line_style</md-icon>
          <md-tooltip md-delay="200" md-direction="left">Pretty JSON</md-tooltip>
        </md-button>
      </md-layout>
    </md-layout>

    <md-layout class="panel output" md-column md-flex-xsmall md-flex-small="50" md-flex>
      <h3>CSV</h3>
      <textarea class="text"></textarea>
      <md-layout class="controls" md-column>
        <md-button class="md-icon-button" disabled>
          <md-icon>settings</md-icon>
          <md-tooltip md-delay="200" md-direction="left">Settings</md-tooltip>
        </md-button>
        <md-button class="md-icon-button">
          <md-icon>file_download</md-icon>
          <md-tooltip md-delay="200" md-direction="left">Save CSV</md-tooltip>
        </md-button>
      </md-layout>
    </md-layout>

    <md-snackbar :md-position="'bottom left'" ref="snackbar" :md-duration="9000">
      <span>Something went wrong... beep beep!</span>
      <md-button @click.native="$refs.snackbar.close()">OK</md-button>
    </md-snackbar>

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

$color-blue:        #08b;
$color-lightgrey:   #bbb;
$color-foreground:  #ddd;
$color-background:  #111;

.json-csv {
    height: 100vh;

    color: $color-lightgrey;
    background: $color-background;
}

.panel {
  border-right: 1px solid $color-blue;
  border-bottom: 1px solid $color-blue;

  position: relative;
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

  color: $color-foreground;
  border: none;
  outline: none;
  background: transparent;

  flex: 1;
}

.controls {
  padding: $padding-sm;
  position: absolute;
  right: 0;
  bottom: 0;
}
</style>
