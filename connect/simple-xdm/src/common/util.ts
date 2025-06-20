// @ts-nocheck
const LOG_PREFIX = '[Simple-XDM] ';
const nativeBind = Function.prototype.bind;
const util = {
	locationOrigin() {
		if (!window.location.origin) {
			return (
				window.location.protocol +
				'//' +
				window.location.hostname +
				(window.location.port ? ':' + window.location.port : '')
			);
		} else {
			return window.location.origin;
		}
	},

	randomString() {
		return Math.floor(Math.random() * 1000000000).toString(16);
	},

	isString(str) {
		return typeof str === 'string' || str instanceof String;
	},

	argumentsToArray(arrayLike) {
		return Array.prototype.slice.call(arrayLike);
	},

	argumentNames(fn) {
		return (
			fn
				.toString()
				.replace(/((\/\/.*$)|(\/\*[^]*?\*\/))/gm, '') // strip comments
				.replace(/[^(]+\(([^)]*)[^]+/, '$1') // get signature
				.match(/([^\s,]+)/g) || []
		);
	},

	hasCallback(args) {
		var length = args.length;
		return length > 0 && typeof args[length - 1] === 'function';
	},

	error(msg) {
		if (window.console && window.console.error) {
			var outputError = [];

			if (typeof msg === 'string') {
				outputError.push(LOG_PREFIX + msg);
				outputError = outputError.concat(Array.prototype.slice.call(arguments, 1));
			} else {
				outputError.push(LOG_PREFIX);
				outputError = outputError.concat(Array.prototype.slice.call(arguments));
			}
			window.console.error.apply(null, outputError);
		}
	},

	warn(msg) {
		if (window.console) {
			// eslint-disable-next-line no-console
			console.warn(LOG_PREFIX + msg);
		}
	},
	log(msg) {
		if (window.console) {
			window.console.log(LOG_PREFIX + msg);
		}
	},

	_bind(thisp, fn) {
		if (nativeBind && fn.bind === nativeBind) {
			return fn.bind(thisp);
		}
		return function () {
			return fn.apply(thisp, arguments);
		};
	},

	throttle(func, wait, context) {
		var previous = 0;
		return function () {
			var now = Date.now();
			if (now - previous > wait) {
				previous = now;
				func.apply(context, arguments);
			}
		};
	},

	each(list, iteratee) {
		var length;
		var key;
		if (list) {
			length = list.length;
			if (length != null && typeof list !== 'function') {
				key = 0;
				while (key < length) {
					if (iteratee.call(list[key], key, list[key]) === false) {
						break;
					}
					key += 1;
				}
			} else {
				for (key in list) {
					if (list.hasOwnProperty(key)) {
						if (iteratee.call(list[key], key, list[key]) === false) {
							break;
						}
					}
				}
			}
		}
	},

	extend(dest) {
		var args = arguments;
		var srcs = [].slice.call(args, 1, args.length);
		srcs.forEach(function (source) {
			if (typeof source === 'object') {
				Object.getOwnPropertyNames(source).forEach(function (name) {
					dest[name] = source[name];
				});
			}
		});
		return dest;
	},

	sanitizeStructuredClone(object) {
		const whiteList = [Boolean, String, Date, RegExp, Blob, File, FileList, ArrayBuffer];
		const blackList = [Error, Node];
		const warn = util.warn;
		var visitedObjects = [];

		function _clone(value) {
			if (typeof value === 'function') {
				warn('A function was detected and removed from the message.');
				return null;
			}

			if (
				blackList.some((t) => {
					if (value instanceof t) {
						warn(`${t.name} object was detected and removed from the message.`);
						return true;
					}
					return false;
				})
			) {
				return {};
			}

			if (value && typeof value === 'object' && whiteList.every((t) => !(value instanceof t))) {
				let newValue;

				if (Array.isArray(value)) {
					newValue = value.map(function (element) {
						return _clone(element);
					});
				} else {
					if (visitedObjects.indexOf(value) > -1) {
						warn('A circular reference was detected and removed from the message.');
						return null;
					}

					visitedObjects.push(value);

					newValue = {};

					for (let name in value) {
						if (value.hasOwnProperty(name)) {
							let clonedValue = _clone(value[name]);
							if (clonedValue !== null) {
								newValue[name] = clonedValue;
							}
						}
					}

					visitedObjects.pop();
				}
				return newValue;
			}
			return value;
		}

		return _clone(object);
	},

	getOrigin(url, base) {
		// everything except IE11
		if (typeof URL === 'function') {
			try {
				return new URL(url, base).origin;
			} catch (e) {}
		}
		// ie11 + safari 10
		var doc = document.implementation.createHTMLDocument('');
		if (base) {
			var baseElement = doc.createElement('base');
			baseElement.href = base;
			doc.head.appendChild(baseElement);
		}
		var anchorElement = doc.createElement('a');
		anchorElement.href = url;
		doc.body.appendChild(anchorElement);

		var origin = anchorElement.protocol + '//' + anchorElement.hostname;
		//ie11, only include port if referenced in initial URL
		if (url.match(/\/\/[^/]+:[0-9]+\//)) {
			origin += anchorElement.port ? ':' + anchorElement.port : '';
		}
		return origin;
	},
};

export default util;
