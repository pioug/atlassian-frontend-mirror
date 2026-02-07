// @ts-nocheck
import { fg } from '@atlaskit/platform-feature-flags';

import PostMessage from '../common/postmessage';
import Util from '../common/util';

import autoResizeAction from './auto-resize-action';
import ConfigurationOptions from './configuration-options';
import ConsumerOptions from './consumer-options';
import documentContainer from './document-container';
import $ from './dollar';
import resizeListener from './resize-listener';
import size from './size';

const POSSIBLE_MODIFIER_KEYS = ['ctrl', 'shift', 'alt', 'meta'];

class AP extends PostMessage {
	constructor(options, initCheck = true) {
		super();
		ConfigurationOptions.set(options);
		this._data = this._parseInitData();
		ConfigurationOptions.set(this._data.options);
		this._data.options = this._data.options || {};
		this._hostOrigin = this._data.options.hostOrigin || '*';
		this._top = window.top;
		this._host = window.parent || window;
		this._topHost = this._getHostFrame(this._data.options.hostFrameOffset);
		if (this._topHost !== this._top) {
			this._verifyHostFrameOffset();
		}
		this._initTimeout = 5000;
		this._initReceived = false;
		this._initCheck = initCheck;
		this._isKeyDownBound = false;
		this._hostModules = {};
		this._eventHandlers = {};
		this._pendingCallbacks = {};
		this._keyListeners = [];
		this._version = '%%GULP_INJECT_VERSION%%';
		this._apiTampered = undefined;
		this._isSubIframe = this._topHost !== window.parent;
		this._onConfirmedFns = [];
		this._promise = Promise;
		if (this._data.api) {
			this._setupAPI(this._data.api);
			this._setupAPIWithoutRequire(this._data.api);
		}

		this._messageHandlers = {
			init_received: this._handleInitReceived,
			resp: this._handleResponse,
			evt: this._handleEvent,
			key_listen: this._handleKeyListen,
			api_tamper: this._handleApiTamper,
		};

		if (this._data.origin) {
			this._sendInit(this._host, this._data.origin);
			if (this._isSubIframe) {
				this._sendInit(this._topHost, this._hostOrigin);
			}
		}
		this._registerOnUnload();
		this.resize = Util._bind(this, (width, height) => {
			if (!documentContainer()) {
				Util.warn('resize called before container or body appeared, ignoring');
				return;
			}
			var dimensions = size();
			if (!width) {
				width = dimensions.w;
			}
			if (!height) {
				height = dimensions.h;
			}
			if (this._hostModules.env && this._hostModules.env.resize) {
				this._hostModules.env.resize(width, height);
			}
		});
		$(Util._bind(this, this._autoResizer));
		this.container = documentContainer;
		this.size = size;
		// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
		window.addEventListener('click', (e) => {
			this._host.postMessage(
				{
					eid: this._data.extension_id,
					type: 'addon_clicked',
				},
				this._hostOrigin,
			);
		});
	}

	_getHostFrame(offset) {
		// Climb up the iframe tree to find the real host
		if (offset && typeof offset === 'number') {
			var hostFrame = window;
			for (var i = 0; i < offset; i++) {
				hostFrame = hostFrame.parent;
			}
			return hostFrame;
		} else {
			return this._top;
		}
	}

	_isEmbeddedConfluenceUsage() {
		try {
			const uniqueKey = new URL(window.location.href).searchParams.get('uniqueKey');
			return uniqueKey !== null && uniqueKey.includes('embedded-confluence-iframe');
		} catch (e) {
			return false;
		}
	}

