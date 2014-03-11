var pretty = require('pretty');
var space = require('space');
var wordCount = require('word-count');
var progress = require('reading-progress');
var timing = require('reading-time');
var events = require('event');

function Reading(el) {
  if (el) {
    this.setup(el);
  }
}
require('emitter')(Reading.prototype);

Reading.prototype.setup = function(el) {
  this.el = el;

  // format html
  var html = el.innerHTML;
  html = pretty(html);
  html = space(html);
  el.innerHTML = html;

  // word count
  this.count = wordCount(el.innerText || el.textContent);
  this.timing = timing(this.count);
  this.bind();
};

Reading.prototype.bind = function() {
  var me = this;
  var starter = new Date();
  var clock;

  var record = function(e) {
    clearTimeout(clock);
    clock = setTimeout(function() {
      var p = progress(me.el);
      if (p < 1) {
        me.emit('progress', {percent: p * 100, progress: p});
      } else if (new Date() - starter > me.timing.fast) {
        me.emit('progress', {percent: 100, progress: 1});
        me.emit('end');
      }
    }, 500);
  };

  me._onScroll = record;
  events.bind(window, 'scroll', record);
};

Reading.prototype.unbind = function() {
  events.unbind(window, 'scroll', this._onScroll);
};

Reading.prototype.restore = function(percent) {
  percent || this.el.getAttribute('data-progress');
  if (!percent) return;

  if (percent > 1) {
    percent = percent / 100;
  }

  progress(this.el, percent);
};

module.exports = function(el) {
  return new Reading(el);
};
