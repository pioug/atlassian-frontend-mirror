// @ts-nocheck
/**
 * Postmessage format:
 *
 * Initialization
 * --------------
 * {
 *   type: 'init',
 *   eid: 'my-addon__my-module-xyz'  // the extension identifier, unique across iframes
 * }
 *
 * Request
 * -------
 * {
 *   type: 'req',
 *   eid: 'my-addon__my-module-xyz',  // the extension identifier, unique for iframe
 *   mid: 'xyz',  // a unique message identifier, required for callbacks
 *   mod: 'cookie',  // the module name
 *   fn: 'read',  // the method name
 *   args: [arguments]  // the method arguments
 * }
 *
 * Response
 * --------
 * {
 *   type: 'resp'
 *   eid: 'my-addon__my-module-xyz',  // the extension identifier, unique for iframe
 *   mid: 'xyz',  // a unique message identifier, obtained from the request
 *   args: [arguments]  // the callback arguments
 * }
 *
 * Event
 * -----
 * {
 *   type: 'evt',
 *   etyp: 'some-event',
 *   evnt: { ... }  // the event data
 *   mid: 'xyz', // a unique message identifier for the event
 * }
 **/

import PostMessage from '../common/postmessage';
import Utils from '../common/util';

let VALID_EVENT_TIME_MS = 30000; //30 seconds

class XDMRPC extends PostMessage {
	_padUndefinedArguments(array, length) {
		return array.length >= length ? array : array.concat(new Array(length - array.length));
	}

	constructor(config) {
		config = config || {};
		super(config);
		this._registeredExtensions = config.extensions || {};
		this._registeredAPIModules = {};
		this._registeredAPIModules._globals = {};
		this._pendingCallbacks = {};
		this._keycodeCallbacks = {};
		this._clickHandlers = [];
		this._pendingEvents = {};
		this._messageHandlers = {
			init: this._handleInit,
			req: this._handleRequest,
			resp: this._handleResponse,
			broadcast: this._handleBroadcast,
			event_query: this._handleEventQuery,
			key_triggered: this._handleKeyTriggered,
			addon_clicked: this._handleAddonClick,
			get_host_offset: this._getHostOffset,
			unload: this._handleUnload,
		};
	}

	_verifyAPI(event, reg) {
		var untrustedTargets = event.data.targets;
		if (!untrustedTargets) {
			return;
		}
		var trustedSpec = this.getApiSpec();
		var tampered = false;

		function check(trusted, untrusted) {
			Object.getOwnPropertyNames(untrusted).forEach(function (name) {
				if (typeof untrusted[name] === 'object' && trusted[name]) {
					check(trusted[name], untrusted[name]);
				} else {
					if (untrusted[name] === 'parent' && trusted[name]) {
						tampered = true;
					}
				}
			});
		}
		check(trustedSpec, untrustedTargets);
		if (event.source && event.source.postMessage) {
			// only post a message if the source of the event still exists
			event.source.postMessage(
				{
					type: 'api_tamper',
					tampered: tampered,
				},
				reg.extension.url,
			);
		} else {
			// eslint-disable-next-line no-console
			console.warn('_verifyAPI postMessage skipped as event source missing.');
		}
	}

	_handleInit(event, reg) {
		if (event.source && event.source.postMessage) {
			// only post a message if the source of the event still exists
			event.source.postMessage({ type: 'init_received' }, reg.extension.url);
		} else {
			// eslint-disable-next-line no-console
			console.warn('_handleInit postMessage skipped as event source missing.');
		}
		this._registeredExtensions[reg.extension_id].source = event.source;
		if (reg.initCallback) {
			reg.initCallback(event.data.eid);
			delete reg.initCallback;
		}
		if (event.data.targets) {
			this._verifyAPI(event, reg);
		}
	}

	_getHostOffset(event, _window) {
		var hostWindow = event.source;
		var hostFrameOffset = null;
		var windowReference = _window || window; // For testing

		if (
			windowReference === windowReference.top &&
			typeof windowReference.getHostOffsetFunctionOverride === 'function'
		) {
			hostFrameOffset = windowReference.getHostOffsetFunctionOverride(hostWindow);
		}

		if (typeof hostFrameOffset !== 'number') {
			hostFrameOffset = 0;
			// Find the closest frame that has the same origin as event source
			while (!this._hasSameOrigin(hostWindow)) {
				// Climb up the iframe tree 1 layer
				hostFrameOffset++;
				hostWindow = hostWindow.parent;
			}
		}

		if (event.source && event.source.postMessage) {
			// only post a message if the source of the event still exists
			event.source.postMessage(
				{
					hostFrameOffset: hostFrameOffset,
				},
				event.origin,
			);
		} else {
			// eslint-disable-next-line no-console
			console.warn('_getHostOffset postMessage skipped as event source missing.');
		}
	}