	_verifyHostFrameOffset() {
		// Asynchronously verify the host frame option with this._top
		var callback = (e) => {
			if (e.source === this._top && e.data && typeof e.data.hostFrameOffset === 'number') {
				// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
				window.removeEventListener('message', callback);
				if (this._getHostFrame(e.data.hostFrameOffset) !== this._topHost) {
					const isEmbeddedConfluence = this._isEmbeddedConfluenceUsage();
					if (isEmbeddedConfluence) {
						Util.log(
							'hostFrameOffset tampering detected in embedded-confluence context, but preserving current host frame',
						);
					} else {
						Util.error('hostFrameOffset tampering detected, setting host frame to top window');
						this._topHost = this._top;
					}
				}
			}
		};
		// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
		window.addEventListener('message', callback);

		this._top.postMessage(
			{
				type: 'get_host_offset',
			},
			this._hostOrigin,
		);
	}

	_handleApiTamper(event) {
		if (event.data.tampered !== false) {
			this._host = undefined;
			this._apiTampered = true;
			Util.error('XDM API tampering detected, api disabled');
		} else {
			this._apiTampered = false;
			this._onConfirmedFns.forEach(function (cb) {
				cb.apply(null);
			});
		}
		this._onConfirmedFns = [];
	}

	_registerOnUnload() {
		$.bind(
			window,
			'unload',
			Util._bind(this, function () {
				this._sendUnload(this._host, this._data.origin);
				if (this._isSubIframe) {
					this._sendUnload(this._topHost, this._hostOrigin);
				}
			}),
		);
	}

	_sendUnload(frame, origin) {
		frame.postMessage(
			{
				eid: this._data.extension_id,
				type: 'unload',
			},
			origin || '*',
		);
	}

	_bindKeyDown() {
		if (!this._isKeyDownBound) {
			$.bind(window, 'keydown', Util._bind(this, this._handleKeyDownDomEvent));
			this._isKeyDownBound = true;
		}
	}

	_autoResizer() {
		this._enableAutoResize = Boolean(ConfigurationOptions.get('autoresize'));
		if (ConsumerOptions.get('resize') === false || ConsumerOptions.get('sizeToParent') === true) {
			this._enableAutoResize = false;
		}
		if (this._enableAutoResize) {
			this._initResize();
		}
	}

	/**
	 * The initialization data is passed in when the iframe is created as its 'name' attribute.
	 * Example:
	 * {
	 *   extension_id: The ID of this iframe as defined by the host
	 *   origin: 'https://example.org'  // The parent's window origin
	 *   api: {
	 *     _globals: { ... },
	 *     messages = {
	 *       clear: {},
	 *       ...
	 *     },
	 *     ...
	 *   }
	 * }
	 **/
	_parseInitData(data) {
		try {
			return JSON.parse(data || window.name);
		} catch (e) {
			return {};
		}
	}

	_findTarget(moduleName, methodName) {
		return this._data.options &&
			this._data.options.targets &&
			this._data.options.targets[moduleName] &&
			this._data.options.targets[moduleName][methodName]
			? this._data.options.targets[moduleName][methodName]
			: 'top';
	}

	_createModule(moduleName, api) {
		return Object.getOwnPropertyNames(api).reduce((accumulator, memberName) => {
			const member = api[memberName];
			if (member.hasOwnProperty('constructor')) {
				accumulator[memberName] = this._createProxy(moduleName, member, memberName);
			} else {
				accumulator[memberName] = this._createMethodHandler({
					mod: moduleName,
					fn: memberName,
					returnsPromise: member.returnsPromise,
				});
			}
			return accumulator;
		}, {});
	}

	_setupAPI(api) {
		this._hostModules = Object.getOwnPropertyNames(api).reduce((accumulator, moduleName) => {
			accumulator[moduleName] = this._createModule(
				moduleName,
				api[moduleName],
				api[moduleName]._options,
			);
			return accumulator;
		}, {});

		Object.getOwnPropertyNames(this._hostModules._globals || {}).forEach((global) => {
			this[global] = this._hostModules._globals[global];
		});
	}

	_setupAPIWithoutRequire(api) {
		Object.getOwnPropertyNames(api).forEach((moduleName) => {
			if (typeof this[moduleName] !== 'undefined') {
				throw new Error('XDM module: ' + moduleName + ' will collide with existing variable');
			}
			this[moduleName] = this._createModule(moduleName, api[moduleName]);
		}, this);
	}

