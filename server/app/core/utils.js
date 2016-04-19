/**
*
* app/core/utils.js
* All of your utils functions
*
**/

const util = {
  logError: (message) => {
    console.warn('');
    console.warn('##### ERROR');
    console.warn(message);
    console.warn('#####');
    console.warn('');
  },
};

module.exports = util;
