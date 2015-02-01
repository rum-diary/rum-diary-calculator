/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var moment = require('moment');
var calculator = require('./calculator');

module.exports = function (db, hostname, startDate, endDate) {
  startDate = startDate || moment().subtract(30, 'days').startOf('day');
  endDate = endDate || moment().endOf('day');

  return calculator.calculate(db, {
    /*
    tags: {
      filter: {
        hostname: hostname
      },
      'tags-total-hits': {
        tags: queryTags
      },
      'tags-names': {}
    },
    */
    pageView: {
      filter: {
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
      'returning': {}
    },
    site: {
      filter: {
        hostname: hostname
      },
      'sites-total-hits': {}
    },
    annotation: {
      filter: {
        '$and': [
          { hostname: hostname },
          { occurredAt: { '$gte': startDate } },
          { occurredAt: { '$lte': endDate } },
        ]
      },
      raw: {}
    }
  })
  .then(function (results) {
    var pageViewResults = results.pageView;
    var siteResults = results.site;
    var annotations = results.annotation;

    var totalHits = siteResults['sites-total-hits'][hostname] || 0;

    return {
      duration: results.duration,
      pageHitsPerPage: pageViewResults.hits_per_page,
      pageHitsPerDay: pageViewResults.hits_per_day.__all,
      referrers: pageViewResults.referrers.by_count.slice(0, 19),
      startDate: startDate,
      endDate: endDate,
      hits: {
        total: totalHits,
        period: pageViewResults.hits_per_page[0].hits,
        today: pageViewResults.hits_per_day.__all[pageViewResults.hits_per_day.__all.length - 1].hits,
        unique: pageViewResults.unique,
        repeat: pageViewResults.returning
      },
      annotations: annotations.raw
    };
  });
};

