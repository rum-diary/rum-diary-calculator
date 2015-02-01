/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var accessLevels = require('rum-diary-access-levels');

module.exports = function (db, hostname) {
  var siteCollection = db.site;

  return siteCollection.getOne({ hostname: hostname })
    .then(function (site) {
      var users = site.users;

      return {
        owner: site.owner,
        admin: filterAdminUsers(users),
        readonly: filterReadonlyUsers(users),
        is_public: site.is_public
      };
    });
};

function filterAdminUsers(users) {
  return filterUsersByLevel(users, accessLevels.ADMIN);
}

function filterReadonlyUsers(users) {
  return filterUsersByLevel(users, accessLevels.READONLY);
}

function filterUsersByLevel(users, requiredLevel) {
  return users.filter(function (user) {
    return user.access_level === requiredLevel;
  }).map(function (user) {
    return user.email;
  }).sort();
}
