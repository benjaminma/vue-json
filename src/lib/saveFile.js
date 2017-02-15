/**
 * saveFile.js
 */

import FileSaver from 'file-saver';

/**
 * Save text to disk as filename
 */
const saveFile = (text, filename) => {
  const options = {
    text: 'text/plain;charset=utf-8',
  };
  FileSaver.saveAs(new Blob([text], options), filename);
};

export default saveFile;
