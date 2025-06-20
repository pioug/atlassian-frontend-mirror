// @ts-nocheck
import Util from '../common/util';

import ConfigurationOptions from './configuration-options';
import documentContainer from './document-container';

var size = function (width, height, container) {
	var verticalScrollbarWidth = function () {
		var sbWidth = window.innerWidth - container.clientWidth;
		// sanity check only
		sbWidth = sbWidth < 0 ? 0 : sbWidth;
		sbWidth = sbWidth > 50 ? 50 : sbWidth;
		return sbWidth;
	};

	var horizontalScrollbarHeight = function () {
		var sbHeight =
			window.innerHeight - Math.min(container.clientHeight, document.documentElement.clientHeight);
		// sanity check only
		sbHeight = sbHeight < 0 ? 0 : sbHeight;
		sbHeight = sbHeight > 50 ? 50 : sbHeight;
		return sbHeight;
	};

	var w = width == null ? '100%' : width,
		h,
		docHeight;
	var widthInPx = Boolean(ConfigurationOptions.get('widthinpx'));
	container = container || documentContainer();
	if (!container) {
		Util.warn('size called before container or body appeared, ignoring');
	}

	if (widthInPx && typeof w === 'string' && w.search('%') !== -1) {
		w = Math.max(container.scrollWidth, container.offsetWidth, container.clientWidth);
	}
	if (height) {
		h = height;
	} else {
		// Determine height of document element
		docHeight = Math.max(
			container.scrollHeight,
			document.documentElement.scrollHeight,
			container.offsetHeight,
			document.documentElement.offsetHeight,
			container.clientHeight,
			document.documentElement.clientHeight,
		);

		if (container === document.body) {
			h = docHeight;
		} else {
			var computed = window.getComputedStyle(container);
			h = container.getBoundingClientRect().height;
			if (h === 0) {
				h = docHeight;
			} else {
				var additionalProperties = ['margin-top', 'margin-bottom'];
				additionalProperties.forEach(function (property) {
					var floated = parseFloat(computed[property]);
					h += floated;
				});
			}
		}
	}

	// Include iframe scroll bars if visible and using exact dimensions
	w =
		typeof w === 'number' &&
		Math.min(container.scrollHeight, document.documentElement.scrollHeight) >
			Math.min(container.clientHeight, document.documentElement.clientHeight)
			? w + verticalScrollbarWidth()
			: w;
	h =
		typeof h === 'number' && container.scrollWidth > container.clientWidth
			? h + horizontalScrollbarHeight()
			: h;

	return { w: w, h: h };
};

export default size;