	_hasSameOrigin(window) {
		if (window === window.top) {
			return true;
		}

		try {
			// Try set & read a variable on the given window
			// If we can successfully read the value then it means the given window has the same origin
			// as the window that is currently executing the script
			var testVariableName = 'test_var_' + Math.random().toString(16).substr(2);
			window[testVariableName] = true;
			return window[testVariableName];
		} catch (e) {
			// A exception will be thrown if the windows doesn't have the same origin
		}

		return false;
	}

	_handleResponse(event) {
		var data = event.data;
		var pendingCallback = this._pendingCallbacks[data.mid];
		if (pendingCallback) {
			delete this._pendingCallbacks[data.mid];
			pendingCallback.apply(window, data.args);
		}
	}

	registerRequestNotifier(cb) {
		this._registeredRequestNotifier = cb;
	}

	_handleRequest(event, reg) {
		function sendResponse() {
			var args = Utils.sanitizeStructuredClone(Utils.argumentsToArray(arguments));
			if (event.source && event.source.postMessage) {
				// only post a message if the source of the event still exists
				event.source.postMessage(
					{
						mid: event.data.mid,
						type: 'resp',
						forPlugin: true,
						args: args,
					},
					reg.extension.url,
				);
			} else {
				// eslint-disable-next-line no-console
				console.warn('_handleRequest postMessage skipped as event source missing.');
			}
		}

		var data = event.data;
		var module = this._registeredAPIModules[data.mod];
		const extension = this.getRegisteredExtensions(reg.extension)[0];
		if (module) {
			let fnName = data.fn;
			if (data._cls) {
				const Cls = module[data._cls];
				const ns = data.mod + '-' + data._cls + '-';
				sendResponse._id = data._id;
				if (fnName === 'constructor') {
					if (!Cls._construct) {
						Cls.constructor.prototype._destroy = function () {
							delete this._context._proxies[ns + this._id];
						};
						Cls._construct = function (...args) {
							const inst = new Cls.constructor(...args);
							const callback = args[args.length - 1];
							inst._id = callback._id;
							inst._context = callback._context;
							inst._context._proxies[ns + inst._id] = inst;
							return inst;
						};
					}
					module = Cls;
					fnName = '_construct';
				} else {
					module = extension._proxies[ns + data._id];
				}
			}
			let method = module[fnName];
			if (method) {
				var methodArgs = data.args;
				var padLength = method.length - 1;
				if (fnName === '_construct') {
					padLength = module.constructor.length - 1;
				}
				sendResponse._context = extension;
				methodArgs = this._padUndefinedArguments(methodArgs, padLength);
				methodArgs.push(sendResponse);
				const promiseResult = method.apply(module, methodArgs);

				if (method.returnsPromise) {
					if (
						!(typeof promiseResult === 'object' || typeof promiseResult === 'function') ||
						typeof promiseResult.then !== 'function'
					) {
						sendResponse('Defined module method did not return a promise.');
					} else {
						promiseResult
							.then((result) => {
								sendResponse(undefined, result);
							})
							.catch((err) => {
								err = err instanceof Error ? err.message : err;
								sendResponse(err);
							});
					}
				}

				if (this._registeredRequestNotifier) {
					this._registeredRequestNotifier.call(null, {
						module: data.mod,
						fn: data.fn,
						type: data.type,
						args: methodArgs,
						addon_key: reg.extension.addon_key,
						key: reg.extension.key,
						extension_id: reg.extension_id,
					});
				}
			}
		}
	}

	_handleBroadcast(event, reg) {
		var event_data = event.data;
		var targetSpec = (r) =>
			r.extension.addon_key === reg.extension.addon_key && r.extension_id !== reg.extension_id;
		this.dispatch(event_data.etyp, targetSpec, event_data.evnt, null, null);
	}

	_handleKeyTriggered(event, reg) {
		var eventData = event.data;
		var keycodeEntry = this._keycodeKey(eventData.keycode, eventData.modifiers, reg.extension_id);
		var listeners = this._keycodeCallbacks[keycodeEntry];
		if (listeners) {
			listeners.forEach((listener) => {
				listener.call(null, {
					addon_key: reg.extension.addon_key,
					key: reg.extension.key,
					extension_id: reg.extension_id,
					keycode: eventData.keycode,
					modifiers: eventData.modifiers,
				});
			}, this);
		}
	}

	defineAPIModule(module, moduleName) {
		moduleName = moduleName || '_globals';
		this._registeredAPIModules[moduleName] = Utils.extend(
			{},
			this._registeredAPIModules[moduleName] || {},
			module,
		);
		return this._registeredAPIModules;
	}

	isAPIModuleDefined(moduleName) {
		return typeof this._registeredAPIModules[moduleName] !== 'undefined';
	}

