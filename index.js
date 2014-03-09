
var pretty = require('pretty');
var space = require('space');
var wordCount = require('word-count');

function Reading(el) {
  this.el = el;

  // format html
  var html = el.innerHTML;
  html = pretty(html);
  html = space(html);
  el.innerHTML = html;

  // word count
  this.count = wordCount(el.innerText || el.textContent);
}
require('emitter')(Reading.prototype);

Reading.prototype.restore = function() {
};

module.exports = function(el) {
  return new Reading(el);
};
