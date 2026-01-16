// @ts-nocheck
import documentContainer from './document-container';
function EventQueue() {
	this.q = [];
	this.add = function (ev) {
		this.q.push(ev);
	};

	var i, j;
	this.call = function () {
		for (i = 0, j = this.q.length; i < j; i++) {
			this.q[i].call();
		}
	};
}

function attachResizeEvent(element, resized) {
	if (!element.resizedAttached) {
		element.resizedAttached = new EventQueue();
		element.resizedAttached.add(resized);
	} else if (element.resizedAttached) {
		element.resizedAttached.add(resized);
		return;
	}

	// padding / margins on the body causes numerous resizing bugs.
	if (element.nodeName === 'BODY') {
		['padding', 'margin'].forEach((attr) => {
			element.style[attr + '-bottom'] = '0px';
			element.style[attr + '-top'] = '0px';
		}, this);
	}

	element.resizeSensor = document.createElement('div');
	element.resizeSensor.className = 'ac-resize-sensor';
	var style =
		'position: absolute; left: 0; top: 0; right: 0; bottom: 0; overflow: scroll; z-index: -1; visibility: hidden;';
	var styleChild = 'position: absolute; left: 0; top: 0;';

	element.resizeSensor.style.cssText = style;

	var expand = document.createElement('div');
	expand.className = 'ac-resize-sensor-expand';
	expand.style.cssText = style;

	var expandChild = document.createElement('div');
	expand.appendChild(expandChild);
	expandChild.style.cssText = styleChild;

	var shrink = document.createElement('div');
	shrink.className = 'ac-resize-sensor-shrink';
	shrink.style.cssText = style;

	var shrinkChild = document.createElement('div');
	shrink.appendChild(shrinkChild);
	shrinkChild.style.cssText = styleChild + ' width: 200%; height: 200%';

	element.resizeSensor.appendChild(expand);
	element.resizeSensor.appendChild(shrink);
	element.appendChild(element.resizeSensor);

	// https://bugzilla.mozilla.org/show_bug.cgi?id=548397
	// do not set body to relative
	if (
		element.nodeName !== 'BODY' &&
		window.getComputedStyle &&
		window.getComputedStyle(element).position === 'static'
	) {
		element.style.position = 'relative';
	}

	var lastWidth, lastHeight;

	var reset = function () {
		expandChild.style.width = expand.offsetWidth + 10 + 'px';
		expandChild.style.height = expand.offsetHeight + 10 + 'px';
		expand.scrollLeft = expand.scrollWidth;
		expand.scrollTop = expand.scrollHeight;
		shrink.scrollLeft = shrink.scrollWidth;
		shrink.scrollTop = shrink.scrollHeight;
		lastWidth = element.offsetWidth;
		lastHeight = element.offsetHeight;
	};

	reset();

	var changed = function () {
		if (element.resizedAttached) {
			element.resizedAttached.call();
		}
	};

	var onScroll = function () {
		if (element.offsetWidth !== lastWidth || element.offsetHeight !== lastHeight) {
			changed();
		}
		reset();
	};

	// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
	expand.addEventListener('scroll', onScroll);
	// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
	shrink.addEventListener('scroll', onScroll);

	var observerConfig = {
		attributes: true,
		attributeFilter: ['style'],
	};

	var observer = new MutationObserver(onScroll);
	element.resizeObserver = observer;
	observer.observe(element, observerConfig);
}

export default {
	add: function (fn: any): void {
		var container = documentContainer();
		attachResizeEvent(container, fn);
	},
	remove: function (): void {
		var container = documentContainer();
		if (container.resizeSensor) {
			container.resizeObserver.disconnect();
			container.removeChild(container.resizeSensor);
			delete container.resizeSensor;
			delete container.resizedAttached;
		}
	},
};