	_pendingCallback(mid, fn, metaData) {
		if (metaData) {
			Object.getOwnPropertyNames(metaData).forEach((metaDataName) => {
				fn[metaDataName] = metaData[metaDataName];
			});
		}
		this._pendingCallbacks[mid] = fn;
	}

	_createProxy(moduleName, api, className) {
		const module = this._createModule(moduleName, api);
		function Cls(args) {
			if (!(this instanceof Cls)) {
				return new Cls(arguments);
			}
			this._cls = className;
			this._id = Util.randomString();
			module.constructor.apply(this, args);
			return this;
		}
		Object.getOwnPropertyNames(module).forEach((methodName) => {
			if (methodName !== 'constructor') {
				Cls.prototype[methodName] = module[methodName];
			}
		});
		return Cls;
	}

	_createMethodHandler(methodData) {
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		let that = this;
		return function () {
			const args = Util.argumentsToArray(arguments);
			const data = {
				eid: that._data.extension_id,
				type: 'req',
				mod: methodData.mod,
				fn: methodData.fn,
			};

			var targetOrigin;
			var target;
			let xdmPromise;
			const mid = Util.randomString();

			if (that._findTarget(methodData.mod, methodData.fn) === 'top') {
				target = that._topHost;
				targetOrigin = that._hostOrigin;
			} else {
				target = that._host;
				targetOrigin = that._data.origin;
			}

			if (Util.hasCallback(args)) {
				data.mid = mid;
				that._pendingCallback(data.mid, args.pop(), {
					useCallback: true,
					isPromiseMethod: Boolean(methodData.returnsPromise),
				});
			} else if (methodData.returnsPromise) {
				data.mid = mid;
				xdmPromise = new Promise((resolve, reject) => {
					that._pendingCallback(
						data.mid,
						function (err, result) {
							if (err || (typeof result === 'undefined' && typeof err === 'undefined')) {
								reject(err);
							} else {
								resolve(result);
							}
						},
						{
							useCallback: false,
							isPromiseMethod: Boolean(methodData.returnsPromise),
						},
					);
				});

				xdmPromise.catch((err) => {
					Util.warn(`Failed promise: ${err}`);
				});
			}
			if (this && this._cls) {
				data._cls = this._cls;
				data._id = this._id;
			}
			data.args = Util.sanitizeStructuredClone(args);

			if (that._isSubIframe && typeof that._apiTampered === 'undefined') {
				that._onConfirmedFns.push(function () {
					target.postMessage(data, targetOrigin);
				});
			} else {
				target.postMessage(data, targetOrigin);
			}

			if (xdmPromise) {
				return xdmPromise;
			}
		};
	}

	_handleResponse(event) {
		var data = event.data;

		if (!data.forPlugin) {
			return;
		}
		var pendingCallback = this._pendingCallbacks[data.mid];
		if (pendingCallback) {
			delete this._pendingCallbacks[data.mid];
			try {
				// Promise methods always return error result as first arg
				// If a promise method is invoked using callbacks, strip first arg.
				if (pendingCallback.useCallback && pendingCallback.isPromiseMethod) {
					data.args.shift();
				}
				pendingCallback.apply(window, data.args);
			} catch (e) {
				Util.error(e.message, e.stack);
			}
		}
	}

	_handleEvent(event) {
		var sendResponse = function () {
			var args = Util.argumentsToArray(arguments);
			event.source.postMessage(
				{
					eid: this._data.extension_id,
					mid: event.data.mid,
					type: 'resp',
					args: args,
				},
				this._data.origin,
			);
		};
		var data = event.data;
		sendResponse = Util._bind(this, sendResponse);
		sendResponse._context = {
			eventName: data.etyp,
		};
		function toArray(handlers) {
			if (handlers) {
				if (!Array.isArray(handlers)) {
					handlers = [handlers];
				}
				return handlers;
			}
			return [];
		}
		var handlers = toArray(this._eventHandlers[data.etyp]);
		handlers = handlers.concat(toArray(this._eventHandlers._any));
		handlers.forEach((handler) => {
			try {
				handler(data.evnt, sendResponse);
			} catch (e) {
				Util.error('exception thrown in event callback for:' + data.etyp);
			}
		}, this);
		if (data.mid) {
			sendResponse();
		}
	}

