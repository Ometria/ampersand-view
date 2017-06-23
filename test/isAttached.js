var test = require('tape');
var AmpersandView = require('../ampersand-view');

test('isAttachedToDOM one node', function (t) {
  var detachedEl = document.createElement('div');
  var parentView = new AmpersandView({
    template: '<span></span>',
    el: detachedEl
  });

  t.ok(parentView.isAttachedToDOM === false, 'view is `isAttachedToDOM` before render. Got: ' + parentView.isAttachedToDOM);
  parentView.render();
  t.notOk(parentView.isAttachedToDOM, 'view is `isAttachedToDOM` after render');

  parentView.isAttachedToDOM = true;

  t.ok(parentView.isAttachedToDOM, 'view not `isAttachedToDOM` after setting');

  parentView.remove();

  t.notOk(parentView.isAttachedToDOM, 'view is not `isAttachedToDOM` after removing');
  t.end();
});

test('isAttachedToDOM subview in render attached after', function (t) {
  var detachedEl = document.createElement('div');
  var childView;
  var ParentView = AmpersandView.extend({
    template: '<span></span>',
    render() {
      this.renderWithTemplate();

      childView = new AmpersandView({
        template: '<span></span>'
      });
      this.renderSubview(childView);
    }
  });
  var parentView = new ParentView({
    el: detachedEl
  });

  t.ok(parentView.isAttachedToDOM === false, 'view is `isAttachedToDOM` before render. Got: ' + parentView.isAttachedToDOM);
  t.notOk(parentView.isAttachedToDOM, 'parentView is `isAttachedToDOM` before render');

  parentView.render();

  t.notOk(parentView.isAttachedToDOM, 'parentView is `isAttachedToDOM` after render');
  t.notOk(childView.isAttachedToDOM, 'childView is `isAttachedToDOM` after render');

  parentView.isAttachedToDOM = true;

  t.ok(parentView.isAttachedToDOM, 'parentView not `isAttachedToDOM` after setting');
  t.ok(childView.isAttachedToDOM, 'childView not `isAttachedToDOM` after setting');

  parentView.remove();

  t.notOk(parentView.isAttachedToDOM, 'parentView is `isAttachedToDOM` after removing');
  t.notOk(childView.isAttachedToDOM, 'childView is `isAttachedToDOM` after removing');
  t.end();
});

test('isAttachedToDOM subview in render attached before (renderSubview)', function (t) {
  var detachedEl = document.createElement('div');
  var childView;
  var ParentView = AmpersandView.extend({
    template: '<span></span>',
    render() {
      this.renderWithTemplate();

      childView = new AmpersandView({
        template: '<span></span>'
      });
      this.renderSubview(childView);
    }
  });
  var parentView = new ParentView({
    el: detachedEl
  });

  t.notOk(parentView.isAttachedToDOM, 'parentView is `isAttachedToDOM` before setting');

  parentView.isAttachedToDOM = true;

  t.ok(parentView.isAttachedToDOM, 'parentView is `isAttachedToDOM` before render');

  parentView.render();

  t.ok(parentView.isAttachedToDOM, 'parentView is `isAttachedToDOM` after render');
  t.ok(childView.isAttachedToDOM, 'childView is `isAttachedToDOM` after render');

  parentView.remove();

  t.notOk(parentView.isAttachedToDOM, 'parentView is `isAttachedToDOM` after removing');
  t.notOk(childView.isAttachedToDOM, 'childView is `isAttachedToDOM` after removing');
  t.end();
});

test('isAttachedToDOM subview in render attached before (registerSubview)', function (t) {
  var detachedEl = document.createElement('div');
  var childView;
  var ParentView = AmpersandView.extend({
    template: '<span></span>',
    initialize() {
      childView = new AmpersandView({
        template: '<span></span>'
      });
      this.registerSubview(childView);
    },
    render() {
      this.renderWithTemplate();
    }
  });
  var parentView = new ParentView({
    el: detachedEl
  });

  t.notOk(parentView.isAttachedToDOM, 'parentView is `isAttachedToDOM` before setting');
  t.notOk(childView.isAttachedToDOM, 'childView is `isAttachedToDOM` before setting');

  parentView.isAttachedToDOM = true;

  t.ok(parentView.isAttachedToDOM, 'parentView is `isAttachedToDOM` before render');
  t.notOk(childView.isAttachedToDOM, 'childView is `isAttachedToDOM` before render');

  parentView.render();

  t.ok(parentView.isAttachedToDOM, 'parentView is `isAttachedToDOM` after parent render');
  t.notOk(childView.isAttachedToDOM, 'childView is `isAttachedToDOM` after parent render');

  childView.render();

  t.ok(childView.isAttachedToDOM, 'childView is `isAttachedToDOM` after child render');

  parentView.remove();

  t.notOk(parentView.isAttachedToDOM, 'parentView is `isAttachedToDOM` after removing');
  t.notOk(childView.isAttachedToDOM, 'childView is `isAttachedToDOM` after removing');
  t.end();
});

test('isAttachedToDOM subview in render attached before (subviews property)', function (t) {
  var detachedEl = document.createElement('div');
  var childView;
  var ParentView = AmpersandView.extend({
    template: '<span><span data-hook="test"></span></span>',
    subviews: {
      childView: {
        hook: 'test',
        prepareView: function(el) {
          childView = new AmpersandView({
            template: '<span></span>',
            el: el,
            parent: this
          });
          return childView;
        }
      }
    },
    render() {
      this.renderWithTemplate();
    }
  });
  var parentView = new ParentView({
    el: detachedEl
  });

  t.notOk(parentView.isAttachedToDOM, 'parentView is `isAttachedToDOM` before setting');

  parentView.isAttachedToDOM = true;

  t.ok(parentView.isAttachedToDOM, 'parentView is `isAttachedToDOM` before render');

  parentView.render();

  t.ok(parentView.isAttachedToDOM, 'parentView is `isAttachedToDOM` after parent render');
  t.ok(childView.isAttachedToDOM, 'childView is `isAttachedToDOM` after parent render');

  parentView.remove();

  t.notOk(parentView.isAttachedToDOM, 'parentView is `isAttachedToDOM` after removing');
  t.notOk(childView.isAttachedToDOM, 'childView is `isAttachedToDOM` after removing');
  t.end();
});
