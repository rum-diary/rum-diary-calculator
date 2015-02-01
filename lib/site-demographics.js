/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var calculator = require('./calculator');

module.exports = function (db, hostname, startDate, endDate) {
  return calculator.calculate(db, {
    pageView: {
      filter: {
        hostname: hostname,
        start: startDate,
        end: endDate
      },
      browsers: {
      },
      os: {
      },
      'os:form': {
      }
    }
  })
  .then(function (results) {
    results = results.pageView;
    return {
      browsers: results.browsers,
      os: results.os,
      os_form: results['os:form']
    };
  });
};

