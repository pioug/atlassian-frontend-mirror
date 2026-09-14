export const setKeyValueInSessionStorage: any = (key: string, value: string | null) => {
	// eslint-disable-next-line @atlaskit/platform/no-direct-web-storage-usage -- existing usage
	if (!value || !(window && window.sessionStorage)) {
		return;
	}

	// eslint-disable-next-line @atlaskit/platform/no-direct-web-storage-usage -- existing usage
	const currentValue = window.sessionStorage.getItem(key);

	if (currentValue !== value) {
		// eslint-disable-next-line @atlaskit/platform/no-direct-web-storage-usage -- existing usage
		window.sessionStorage.setItem(key, value);
	}
};
