export const getValueFromSessionStorage = (key: string): string | undefined => {
	// eslint-disable-next-line @atlaskit/platform/no-direct-web-storage-usage -- existing usage
	return (window && window.sessionStorage && window.sessionStorage.getItem(key)) || undefined;
};
