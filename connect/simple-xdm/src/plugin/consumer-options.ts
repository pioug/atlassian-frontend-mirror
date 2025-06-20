// @ts-nocheck
import $ from './dollar';

class ConsumerOptions {
	_elementExists($el) {
		return $el && $el.length === 1;
	}
	_elementOptions($el) {
		return $el.attr('data-options');
	}

	_getConsumerOptions() {
		var options = {},
			$optionElement = $('#ac-iframe-options'),
			$scriptElement = $("script[src*='/atlassian-connect/all']"),
			$cdnScriptElement = $("script[src*='/connect-cdn.atl-paas.net/all']");

		if (!this._elementExists($optionElement) || !this._elementOptions($optionElement)) {
			if (this._elementExists($scriptElement)) {
				$optionElement = $scriptElement;
			} else if (this._elementExists($cdnScriptElement)) {
				$optionElement = $cdnScriptElement;
			}
		}

		if (this._elementExists($optionElement)) {
			// get its data-options attribute, if any
			var optStr = this._elementOptions($optionElement);
			if (optStr) {
				// if found, parse the value into kv pairs following the format of a style element
				optStr.split(';').forEach((nvpair) => {
					nvpair = nvpair.trim();
					if (nvpair) {
						var nv = nvpair.split(':'),
							k = nv[0].trim(),
							v = nv[1].trim();
						if (k && v != null) {
							options[k] = v === 'true' || v === 'false' ? v === 'true' : v;
						}
					}
				});
			}
		}

		return options;
	}

	_flush() {
		delete this._options;
	}

	get(key) {
		if (!this._options) {
			this._options = this._getConsumerOptions();
		}
		if (key) {
			return this._options[key];
		}
		return this._options;
	}
}

export default new ConsumerOptions();