	_pendingEventKey(targetSpec, time) {
		var key = targetSpec.addon_key || 'global';
		if (targetSpec.key) {
			key = `${key}@@${targetSpec.key}`;
		}

		key = `${key}@@${time}`;

		return key;
	}

	queueEvent(type, targetSpec, event, callback) {
		var loaded_frame,
			targets = this._findRegistrations(targetSpec);

		loaded_frame = targets.some((target) => {
			return target.registered_events !== undefined;
		}, this);

		if (loaded_frame) {
			this.dispatch(type, targetSpec, event, callback);
		} else {
			this._cleanupInvalidEvents();
			var time = new Date().getTime();
			this._pendingEvents[this._pendingEventKey(targetSpec, time)] = {
				type,
				targetSpec,
				event,
				callback,
				time,
				uid: Utils.randomString(),
			};
		}
	}

	_cleanupInvalidEvents() {
		let now = new Date().getTime();
		let keys = Object.keys(this._pendingEvents);
		keys.forEach((index) => {
			let element = this._pendingEvents[index];
			let eventIsValid = now - element.time <= VALID_EVENT_TIME_MS;
			if (!eventIsValid) {
				delete this._pendingEvents[index];
			}
		});
	}

	_handleEventQuery(message, extension) {
		let executed = {};
		let now = new Date().getTime();
		let keys = Object.keys(this._pendingEvents);
		keys.forEach((index) => {
			let element = this._pendingEvents[index];
			let eventIsValid = now - element.time <= VALID_EVENT_TIME_MS;
			let isSameTarget =
				!element.targetSpec || this._findRegistrations(element.targetSpec).length !== 0;

			if (isSameTarget && element.targetSpec.key) {
				isSameTarget =
					element.targetSpec.addon_key === extension.extension.addon_key &&
					element.targetSpec.key === extension.extension.key;
			}

			if (eventIsValid && isSameTarget) {
				executed[index] = element;
				element.targetSpec = element.targetSpec || {};
				this.dispatch(
					element.type,
					element.targetSpec,
					element.event,
					element.callback,
					message.source,
				);
			} else if (!eventIsValid) {
				delete this._pendingEvents[index];
			}
		});

		this._registeredExtensions[extension.extension_id].registered_events = message.data.args;

		return executed;
	}

	_handleUnload(event, reg) {
		if (!reg) {
			return;
		}

		if (reg.extension_id && this._registeredExtensions[reg.extension_id]) {
			delete this._registeredExtensions[reg.extension_id].source;
		}

		if (reg.unloadCallback) {
			reg.unloadCallback(event.data.eid);
		}
	}

	dispatch(type, targetSpec, event, callback, source) {
		function sendEvent(reg, evnt) {
			if (reg.source && reg.source.postMessage) {
				var mid;
				if (callback) {
					mid = Utils.randomString();
					this._pendingCallbacks[mid] = callback;
				}

				reg.source.postMessage(
					{
						type: 'evt',
						mid: mid,
						etyp: type,
						evnt: evnt,
					},
					reg.extension.url,
				);
			}
		}

		var registrations = this._findRegistrations(targetSpec || {});
		registrations.forEach(function (reg) {
			if (source && !reg.source) {
				reg.source = source;
			}

			if (reg.source) {
				Utils._bind(this, sendEvent)(reg, event);
			}
		}, this);
	}

	_findRegistrations(targetSpec) {
		if (this._registeredExtensions.length === 0) {
			Utils.error('no registered extensions', this._registeredExtensions);
			return [];
		}
		var keys = Object.getOwnPropertyNames(targetSpec);
		var registrations = Object.getOwnPropertyNames(this._registeredExtensions).map((key) => {
			return this._registeredExtensions[key];
		});

		if (targetSpec instanceof Function) {
			return registrations.filter(targetSpec);
		} else {
			return registrations.filter(function (reg) {
				return keys.every(function (key) {
					return reg.extension[key] === targetSpec[key];
				});
			});
		}
	}

	registerExtension(extension_id, data) {
		data._proxies = {};
		data.extension_id = extension_id;
		this._registeredExtensions[extension_id] = data;
	}

	_keycodeKey(key, modifiers, extension_id) {
		var code = key;

		if (modifiers) {
			if (typeof modifiers === 'string') {
				modifiers = [modifiers];
			}
			modifiers.sort();
			modifiers.forEach((modifier) => {
				code += '$$' + modifier;
			}, this);
		}

		return code + '__' + extension_id;
	}

