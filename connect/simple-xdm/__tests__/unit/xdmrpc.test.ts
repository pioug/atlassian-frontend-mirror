// @ts-nocheck
import Utils from '../../src/common/util';
import XDMRPC from '../../src/host/xdmrpc';

describe('XDMRPC', () => {
	describe('origin checks', () => {
		it('checks for a valid origin', function () {
			var instance = new XDMRPC(),
				origin = 'https://www.example.com',
				check = instance._checkOrigin(
					{
						source: {},
						data: {
							type: 'init',
						},
						origin: origin,
					},
					{
						extension: {
							url: origin,
						},
					},
				);
			expect(check).toBe(true);
		});

		it('checks for a valid origin for longer extension url', function () {
			let instance = new XDMRPC(),
				origin = 'https://www.example.com',
				check = instance._checkOrigin(
					{
						source: {},
						data: {
							type: 'init',
						},
						origin: origin,
					},
					{
						extension: {
							url: origin + '/index.html',
						},
					},
				);
			expect(check).toBe(true);
		});

		it('does not validate partial domains', () => {
			let instance = new XDMRPC(),
				origin = 'https://www.example.com',
				check = instance._checkOrigin(
					{
						source: {},
						data: {
							type: 'init',
						},
						origin: origin,
					},
					{
						extension: {
							url: 'https://www.example.com.au',
						},
					},
				);
			expect(check).toBe(false);
		});

		it('does not validate partial domains for longer urls', () => {
			let instance = new XDMRPC(),
				origin = 'https://www.example.com',
				check = instance._checkOrigin(
					{
						source: {},
						data: {
							type: 'init',
						},
						origin: origin,
					},
					{
						extension: {
							url: 'https://www.example.com.au/index.html',
						},
					},
				);
			expect(check).toBe(false);
		});

		it('validates domains with port numbers', () => {
			let instance = new XDMRPC(),
				origin = 'http://www.example.com:81',
				check = instance._checkOrigin(
					{
						source: {},
						data: {
							type: 'init',
						},
						origin: origin,
					},
					{
						extension: {
							url: 'http://www.example.com:81/index.html',
						},
					},
				);
			expect(check).toBe(true);
		});

		it('validates failure domains with port numbers', () => {
			let instance = new XDMRPC(),
				origin = 'https://www.example.com:443',
				check = instance._checkOrigin(
					{
						source: {},
						data: {
							type: 'init',
						},
						origin: origin,
					},
					{
						extension: {
							url: 'http://www.example.com/index.html',
						},
					},
				);
			expect(check).toBe(false);
		});

		describe('click handler', () => {
			let instance,
				target_spec = {
					addon_key: 'some-key',
					key: 'module-key',
				},
				reg = {
					extension: target_spec,
					extension_id: `${target_spec.addon_key}__${target_spec.key}`,
				};

			beforeEach(() => {
				instance = new XDMRPC();
			});

			it('registerClickHandler registers a callback for clicks in iframe', () => {
				var callback = jest.fn();

				instance.registerClickHandler(callback);
				expect(instance._clickHandlers).toContain(callback);
				instance._handleAddonClick(null, reg);
				expect(callback).toHaveBeenCalled();
				expect(callback.mock.calls[callback.mock.calls.length - 1][0]).toEqual({
					addon_key: reg.extension.addon_key,
					key: reg.extension.key,
					extension_id: reg.extension_id,
				});
			});

			it('registerClickHandler throws if callback is not a function', () => {
				expect(() => {
					instance.registerClickHandler(undefined);
				}).toThrow();
			});
		});

		describe('keycode callbacks', () => {
			var key = 27,
				instance,
				target_spec = {
					addon_key: 'some-key',
					key: 'module-key',
				},
				extension_id = `${target_spec.addon_key}__${target_spec.key}`;

			beforeEach(() => {
				instance = new XDMRPC();
				instance.registerExtension(extension_id, {
					extension: target_spec,
					//mock source
					source: {
						location: {
							href: function () {},
						},
						postMessage: function () {},
					},
				});
			});

			afterEach(() => {
				instance.unregisterExtension(target_spec);
			});

			it('registerKeyListener registers a callback for a keycode', () => {
				var callback = jest.fn();
				var keycode = instance._keycodeKey(key, false, extension_id);

				instance.registerKeyListener(extension_id, key, undefined, callback);

				expect(instance._keycodeCallbacks[keycode]).toContain(callback);
			});

			it('unregisterKeyListener removes all registrations when not supplied a callback', () => {
				var callback = jest.fn();
				var callback2 = jest.fn();
				var keycode = instance._keycodeKey(key, false, extension_id);

				instance.registerKeyListener(extension_id, key, undefined, callback);
				instance.registerKeyListener(extension_id, key, undefined, callback2);
				instance.unregisterKeyListener(extension_id, key);
				expect(instance._keycodeCallbacks[keycode]).toBe(undefined);
			});

			it('unregisterKeyListener removes all registrations for a specific keycie when supplied', () => {
				var callback = jest.fn();
				var callback2 = jest.fn();
				var keycode = instance._keycodeKey(key, false, extension_id);
				instance.registerKeyListener(extension_id, key, undefined, callback);
				instance.registerKeyListener(extension_id, key, undefined, callback2);
				instance.unregisterKeyListener(extension_id, key, undefined, callback);
				expect(instance._keycodeCallbacks[keycode]).toEqual([callback2]);
			});

			it('_handleKeyListen triggers the callback', () => {
				var callback = jest.fn();
				instance.registerKeyListener(extension_id, key, undefined, callback);
				var event = {
					data: { keycode: key },
				};
				var extension = instance._findRegistrations(target_spec)[0];
				expect(callback).not.toHaveBeenCalled();
				instance._handleKeyTriggered(event, extension);
				expect(callback).toHaveBeenCalled();
			});
		});

		describe('broadcast handling', function () {
			var instance, target_spec, extension_id, extensions;

			function register(name, postMessage = function () {}) {
				target_spec = {
					addon_key: name,
					key: `module-${extensions++}`,
				};

				extension_id = `${target_spec.addon_key}__${target_spec.key}`;
				instance.registerExtension(extension_id, {
					extension: target_spec,
				});

				var exension = {
					extension: {
						addon_key: target_spec.addon_key,
						key: target_spec.key,
						extension_id: extension_id,
					},
					extension_id: extension_id,
				};

				instance._handleInit(
					{
						source: {
							postMessage: (message) => {
								if (message.type !== 'init_received') {
									postMessage(message);
								}
							},
						},
						data: {},
					},
					exension,
				);

				return exension;
			}

			beforeEach(function () {
				instance = new XDMRPC();
				extensions = 0;
			});

			it('should fire an event to iframes in same domain', function () {
				var dispatchOne = jest.fn();
				var dispatchTwo = jest.fn();

				let dispatcher = register('plugin-a', dispatchOne);
				register('plugin-a', dispatchTwo);

				instance._handleBroadcast({ data: { etyp: 'manual' } }, dispatcher);

				expect(dispatchTwo).toHaveBeenCalled();
				expect(dispatchOne).not.toHaveBeenCalled();
			});

			it('should fire an event to iframes in same domain', function () {
				var dispatchOne = jest.fn();
				var dispatchTwo = jest.fn();
				var dispatchThree = jest.fn();

				let dispatcher = register('plugin-a', dispatchOne);
				register('plugin-a', dispatchTwo);
				register('plugin-b', dispatchThree);

				instance._handleBroadcast({ data: { etyp: 'manual' } }, dispatcher);

				expect(dispatchTwo).toHaveBeenCalled();
				expect(dispatchOne).not.toHaveBeenCalled();
				expect(dispatchThree).not.toHaveBeenCalled();
			});
		});

		describe('module definitions', function () {
			const moduleName = 'someModule';
			const className = 'SomeClass';
			const methodName = 'SomeMethod';
			const args = ['foo', 'bar'];
			const target_spec = {
				addon_key: 'some-key',
				key: 'module-key',
			};
			const extension_id = `${target_spec.addon_key}__${target_spec.key}`;
			let instance;

			function funcWithArgs(args) {
				if (!Array.isArray(args)) {
					args = [args];
				}
				// eslint-disable-next-line no-new-func
				return Function.apply(null, args.concat(''));
			}

			beforeEach(function () {
				instance = new XDMRPC();
				instance.registerExtension(extension_id, {
					extension: target_spec,
				});
			});

			afterEach(() => {
				instance.unregisterExtension(target_spec);
			});

			it('sending fewer than the required number of args should pad them', function () {
				const module = {};
				//cannot use a sinon.spy as it overwrites the function.length
				module['onearg'] = function (a, b, c, callback) {
					expect(Array.prototype.slice.call(arguments)).toEqual([
						'a',
						undefined,
						undefined,
						expect.any(Function),
					]);
					expect(arguments.length).toEqual(4);
				};
				module['noargs'] = function (a, b, c, callback) {
					expect(Array.prototype.slice.call(arguments)).toEqual([
						undefined,
						undefined,
						undefined,
						expect.any(Function),
					]);
					expect(arguments.length).toEqual(4);
				};
				module['allargs'] = function (a, b, c, callback) {
					expect(Array.prototype.slice.call(arguments)).toEqual([a, b, c, expect.any(Function)]);
					expect(arguments.length).toEqual(4);
				};
				function test(methodName, args) {
					instance.defineAPIModule(module, moduleName);
					instance._handleRequest(
						{
							data: {
								type: 'req',
								mod: moduleName,
								fn: methodName,
								args: args,
							},
						},
						{
							extension: target_spec,
						},
					);
				}
				test('onearg', ['a']);
				test('noargs', []);
				test('allargs', ['a', 'b', 'c']);
			});

			it('registering global APIs should not create undefined module', function () {
				const module = {};
				module[methodName] = function () {};
				// global module
				instance.defineAPIModule(module);
				// named module
				instance.defineAPIModule(module, moduleName);
				let APISpec = instance.getApiSpec();
				expect(APISpec._globals[methodName]).toBeDefined();
				expect(APISpec[moduleName][methodName]).toBeDefined();
				expect(APISpec.undefined).toBeUndefined();
			});

			it('modules metadata should contain API method signatures', function () {
				const module = {};
				module[methodName] = funcWithArgs(args);
				instance.defineAPIModule(module, moduleName);
				let APISpec = instance.getApiSpec();
				expect(APISpec[moduleName][methodName].args).toEqual(args);
			});

			it('can check if module is defined', function () {
				const module = {};
				expect(instance.isAPIModuleDefined(moduleName)).toBe(false);
				instance.defineAPIModule(module, moduleName);
				expect(instance.isAPIModuleDefined(moduleName)).toBe(true);
			});

			it('modules can be defined for single addon', function () {
				const module = {};
				const addonKey = Utils.randomString();
				module[methodName] = funcWithArgs(args);
				module.addonKey = addonKey;
				instance.defineAPIModule(module, moduleName);
				let APISpec = instance.getApiSpec();
				expect(APISpec[moduleName]).toBeUndefined();
				APISpec = instance.getApiSpec(addonKey);
				expect(APISpec[moduleName][methodName].args).toEqual(args);
			});

			it('modules can contain classes', function () {
				const module = {};
				module[className] = {
					constructor: funcWithArgs(args),
				};
				instance.defineAPIModule(module, moduleName);
				let APISpec = instance.getApiSpec();
				expect(APISpec[moduleName][className].constructor.args).toEqual(args);
			});

			it('class instance can be constructed by proxy', function () {
				const module = {};
				module[className] = {
					constructor: funcWithArgs(args),
				};
				instance.defineAPIModule(module, moduleName);
				let _id = Utils.randomString();
				instance._handleRequest(
					{
						data: {
							type: 'req',
							mod: moduleName,
							fn: 'constructor',
							args: args,
							_cls: className,
							_id: _id,
						},
					},
					{
						extension: target_spec,
					},
				);
				expect(
					instance._registeredExtensions[extension_id]._proxies[
						moduleName + '-' + className + '-' + _id
					] instanceof module[className].constructor,
				).toBeTruthy();
			});
		});

		describe('event dispatch handling', function () {
			var instance,
				target_spec,
				target_spec2,
				target_spec3,
				target_spec4,
				extension_id,
				extension_id2,
				extension_id3,
				common_addon_key;

			beforeEach(function () {
				instance = new XDMRPC();
				target_spec = {
					addon_key: 'some-key',
					key: 'module-key',
				};

				common_addon_key = 'some-common-key';

				target_spec2 = {
					addon_key: common_addon_key,
					key: 'another-module-key',
				};
				target_spec3 = {
					addon_key: common_addon_key,
					key: 'another-another-module-key',
				};
				target_spec4 = {
					addon_key: common_addon_key,
				};

				extension_id = `${target_spec.addon_key}__${target_spec.key}`;
				extension_id2 = `${target_spec2.addon_key}__${target_spec2.key}`;
				extension_id3 = `${target_spec3.addon_key}__${target_spec3.key}`;
				instance.registerExtension(extension_id, {
					extension: target_spec,
				});
			});

			it('dispatches an event if there are active frames', function () {
				instance._registeredExtensions[extension_id].registered_events = {};

				jest.spyOn(instance, 'dispatch').mockImplementation(() => {});
				instance.queueEvent('some-event', target_spec, {});
				expect(instance.dispatch).toHaveBeenCalled();
			});

			it('queues the event if no frames are found', function () {
				var baseTime = new Date(2013, 9, 23);
				jest.useFakeTimers();
				jest.setSystemTime(baseTime);
				var event_type = 'some-event',
					pending;
				jest.spyOn(instance, 'dispatch').mockImplementation(() => {});
				instance.queueEvent(event_type, target_spec, {});
				pending =
					instance._pendingEvents[instance._pendingEventKey(target_spec, baseTime.getTime())];
				expect(instance.dispatch).not.toHaveBeenCalled();
				expect(pending).toEqual(expect.any(Object));
				expect(pending.type).toEqual(event_type);
				jest.useRealTimers();
			});

			it('cleanup events if no frames are found', function () {
				var event_type = 'some-event',
					pending;
				jest.spyOn(instance, '_cleanupInvalidEvents').mockImplementation(() => {});
				jest.spyOn(instance, 'dispatch').mockImplementation(() => {});
				instance.queueEvent(event_type, target_spec, {});
				pending = instance._pendingEvents[instance._pendingEventKey(target_spec, 'test')];
				expect(instance.dispatch).not.toHaveBeenCalled();
				expect(instance._cleanupInvalidEvents).toHaveBeenCalledWith();
			});

			it('should only fire pending events from same addon', function () {
				instance.unregisterExtension(target_spec);
				instance.registerExtension(extension_id2, { extension: target_spec2 });

				let reg = instance._registeredExtensions[extension_id2];
				let message = { source: null, data: { args: [] } };

				jest.spyOn(instance, 'dispatch').mockImplementation(() => {});
				instance.queueEvent('some-event', target_spec, {});
				instance.queueEvent('some-other-event', target_spec2, {});
				instance._handleEventQuery(message, reg);

				expect(instance.dispatch.mock.calls.length).toBe(1);
				expect(instance.dispatch.mock.calls[0][0]).toContain('some-other-event');
			});

			it('should only fire pending events for targetted extension key', function () {
				instance.unregisterExtension(target_spec);
				instance.registerExtension(extension_id2, { extension: target_spec2 });
				instance.registerExtension(extension_id3, { extension: target_spec3 });

				let reg = instance._registeredExtensions[extension_id2];
				let message = { source: null, data: { args: [] } };

				jest.spyOn(instance, 'dispatch').mockImplementation(() => {});
				instance.queueEvent('some-event-1', target_spec, {});
				instance.queueEvent('some-event-2', target_spec2, {});
				instance.queueEvent('some-event-3', target_spec3, {});
				instance._handleEventQuery(message, reg);

				expect(instance.dispatch.mock.calls.length).toBe(1);
				expect(instance.dispatch.mock.calls[0][0]).toContain('some-event-2');
			});

			it('should not fire pending events if not the targetted extension', function () {
				instance.unregisterExtension(target_spec);
				instance.registerExtension(extension_id2, { extension: target_spec2 });

				let reg = instance._registeredExtensions[extension_id2];
				let message = { source: null, data: { args: [] } };

				jest.spyOn(instance, 'dispatch').mockImplementation(() => {});
				instance.queueEvent('some-event-3', target_spec3, {});
				instance._handleEventQuery(message, reg);

				expect(instance.dispatch.mock.calls.length).toBe(0);
			});

			it('should fire the event for all frames of the same add-on if target spec only has addon_key', function () {
				instance.unregisterExtension(target_spec);
				instance.registerExtension(extension_id2, { extension: target_spec2 });
				instance.registerExtension(extension_id3, { extension: target_spec3 });

				let reg2 = instance._registeredExtensions[extension_id2];
				let reg3 = instance._registeredExtensions[extension_id3];
				let message = { source: null, data: { args: [] } };

				jest.spyOn(instance, 'dispatch').mockImplementation(() => {});
				instance.queueEvent('some-event-3', target_spec4, {});
				instance._handleEventQuery(message, reg2);
				instance._handleEventQuery(message, reg3);

				expect(instance.dispatch.mock.calls.length).toBe(2);
				expect(instance.dispatch.mock.calls[0][0]).toContain('some-event-3');
			});

			it('should not fire event without a source', function () {
				jest.spyOn(Utils, '_bind');
				instance.dispatch('some-event', target_spec, {}, null, null);
				expect(Utils._bind).not.toHaveBeenCalled();
			});

			it('should fire event that has a source', function () {
				let source = { postMessage: () => {} };
				jest.spyOn(source, 'postMessage').mockImplementation(() => {});

				instance.dispatch('some-event', target_spec, {}, null, source);
				expect(source.postMessage).toHaveBeenCalled();
			});
		});
	});
	it('registering multiple global APIs should merge them', function () {
		const instance = new XDMRPC();
		const module1 = {};
		const module2 = {};
		const randomFirstMethodName = Utils.randomString();
		const randomSecondMethodName = Utils.randomString();
		module1[randomFirstMethodName] = function () {};
		module2[randomSecondMethodName] = function () {};
		instance.defineAPIModule(module1);
		instance.defineAPIModule(module2);
		let APISpec = instance.getApiSpec();
		expect(APISpec._globals[randomFirstMethodName]).toBeDefined();
		expect(APISpec._globals[randomSecondMethodName]).toBeDefined();
	});

	describe('_handleUnload', function () {
		it('should not delete registered extension if reg is undefined', function () {
			const instance = new XDMRPC();
			const id = 'test';
			instance._registeredExtensions[id] = { source: 'some source' };
			instance._handleUnload({}, undefined);
			expect(instance._registeredExtensions[id].source).toBeDefined();
		});

		it('should delete registered extension if reg is defined', function () {
			const instance = new XDMRPC();
			const id = 'test';
			instance._registeredExtensions[id] = { source: 'some source' };
			instance._handleUnload({}, { extension_id: id });
			expect(instance._registeredExtensions[id].source).not.toBeDefined();
		});

		it('should not throw an error when registeredExtension is already deleted', function () {
			const instance = new XDMRPC();
			instance._registeredExtensions = {};
			const id = 'test';
			expect(() => {
				instance._handleUnload({}, { extension_id: id });
			}).not.toThrow();
		});
	});

	describe('_cleanupInvalidEvents', function () {
		var baseTime = new Date(2013, 9, 23);

		beforeEach(() => {
			jest.useFakeTimers();
			jest.setSystemTime(baseTime);
		});

		afterEach(() => {
			jest.useRealTimers();
		});

		it('should cleanup invalid events', function () {
			const instance = new XDMRPC();
			const id = 'test';
			instance._pendingEvents = {
				key1: {
					time: baseTime.getTime() - 40000,
				},
				key2: {
					time: baseTime.getTime() - 31000,
				},
				key3: {
					time: baseTime.getTime() - 29000,
				},
			};
			instance._cleanupInvalidEvents();
			expect(Object.keys(instance._pendingEvents)).toEqual(['key3']);
		});
	});

	describe('_hasSameOrigin', function () {
		it('should return true if current window = top', function () {
			const instance = new XDMRPC();
			const window = {};
			window.top = window;
			expect(instance._hasSameOrigin(window)).toBeTruthy();
		});

		it('should return false if given window object is read only', function () {
			const instance = new XDMRPC();
			const window = Object.freeze({});
			expect(instance._hasSameOrigin(window)).toBeFalsy();
		});
	});

	describe('_getHostOffset', function () {
		it('should call override when window = top', function () {
			const instance = new XDMRPC();
			const event = {
				source: {
					postMessage: jest.fn(),
				},
			};
			const window = { getHostOffsetFunctionOverride: jest.fn(() => 100) };
			window.top = window;
			instance._getHostOffset(event, window);
			expect(window.getHostOffsetFunctionOverride).toHaveBeenCalled();
			expect(event.source.postMessage).toHaveBeenCalled();
			expect(
				event.source.postMessage.mock.calls[event.source.postMessage.mock.calls.length - 1][0]
					.hostFrameOffset,
			).toBe(100);
		});

		it('should not call override when window != top', function () {
			const instance = new XDMRPC();
			const event = {
				source: {
					postMessage: jest.fn(),
				},
			};
			const window = { getHostOffsetFunctionOverride: jest.fn(() => 100) };
			instance._getHostOffset(event, window);
			expect(window.getHostOffsetFunctionOverride).not.toHaveBeenCalled();
			expect(event.source.postMessage).toHaveBeenCalled();
		});

		it('should fallback to default if getHostOffsetFunctionOverride return non-number', function () {
			const instance = new XDMRPC();

			const parentParentParent = {};
			const parentParent = Object.freeze({ parent: parentParentParent });
			const parent = Object.freeze({ parent: parentParent });
			const source = Object.freeze({ parent, postMessage: jest.fn() });
			const topWindow = { getHostOffsetFunctionOverride: jest.fn(() => false) };
			topWindow.top = topWindow;
			const event = { source };

			instance._getHostOffset(event, topWindow);
			expect(topWindow.getHostOffsetFunctionOverride).toHaveBeenCalled();
			expect(event.source.postMessage).toHaveBeenCalled();
			expect(
				event.source.postMessage.mock.calls[event.source.postMessage.mock.calls.length - 1][0]
					.hostFrameOffset,
			).toBe(3);
		});
	});

	describe('promises', () => {
		const target_spec = {
				addon_key: 'some-key',
				key: 'module-key',
			},
			extension_id = `${target_spec.addon_key}__${target_spec.key}`,
			data = {
				type: 'req',
				mod: 'promiseModule',
				fn: 'testMethod',
				args: [],
			};

		it('should return an error through postMessage if module does not return a promise', function () {
			const testMethodSpy = jest.fn();
			testMethodSpy.returnsPromise = true;

			const postMessageSpy = jest.fn();
			const instance = new XDMRPC();

			instance.defineAPIModule(
				{
					testMethod: testMethodSpy,
				},
				'promiseModule',
			);

			instance._handleRequest(
				{
					data: data,
					source: {
						postMessage: postMessageSpy,
					},
				},
				{
					extension: target_spec,
				},
			);

			expect(testMethodSpy).toHaveBeenCalled();
			expect(postMessageSpy).toHaveBeenCalled();

			const postMessageArgs = postMessageSpy.mock.calls[0];
			const error = postMessageArgs[0];
			const result = postMessageArgs[1];
			expect(error).toBeTruthy();
			expect(result).toBeUndefined();
		});

		it('should return promise result through postMessage on resolved promise', () => {
			const expectedResult = 'salty mcsalt face';
			const testMethodSpy = jest.fn(() => Promise.resolve(expectedResult));
			testMethodSpy.returnsPromise = true;

			const postMessageSpy = jest.fn((callArgs) => {
				const error = callArgs.args[0];
				const result = callArgs.args[1];
				expect(error).toBeFalsy();
				expect(result).toEqual(expectedResult);
			});
			const instance = new XDMRPC();

			instance.defineAPIModule(
				{
					testMethod: testMethodSpy,
				},
				'promiseModule',
			);

			instance._handleRequest(
				{
					data: data,
					source: {
						postMessage: postMessageSpy,
					},
				},
				{
					extension: target_spec,
				},
			);

			expect(testMethodSpy).toHaveBeenCalled();
		});

		it('should return promise error through postMessage on rejected promise', () => {
			const rejectionReason = 'not good enough';
			const testMethodSpy = jest.fn(() => Promise.reject(rejectionReason));
			testMethodSpy.returnsPromise = true;

			const postMessageSpy = jest.fn((callArgs) => {
				const error = callArgs.args[0];
				const result = callArgs.args[1];
				expect(error).toEqual(rejectionReason);
				expect(result).toBeUndefined();
			});
			const instance = new XDMRPC();

			instance.defineAPIModule(
				{
					testMethod: testMethodSpy,
				},
				'promiseModule',
			);

			instance._handleRequest(
				{
					data: data,
					source: {
						postMessage: postMessageSpy,
					},
				},
				{
					extension: target_spec,
				},
			);

			expect(testMethodSpy).toHaveBeenCalled();
		});
	});

	describe('unregisterExtension', function () {
		it('should remove pending events for related registration', function () {
			const instance = new XDMRPC();
			instance._pendingEvents = {
				'@test1': {
					targetSpec: {
						addon_key: 'addon_key1',
						key: 'key1',
					},
				},
				'@test2': {
					targetSpec: {
						addon_key: 'addon_key2',
						key: 'key2',
					},
				},
				'@test3': {
					targetSpec: {
						addon_key: 'addon_key3',
						key: 'key3',
					},
				},
				'@test4': {
					targetSpec: {
						addon_key: 'addon_key3',
						key: 'key4',
					},
				},
			};
			jest.spyOn(instance, '_findRegistrations').mockReturnValue([
				{
					extension: {
						addon_key: 'addon_key2',
						key: 'key2',
					},
				},
				{
					extension: {
						addon_key: 'addon_key3',
						key: 'key4',
					},
				},
			]);
			instance.unregisterExtension();
			expect(instance._pendingEvents).toEqual({
				'@test1': {
					targetSpec: {
						addon_key: 'addon_key1',
						key: 'key1',
					},
				},
				'@test3': {
					targetSpec: {
						addon_key: 'addon_key3',
						key: 'key3',
					},
				},
			});
		});
	});
});
