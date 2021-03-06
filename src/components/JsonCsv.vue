<template>
  <md-layout class="json-csv" md-column-xsmall>

    <!-- JSON Input -->
    <md-layout class="panel input" md-column md-flex-xsmall md-flex-small="50" md-flex>
      <h3 class="no-sel">JSON</h3>
      <textarea ref="input" class="text" v-model="input" v-on:keyup="handleParseInput" v-on:paste="handleParseInput" autofocus="true"></textarea>
      <md-layout class="controls" md-column>
        <md-button class="md-raised md-primary" v-on:click.native="handlePrettyJson" v-show="input && !error && json">Pretty JSON</md-button>
      </md-layout>
    </md-layout>

    <!-- CSV Output -->
    <md-layout class="panel output" md-column md-flex-xsmall md-flex-small="x" md-flex>
      <h3 class="no-sel">CSV</h3>
      <textarea ref="output" class="text" v-model="output"></textarea>
      <md-layout class="controls" md-column>
        <md-button class="md-raised md-accent" v-on:click.native="handleDownloadOutput" v-show="output">Download CSV</md-button>
      </md-layout>
    </md-layout>

    <!-- Errors -->
    <md-snackbar ref="snackbar" class="no-sel" :md-position="'bottom left'" :md-duration="999999">
      <span v-on:mouseover="clearError()">{{ error }}</span>
    </md-snackbar>

  </md-layout>
</template>

<script>
import _ from 'lodash';
import saveFile from '../lib/saveFile';
import csv from '../lib/csvFromObject';

export default {
  name: 'jsoncsv',
  data() {
    const input = '[{"id":1,"data":{"animal":"cat"}},{"id":2,"data":{"animal":"dog"}}]';
    const json = JSON.parse(input);
    const output = csv.csvFromObject(json);

    return {
      json,
      pretty: true,
      input,
      output,
      error: '',
    };
  },
  methods: {

    /**
     * Cleanup component state (existing output, errors) before parsing input
     */
    cleanupData: function cleanupData() {
      this.json = null;
      this.pretty = true;
      this.output = '';
      if (this.error) {
        this.clearError();
      }
    },

    /**
     * Generate CSV string from parsed input (data) and then output to textarea
     *
     * @param {Object|Array} data
     */
    outputCsv: function outputCsv(data) {
      if (data) {
        this.output = csv.csvFromObject(data);
        this.$refs.output.scrollTop = 0;
      }
    },

    /**
     * Display error snackbar with message (msg)
     *
     * @param {string} msg
     */
    showError: function showError(msg) {
      if (msg) {
        this.error = msg;
        this.$refs.snackbar.open();
      }
    },

    /**
     * Dismiss error snackbar and clear message
     */
    clearError: function clearError() {
      this.$refs.snackbar.close();
      this.error = '';
    },

    /**
     * Attempt to parse input as JSON, then output results as CSV or show error
     */
    handleParseInput: _.debounce(function debouncedParseInput() {
      this.cleanupData();

      let error;
      if (this.input) {
        try {
          this.json = JSON.parse(this.input);
        } catch (e) {
          error = (e && e.message) ? `Error: ${e.message}` : 'Unknown error parsing JSON.';
        }

        if (error) {
          this.showError(error);
        } else {
          this.outputCsv(this.json);
        }
      }
    }, 300),

    /**
     * Toggle reformat input/json with whitespace, indentions
     */
    handlePrettyJson: function handlePrettyJson() {
      if (this.json && !this.error) {
        const space = (this.pretty) ? 2 : 0;
        this.pretty = !this.pretty;
        this.input = JSON.stringify(this.json, null, space);
        this.$refs.input.scrollTop = 0;
      }
    },

    /**
     * Save output to disk as text/csv
     */
    handleDownloadOutput: function handleDownloadOutput() {
      if (this.output) {
        saveFile(this.output, 'output.csv');
      }
    },
  },
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

.no-sel {
  user-select: none;
}
</style>
