// @ts-nocheck
import Utils from '../common/util';
import Host from '../host/connect';
import Plugin from '../plugin/ap';
class Combined extends Host {
	constructor(initCheck) {
		super();
		this.parentTargets = { _globals: {} };
		var plugin = new Plugin(undefined, initCheck);
		// export options from plugin to host.
		Object.getOwnPropertyNames(plugin).forEach(function (prop) {
			if (['_hostModules', '_globals'].indexOf(prop) === -1 && this[prop] === undefined) {
				this[prop] = plugin[prop];
			}
		}, this);

		['registerAny', 'register'].forEach(function (prop) {
			this[prop] = Object.getPrototypeOf(plugin)[prop].bind(plugin);
		}, this);

		//write plugin modules to host.
		var moduleSpec = plugin._data.api;
		if (typeof moduleSpec === 'object') {
			Object.getOwnPropertyNames(moduleSpec).forEach(function (moduleName) {
				var accumulator = {};
				Object.getOwnPropertyNames(moduleSpec[moduleName]).forEach(function (methodName) {
					// class proxies
					if (moduleSpec[moduleName][methodName].hasOwnProperty('constructor')) {
						accumulator[methodName] = plugin._hostModules[moduleName][methodName].prototype;
					} else {
						// all other methods
						accumulator[methodName] = plugin._hostModules[moduleName][methodName];
						accumulator[methodName]['returnsPromise'] =
							moduleSpec[moduleName][methodName]['returnsPromise'] || false;
					}
				}, this);
				this._xdm.defineAPIModule(accumulator, moduleName);
			}, this);
		}

		this._hostModules = plugin._hostModules;

		this.defineGlobal = function (module) {
			this.parentTargets['_globals'] = Utils.extend({}, this.parentTargets['_globals'], module);
			this._xdm.defineAPIModule(module);
		};

		this.defineModule = function (moduleName, module) {
			this._xdm.defineAPIModule(module, moduleName);
			this.parentTargets[moduleName] = {};
			Object.getOwnPropertyNames(module).forEach(function (name) {
				this.parentTargets[moduleName][name] = 'parent';
			}, this);
		};

		this.subCreate = function (extensionOptions, initCallback) {
			extensionOptions.options = extensionOptions.options || {};
			extensionOptions.options.targets = Utils.extend(
				{},
				this.parentTargets,
				extensionOptions.options.targets,
			);
			var extension = this.create(extensionOptions, initCallback);
			return extension;
		};
	}
}

export default Combined;