	registerKeyListener(extension_id, key, modifiers, callback) {
		if (typeof modifiers === 'string') {
			modifiers = [modifiers];
		}
		var reg = this._registeredExtensions[extension_id];
		var keycodeEntry = this._keycodeKey(key, modifiers, extension_id);
		if (!this._keycodeCallbacks[keycodeEntry]) {
			this._keycodeCallbacks[keycodeEntry] = [];
			reg.source.postMessage(
				{
					type: 'key_listen',
					keycode: key,
					modifiers: modifiers,
					action: 'add',
				},
				reg.extension.url,
			);
		}
		this._keycodeCallbacks[keycodeEntry].push(callback);
	}

	unregisterKeyListener(extension_id, key, modifiers, callback) {
		var keycodeEntry = this._keycodeKey(key, modifiers, extension_id);
		var potentialCallbacks = this._keycodeCallbacks[keycodeEntry];
		var reg = this._registeredExtensions[extension_id];

		if (potentialCallbacks) {
			if (callback) {
				var index = potentialCallbacks.indexOf(callback);
				this._keycodeCallbacks[keycodeEntry].splice(index, 1);
			} else {
				delete this._keycodeCallbacks[keycodeEntry];
			}
			if (reg.source && reg.source.postMessage) {
				reg.source.postMessage(
					{
						type: 'key_listen',
						keycode: key,
						modifiers: modifiers,
						action: 'remove',
					},
					reg.extension.url,
				);
			}
		}
	}

	registerClickHandler(callback) {
		if (typeof callback !== 'function') {
			throw new Error('callback must be a function');
		}
		this._clickHandlers.push(callback);
	}

	_handleAddonClick(event, reg) {
		for (var i = 0; i < this._clickHandlers.length; i++) {
			if (typeof this._clickHandlers[i] === 'function') {
				this._clickHandlers[i]({
					addon_key: reg.extension.addon_key,
					key: reg.extension.key,
					extension_id: reg.extension_id,
				});
			}
		}
	}

	unregisterClickHandler() {
		this._clickHandlers = [];
	}

	getApiSpec(addonKey) {
		function getModuleDefinition(mod) {
			return Object.getOwnPropertyNames(mod).reduce((accumulator, memberName) => {
				const member = mod[memberName];
				switch (typeof member) {
					case 'function':
						accumulator[memberName] = {
							args: Utils.argumentNames(member),
							returnsPromise: member.returnsPromise || false,
						};
						break;
					case 'object':
						if (member.hasOwnProperty('constructor')) {
							accumulator[memberName] = getModuleDefinition(member);
						}
						break;
				}

				return accumulator;
			}, {});
		}
		return Object.getOwnPropertyNames(this._registeredAPIModules).reduce(
			(accumulator, moduleName) => {
				var module = this._registeredAPIModules[moduleName];
				if (typeof module.addonKey === 'undefined' || module.addonKey === addonKey) {
					accumulator[moduleName] = getModuleDefinition(module);
				}
				return accumulator;
			},
			{},
		);
	}

	_originEqual(url, origin) {
		function strCheck(str) {
			return typeof str === 'string' && str.length > 0;
		}
		let urlOrigin = Utils.getOrigin(url);
		// check strings are strings and they contain something
		if (!strCheck(url) || !strCheck(origin) || !strCheck(urlOrigin)) {
			return false;
		}

		return origin === urlOrigin;
	}

	// validate origin of postMessage
	_checkOrigin(event, reg) {
		let no_source_types = ['init'];
		let isNoSourceType = reg && no_source_types.includes(event.data.type);
		let sourceTypeMatches = reg && event.source === reg.source;
		let hasExtensionUrl = reg && this._originEqual(reg.extension.url, event.origin);
		let isValidOrigin = hasExtensionUrl && (isNoSourceType || sourceTypeMatches);

		// get_host_offset fires before init
		if (event.data.type === 'get_host_offset' && window === window.top) {
			isValidOrigin = true;
		}

		// check undefined for chromium (Issue 395010)
		if (event.data.type === 'unload' && (sourceTypeMatches || event.source === undefined)) {
			isValidOrigin = true;
		}

		return isValidOrigin;
	}

	getRegisteredExtensions(filter) {
		if (filter) {
			return this._findRegistrations(filter);
		}
		return this._registeredExtensions;
	}

	unregisterExtension(filter) {
		let registrations = this._findRegistrations(filter);
		if (registrations.length !== 0) {
			registrations.forEach(function (registration) {
				let keys = Object.keys(this._pendingEvents);
				keys.forEach((index) => {
					let element = this._pendingEvents[index];
					let targetSpec = element.targetSpec || {};

					if (
						targetSpec.addon_key === registration.extension.addon_key &&
						targetSpec.key === registration.extension.key
					) {
						delete this._pendingEvents[index];
					}
				});

				delete this._registeredExtensions[registration.extension_id];
			}, this);
		}
	}

	setFeatureFlagGetter(getBooleanFeatureFlag) {
		this._getBooleanFeatureFlag = getBooleanFeatureFlag;
	}
}

export default XDMRPC;