	_handleKeyDownDomEvent(event) {
		var modifiers = [];
		POSSIBLE_MODIFIER_KEYS.forEach((modifierKey) => {
			if (event[modifierKey + 'Key']) {
				modifiers.push(modifierKey);
			}
		}, this);
		var keyListenerId = this._keyListenerId(event.keyCode, modifiers);
		var requestedKey = this._keyListeners.indexOf(keyListenerId);
		if (requestedKey >= 0) {
			this._host.postMessage(
				{
					eid: this._data.extension_id,
					keycode: event.keyCode,
					modifiers: modifiers,
					type: 'key_triggered',
				},
				this._data.origin,
			);
		}
	}

	_keyListenerId(keycode, modifiers) {
		var keyListenerId = keycode;
		if (modifiers) {
			if (typeof modifiers === 'string') {
				modifiers = [modifiers];
			}
			modifiers.sort();
			modifiers.forEach((modifier) => {
				keyListenerId += '$$' + modifier;
			}, this);
		}
		return keyListenerId;
	}

	_handleKeyListen(postMessageEvent) {
		var keyListenerId = this._keyListenerId(
			postMessageEvent.data.keycode,
			postMessageEvent.data.modifiers,
		);
		if (postMessageEvent.data.action === 'remove') {
			var index = this._keyListeners.indexOf(keyListenerId);
			this._keyListeners.splice(index, 1);
		} else if (postMessageEvent.data.action === 'add') {
			// only bind onKeyDown once a key is registered.
			this._bindKeyDown();
			this._keyListeners.push(keyListenerId);
		}
	}

	_checkOrigin(event) {
		let no_source_types = ['api_tamper'];
		if (event.data && no_source_types.indexOf(event.data.type) > -1) {
			return true;
		}

		if (this._isSubIframe && event.source === this._topHost) {
			return true;
		}

		return event.origin === this._data.origin && event.source === this._host;
	}

	_handleInitReceived() {
		this._initReceived = true;
	}

	_sendInit(frame, origin) {
		var targets;
		if (frame === this._topHost && this._topHost !== window.parent) {
			targets = ConfigurationOptions.get('targets');
		}

		frame.postMessage(
			{
				eid: this._data.extension_id,
				type: 'init',
				targets: targets,
			},
			origin || '*',
		);

		this._initCheck &&
			this._data.options.globalOptions.check_init &&
			setTimeout(() => {
				if (!this._initReceived) {
					throw new Error('Initialization message not received');
				}
			}, this._initTimeout);
	}

	broadcast(event, evnt) {
		if (!Util.isString(event)) {
			throw new Error('Event type must be string');
		}

		this._host.postMessage(
			{
				eid: this._data.extension_id,
				type: 'broadcast',
				etyp: event,
				evnt: evnt,
			},
			this._data.origin,
		);
	}

	require(modules, callback) {
		let requiredModules = Array.isArray(modules) ? modules : [modules],
			args = requiredModules.map((module) => {
				return this._hostModules[module] || this._hostModules._globals[module];
			});
		callback.apply(window, args);
	}

	register(handlers) {
		if (typeof handlers === 'object') {
			this._eventHandlers = { ...this._eventHandlers, ...handlers } || {};
			this._host.postMessage(
				{
					eid: this._data.extension_id,
					type: 'event_query',
					args: Object.getOwnPropertyNames(handlers),
				},
				this._data.origin,
			);
		}
	}
	registerAny(handlers) {
		this.register({ _any: handlers });
	}

	_initResize() {
		requestAnimationFrame(() => this.resize());
		var autoresize = new autoResizeAction(this.resize);
		resizeListener.add(Util._bind(autoresize, autoresize.triggered));
	}
}

export default AP;
