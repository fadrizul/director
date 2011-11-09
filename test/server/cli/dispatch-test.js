/*
 * dispatch-test.js: Tests for the core dispatch method. 
 *
 * (C) 2011, Nodejitsu Inc.
 * MIT LICENSE
 *
 */
 
var assert = require('assert'),
    vows = require('vows'),
    eyes = require('eyes'),
    sugarskull = require('../../../lib/sugarskull');
    
vows.describe('sugarskull/cli/dispatch').addBatch({
  "An instance of sugarskull.cli.Router": {
    topic: function () {
      var router = new sugarskull.cli.Router(),
          that = this;
      
      that.matched = {};
      that.matched['users'] = [];
      that.matched['apps'] = []

      router.on('users create', function () {
        that.matched['users'].push('on users create');
      });
      
      router.on(/apps (\w+\s\w+)/, function () {
        assert.equal(arguments.length, 1);
        that.matched['apps'].push('on apps (\\w+\\s\\w+)');
      })
      
      return router;
    },
    "should have the correct routing table": function (router) {
      assert.isObject(router.routes.users);
      assert.isObject(router.routes.users.create);
    },
    "the dispatch() method": {
      "users create": function (router) {
        assert.isTrue(router.dispatch('on', 'users create'));
        assert.equal(this.matched.users[0], 'on users create');
      },
      "apps foo bar": function (router) {
        assert.isTrue(router.dispatch('on', 'apps foo bar'));
        assert.equal(this.matched['apps'][0], 'on apps (\\w+\\s\\w+)');
      },
      "not here": function (router) {
        assert.isFalse(router.dispatch('on', 'not here'));
      },
      "still not here": function (router) {
        assert.isFalse(router.dispatch('on', 'still not here'));
      }
    }
  }
}).export(module);
