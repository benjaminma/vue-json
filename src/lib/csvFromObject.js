/**
 * csvFromObject.js
 */

import _ from 'lodash';

/**
 * Ensure data is object or array for CSV conversion
 */
const canConvert = (data) => {
  const ret = (data instanceof Object);
  return ret;
};

/**
 * Wrap data in an array (if not already, e.g. [data])
 */
const toArray = (data) => {
  if (Array.isArray(data)) {
    return data;
  }
  return new Array(data);
};

/**
 * Return flattened field key (e.g. "root.sub1.leaf2")
 *
 * @param {string} key
 * @param {Array} parents
 * @param {string} delim
 */
const generateFlattenedKey = (key, parents, delim) => {
  const chain = _.cloneDeep(parents);
  chain.push(key);
  return chain.join(delim);
};

/**
 * Generator to dereference value from nested object
 *
 * @param {string} key
 * @param {Array} parents
 * @return {Function} Op to dereference values
 */
const generateDereferenceOp = function generateDereferenceOp(key, parents, opts) {
  return function op(obj) {
    let curr = obj;
    let i = 0;
    const l = parents.length;
    while (curr && i < l) {
      const step = parents[i];
      curr = curr[step];
      i += 1;
    }
    if (curr) {
      if (curr[key] === null || curr[key] === undefined) {
        return opts.emptyValue;
      }
      return curr[key];
    }
    return opts.emptyValue;
  };
};

/**
 * Return meta object with ordered fields and dereference operations for array
 *
 * @param {Array} arr
 * @return {ret.fields} Original order of keys encountered
 * @return {ret.table} Lookup field -> dereference op
 */
const getCsvMeta = (arr, opts) => {
  const ret = {
    fields: [],
    table: {},
  };

  const fields = ret.fields;
  const table = ret.table;

  // Recurse through all nested objects to extract keys and lookup table
  const recurseKeys = (elem, parents) => {
    const currKeys = Object.keys(elem);
    currKeys.forEach((k) => {
      if (elem[k] instanceof Object && !Array.isArray(elem[k])) {
        // Explore nested objects
        const nested = _.cloneDeep(parents);
        nested.push(k);
        recurseKeys(elem[k], nested);
      } else {
        // Track, map, mark field and generate op
        const currKey = generateFlattenedKey(k, parents, opts.nestedDelim);
        if (!table[currKey]) {
          fields.push(currKey);
          const op = generateDereferenceOp(k, parents, opts);
          table[currKey] = op;
        }
      }
    });
  };

  // Check each elem for its keys
  arr.forEach((elem) => {
    recurseKeys(elem, []);
  });

  return ret;
};

/**
 * Wrap and escape value for CSV output
 */
const escapeValue = (val) => {
  let escaped;
  if (_.isString(val)) {
    escaped = val;
  } else {
    escaped = JSON.stringify(val);
  }
  escaped = escaped.replace(/"/g, '""');
  return `"${escaped}"`;
};

/**
 * Get CSV row representation of obj
 */
const getCsvRowValue = (obj, meta, opts) => {
  const ret = [];
  const fields = meta.fields;
  const table = meta.table;
  fields.forEach((f) => {
    ret.push(escapeValue(table[f](obj)));
  });
  return ret.join(opts.fieldDelim);
};

/**
 * @typedef {Object} CsvOptions
 * @property {boolean} includeHeader - Output with header row
 * @property {string} fieldDelim[=,] - Field seperator char
 * @property {string} nestedDelim[=.] - Nested key char
 * @property {any} emptyValue[=null] - What to insert if field value is not found
 */

/**
 * Return CSV representation of data given options (opts)
 *
 * @param {Object|Array} data
 * @param {CsvOptions} options
 */
const csvFromObject = (data, options) => {
  // Default options
  const opts = options || {};
  opts.includeHeader = opts.includeHeader || true;
  opts.fieldDelim = opts.fieldDelim || '\t';
  opts.nestedDelim = opts.nestedDelim || '__';
  opts.emptyValue = opts.emptyValue || null;

  if (canConvert(data)) {
    const arr = toArray(data);
    const out = [];

    const meta = getCsvMeta(arr, opts);
    if (opts.includeHeader) {
      out.push(_.map(meta.fields, (f => escapeValue(f))).join(opts.fieldDelim));
    }

    // Export each csv row
    arr.forEach((elem) => {
      out.push(getCsvRowValue(elem, meta, opts));
    });

    return out.join('\n');
  }
  return data || opts.emptyValue;
};

const csv = {
  canConvert,
  toArray,
  generateFlattenedKey,
  generateDereferenceOp,
  getCsvMeta,
  csvFromObject,
};

export default csv;
