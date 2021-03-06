/**
 * @jsx React.DOM
 */
'use strict';

var assert = require('assert');
var sinon = require('sinon');
var React = require('react');
var PathnameRouting = require('../PathnameRouting');
var route = require('../../route');
var Routes = route.Routes;
var Route = route.Route;

function delay(func) {
  setTimeout(func, 10);
}

describe('PathnameRouting', function() {

  var Main = React.createClass({
    render: function() {
      return <div>main</div>;
    }
  });

  var Page = React.createClass({
    render: function() {
      return <div>page</div>;
    }
  });

  var routes = (
    <Routes>
      <Route name="main" path="/" view={Main} />
      <Route name="page" path="/page" view={Page} />
    </Routes>
  );

  beforeEach(function() {
    window.history.pushState({}, '', '/');
  });

  it('starts routing', function(done) {
    var onRoute = sinon.spy();
    PathnameRouting.start(routes, onRoute);
    delay(function() {
      sinon.assert.calledOnce(onRoute);
      assert.equal(onRoute.firstCall.args[0].type.displayName, 'Main');
      done();
    });
  });

  it('navigates to a different route', function(done) {
    var onRoute = sinon.spy();
    var routing = PathnameRouting.start(routes, onRoute);
    delay(function() {
      routing.navigate('/page');
      delay(function() {
        sinon.assert.calledTwice(onRoute);
        assert.equal(onRoute.firstCall.args[0].type.displayName, 'Main');
        assert.equal(onRoute.secondCall.args[0].type.displayName, 'Page');
        done();
      });
    });
  });

  it('reacts on popstate', function(done) {
    var onRoute = sinon.spy();
    var routing = PathnameRouting.start(routes, onRoute);
    delay(function() {
      routing.navigate('/page');
      delay(function() {
        window.history.back();
        delay(function() {
          sinon.assert.callCount(onRoute, 3);
          assert.equal(onRoute.firstCall.args[0].type.displayName, 'Main');
          assert.equal(onRoute.secondCall.args[0].type.displayName, 'Page');
          assert.equal(onRoute.thirdCall.args[0].type.displayName, 'Main');
          done();
        });
      });
    });
  });

  it('generates href', function() {
    var onRoute = sinon.spy();
    var routing = PathnameRouting.start(routes, onRoute);
    assert.equal(routing.makeHref('main'), '/');
    assert.equal(routing.makeHref('page'), '/page');
  });

});
