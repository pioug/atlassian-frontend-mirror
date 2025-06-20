// @ts-nocheck
import Util from '../common/util';

var each = Util.each,
	document = window.document;

function $(sel, context) {
	context = context || document;
	var els = [];
	if (sel) {
		if (typeof sel === 'string') {
			var results = context.querySelectorAll(sel),
				arr_results = Array.prototype.slice.call(results);
			Array.prototype.push.apply(els, arr_results);
		} else if (sel.nodeType === 1) {
			els.push(sel);
		} else if (sel === window) {
			els.push(sel);
		} else if (typeof sel === 'function') {
			$.onDomLoad(sel);
		}
	}

	Util.extend(els, {
		each: function (it) {
			each(this, it);
			return this;
		},
		bind: function (name, callback) {
			this.each(function (i, el) {
				this.bind(el, name, callback);
			});
		},
		attr: function (k) {
			var v;
			this.each(function (i, el) {
				v = el[k] || (el.getAttribute && el.getAttribute(k));
				return !v;
			});
			return v;
		},
		removeClass: function (className) {
			return this.each(function (i, el) {
				if (el.className) {
					el.className = el.className.replace(new RegExp('(^|\\s)' + className + '(\\s|$)'), ' ');
				}
			});
		},
		html: function (html) {
			return this.each(function (i, el) {
				el.innerHTML = html;
			});
		},
		append: function (spec) {
			return this.each(function (i, to) {
				var el = context.createElement(spec.tag);
				each(spec, function (k, v) {
					if (k === '$text') {
						if (el.styleSheet) {
							// style tags in ie
							el.styleSheet.cssText = v;
						} else {
							el.appendChild(context.createTextNode(v));
						}
					} else if (k !== 'tag') {
						el[k] = v;
					}
				});
				to.appendChild(el);
			});
		},
	});

	return els;
}

function binder(std, odd) {
	std += 'EventListener';
	odd += 'Event';
	return function (el, e, fn) {
		if (el[std]) {
			el[std](e, fn, false);
		} else if (el[odd]) {
			el[odd]('on' + e, fn);
		}
	};
}

$.bind = binder('add', 'attach');
$.unbind = binder('remove', 'detach');

$.onDomLoad = function (func) {
	var w = window,
		readyState = w.document.readyState;

	if (readyState === 'complete') {
		func.call(w);
	} else {
		$.bind(w, 'load', function () {
			func.call(w);
		});
	}
};

export default $;
