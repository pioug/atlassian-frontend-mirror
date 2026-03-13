// @ts-nocheck
/**
 * Extension wide configuration values
 */
class ConfigurationOptions {
	constructor() {
		this.options = {};
	}

	_flush(): void {
		this.options = {};
	}

	get(item: any): any {
		return item ? this.options[item] : this.options;
	}

	set(data: any, value: any): void {
		if (!data) {
			return;
		}

		if (value) {
			data = { [data]: value };
		}
		var keys = Object.getOwnPropertyNames(data);
		keys.forEach((key) => {
			this.options[key] = data[key];
		}, this);
	}
}

const _default_1: ConfigurationOptions = new ConfigurationOptions();
export default _default_1;
