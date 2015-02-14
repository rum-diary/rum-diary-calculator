/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var moment = require('moment');
var calculator = require('./calculator');

module.exports = function (db, hostname, path, startDate, endDate) {
  return calculator.calculate(db, {
    pageView: {
      filter: {
        hostname: hostname,
        path: path,
        start: startDate,
        end: endDate
      },
      'hits_per_day': {
        path: '__all',
        start: startDate,
        end: endDate
      },
      'hits_per_page': {
        sort: 'desc',
        limit: 20
      },
      'referrers': {},
      'unique': {},
      'returning': {},
      'read-time': {},
      'internal-transfer-from': {},
      'exit': {},
      'bounce': {}
    }
  }).then(function (allResults) {
    var pageViewResults = allResults.pageView;

    var pageHitsInPeriod = pageViewResults.hits_per_page[0].hits;

    var exitRate = calculateExitRate(pageViewResults, path);
    var bounceRate = calculateBounceRate(pageViewResults, path);

    return {
      pageHitsPerPage: pageViewResults.hits_per_page,
      pageHitsPerDay: pageViewResults.hits_per_day.__all,
      referrers: pageViewResults.referrers.by_count.slice(0, 19),
      hits: {
        total: 'N/A',//totalHits,
        period: pageHitsInPeriod,
        today: pageViewResults.hits_per_day.__all[pageViewResults.hits_per_day.__all.length - 1].hits,
        unique: pageViewResults.unique,
        repeat: pageViewResults.returning,
        exitRate: exitRate,
        bounceRate: bounceRate
      },
      medianReadTime: msToHoursMinsSeconds(pageViewResults['read-time']),
      internalTransfer: {
        from: pageViewResults['internal-transfer-from']['by_dest'][path]
      }
    };
  });
};

function msToHoursMinsSeconds(ms) {
  var seconds = ((ms || 0) / 1000) << 0;

  var hours = (seconds / 3600) << 0;
  var minutes = ((seconds - hours * 3600) / 60) << 0;
  seconds = (seconds % 60);

  return {
    hours: padLeft(hours, 0, 2),
    minutes: padLeft(minutes, 0, 2),
    seconds: padLeft(seconds, 0, 2)
  };
}

function padLeft(numToPad, padWith, length) {
  var padded = '' + numToPad;

  while(padded.length < length) {
    padded = padWith + padded;
  }

  return padded;
}

function calculateBounceRate(results, path) {
  var pageHitsInPeriod = results.hits_per_page[0].hits;
  if (! pageHitsInPeriod) return 0;

  var bouncesInPeriod = results.bounce[path];
  return (100 * bouncesInPeriod / pageHitsInPeriod) << 0;
}

function calculateExitRate(results, path) {
  var pageHitsInPeriod = results.hits_per_page[0].hits;
  if (! pageHitsInPeriod) return 0;

  var exitsInPeriod = results.exit[path];
  return (100 * exitsInPeriod / pageHitsInPeriod) << 0;
}


