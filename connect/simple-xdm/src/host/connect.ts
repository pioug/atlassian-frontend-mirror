// @ts-nocheck
import Utils from '../common/util';

import { getPlatformFeatureFlags } from './feature-flag';
import XDMRPC from './xdmrpc';

export interface Extension {
	addon_key: string;
	key: string;
	options?: any;
	url: string;
}

export interface IframedModule {
	id: string;
	name: string;
	src: string;
}

export interface TargetSpec {
	[x: string]: any;
	addon_key?: string;
	key?: string;
}

export interface Module {
	[x: string]: any;
}

class Connect {
	constructor() {
		this._xdm = new XDMRPC();
	}

	/**
	 * Send a message to iframes matching the targetSpec. This message is added to
	 *  a message queue for delivery to ensure the message is received if an iframe
	 *  has not yet loaded
	 *
	 * @param type The name of the event type
	 * @param targetSpec The spec to match against extensions when sending this event
	 * @param event The event payload
	 * @param callback A callback to be executed when the remote iframe calls its callback
	 */
	dispatch(type: string, targetSpec: TargetSpec, event: any, callback?: Function): any {
		this._xdm.queueEvent(type, targetSpec, event, callback);
		return this.getExtensions(targetSpec);
	}

	/**
	 * Send a message to iframes matching the targetSpec immediately. This message will
	 *  only be sent to iframes that are already open, and will not be delivered if none
	 *  are currently open.
	 *
	 * @param type The name of the event type
	 * @param targetSpec The spec to match against extensions when sending this event
	 * @param event The event payload
	 */
	broadcast(type: string, targetSpec: TargetSpec, event: any): any {
		this._xdm.dispatch(type, targetSpec, event, null, null);
		return this.getExtensions(targetSpec);
	}

	_createId(extension) {
		if (!extension.addon_key || !extension.key) {
			throw Error('Extensions require addon_key and key');
		}
		return extension.addon_key + '__' + extension.key + '__' + Utils.randomString();
	}
	/**
	 * Creates a new iframed module, without actually creating the DOM element.
	 * The iframe attributes are passed to the 'setupCallback', which is responsible for creating
	 * the DOM element and returning the window reference.
	 *
	 * @param extension The extension definition. Example:
	 *   {
	 *     addon_key: 'my-addon',
	 *     key: 'my-module',
	 *     url: 'https://example.com/my-module',
	 *     options: {
	 *         autoresize: false,
	 *         hostOrigin: 'https://connect-host.example.com/'
	 *     }
	 *   }
	 *
	 * @param initCallback The optional initCallback is called when the bridge between host and iframe is established.
	 **/
	create(extension: Extension, initCallback?: Function, unloadCallback?: Function): IframedModule {
		let extension_id = this.registerExtension(extension, initCallback, unloadCallback);
		let options = extension.options || {};

		options.platformFeatureFlags = getPlatformFeatureFlags();

		let data = {
			extension_id: extension_id,
			api: this._xdm.getApiSpec(extension.addon_key),
			origin: Utils.locationOrigin(),
			options: options,
		};

		return {
			id: extension_id,
			name: JSON.stringify(data),
			src: extension.url,
		};
	}

	// This is called from ACJS
	// noinspection JSUnusedGlobalSymbols
	registerRequestNotifier(callback: Function): void {
		this._xdm.registerRequestNotifier(callback);
	}

	registerExtension(
		extension: Extension,
		initCallback: Function,
		unloadCallback: Function,
	): string {
		let extension_id = this._createId(extension);
		this._xdm.registerExtension(extension_id, {
			extension: extension,
			initCallback: initCallback,
			unloadCallback: unloadCallback,
		});
		return extension_id;
	}

	registerKeyListener(extension_id: string, key: string, modifiers: any, callback: Function): void {
		this._xdm.registerKeyListener(extension_id, key, modifiers, callback);
	}

	unregisterKeyListener(extension_id, key, modifiers, callback) {
		this._xdm.unregisterKeyListener(extension_id, key, modifiers, callback);
	}

	registerClickHandler(callback) {
		this._xdm.registerClickHandler(callback);
	}

	unregisterClickHandler() {
		this._xdm.unregisterClickHandler();
	}

	defineModule(moduleName: string, module: Module, options: any): void {
		this._xdm.defineAPIModule(module, moduleName, options);
	}

	isModuleDefined(moduleName) {
		return this._xdm.isAPIModuleDefined(moduleName);
	}

	defineGlobals(module: Module): void {
		this._xdm.defineAPIModule(module);
	}

	getExtensions(filter: any): any {
		return this._xdm.getRegisteredExtensions(filter);
	}

	unregisterExtension(filter: any): any {
		return this._xdm.unregisterExtension(filter);
	}

	returnsPromise(wrappedMethod: Function): void {
		wrappedMethod.returnsPromise = true;
	}

	setFeatureFlagGetter(getBooleanFeatureFlag) {
		this._xdm.setFeatureFlagGetter(getBooleanFeatureFlag);
	}

	registerExistingExtension(extension_id, data) {
		return this._xdm.registerExtension(extension_id, data);
	}
}

export default Connect;
