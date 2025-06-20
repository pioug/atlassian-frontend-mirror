// @ts-nocheck
import Util from '../common/util';

import size from './size';

class AutoResizeAction {
	constructor(callback) {
		this.resizeError = Util.throttle(function (msg) {
			// eslint-disable-next-line no-console
			console.info(msg);
		}, 1000);

		this.dimensionStores = {
			width: [],
			height: [],
		};
		this.callback = callback;
	}

	_setVal(val, type, time) {
		this.dimensionStores[type] = this.dimensionStores[type].filter(function (entry) {
			return time - entry.setAt < 400;
		});
		this.dimensionStores[type].push({
			val: parseInt(val, 10),
			setAt: time,
		});
	}

	_isFlicker(val, type) {
		return this.dimensionStores[type].length >= 5;
	}

	triggered(dimensions) {
		dimensions = dimensions || size();
		let now = Date.now();
		this._setVal(dimensions.w, 'width', now);
		this._setVal(dimensions.h, 'height', now);
		var isFlickerWidth = this._isFlicker(dimensions.w, 'width', now);
		var isFlickerHeight = this._isFlicker(dimensions.h, 'height', now);
		if (isFlickerWidth) {
			dimensions.w = '100%';
			this.resizeError('SIMPLE XDM: auto resize flickering width detected, setting to 100%');
		}
		if (isFlickerHeight) {
			var vals = this.dimensionStores['height'].map((x) => {
				return x.val;
			});
			dimensions.h = Math.max.apply(null, vals) + 'px';
			this.resizeError(
				'SIMPLE XDM: auto resize flickering height detected, setting to: ' + dimensions.h,
			);
		}
		this.callback(dimensions.w, dimensions.h);
	}
}

export default AutoResizeAction;
