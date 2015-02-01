/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

module.exports = function (options) {
  return {
    siteTraffic: require('./site-traffic').bind(null, options.db),
    sitePerformance: require('./site-performance').bind(null, options.db)
  };
};


