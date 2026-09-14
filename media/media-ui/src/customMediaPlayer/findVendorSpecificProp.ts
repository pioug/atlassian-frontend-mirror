const capitalize = (text: string): string => text.charAt(0).toUpperCase() + text.slice(1);

const browserPrefixes = ['', 'moz', 'webkit', 'ms'];

export const findVendorSpecificProp = (object: any, propNames: string | string[]): any => {
	if (!Array.isArray(propNames)) {
		propNames = [propNames];
	}
	for (let i = 0; i < propNames.length; i++) {
		for (let j = 0; j < browserPrefixes.length; j++) {
			const propName = browserPrefixes[j] + propNames[i];
			if (object[propName]) {
				return propName;
			}
			const capPropName = browserPrefixes[j] + capitalize(propNames[i]);
			if (object[capPropName]) {
				return capPropName;
			}
		}
	}
};
