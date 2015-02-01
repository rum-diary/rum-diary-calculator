/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var calculator = require('./calculator');

module.exports = function (db, hostname, statName, startDate, endDate) {
  return calculator.calculate(db, {
    pageView: {
      navigation: {
        calculate: ['25', '50', '75']
      },
      'navigation-histogram': {
        statName: statName
      },
      'navigation-cdf': {
        statName: statName
      }
    }
  })
  .then(function (results) {
    results = results.pageView;
    return {
      histogram: results['navigation-histogram'],
      cdf: results['navigation-cdf'],
      first_q: results.navigation['25'],
      second_q: results.navigation['50'],
      third_q: results.navigation['75'],
    };
  });
};

