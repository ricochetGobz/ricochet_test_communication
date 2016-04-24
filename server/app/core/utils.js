/**
*
* app/core/utils.js
* All of your utils functions
*
**/

const util = {
  logError: (message) => {
    console.warn(`
      ##### ERROR
    ${message}
    `);
  },
  logDate: (message) => {
    console.log(`${new Date()} ${message}`);
  },
};

module.exports = util;
