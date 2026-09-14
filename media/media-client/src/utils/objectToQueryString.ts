export const objectToQueryString = (json: {
	[key: string]: string | number | boolean | undefined | null;
}): string => {
	return Object.keys(json)
		.filter((attrName) => typeof json[attrName] !== 'undefined' && json[attrName] !== null)
		.map((key) => {
			const value = json[key];
			if (typeof value === 'undefined' || value === null) {
				return;
			}

			return `${encodeURIComponent(key)}=${encodeURIComponent(value.toString())}`;
		})
		.join('&');
};
