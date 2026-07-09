// window.localStorage is easier to mock in tests if wrapped in this module
export const getLocalMediaFeatureFlag = (key: string): string | null => {
	try {
		// eslint-disable-next-line @atlaskit/platform/no-direct-web-storage-usage -- existing usage
		return typeof window !== 'undefined' && window.localStorage
			? // eslint-disable-next-line @atlaskit/platform/no-direct-web-storage-usage -- existing usage
				window.localStorage.getItem(key)
			: null;
	} catch (e) {
		// do nothing, return null by default
	}
	return null;
};
