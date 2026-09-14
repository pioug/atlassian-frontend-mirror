export const checkAndConvertToAbsoluteUrl = (url: string, siteUrl?: string): string => {
	if (!url) {
		return '';
	}

	if (/^data:(.*)/.test(url) || /^http(.*)/.test(url) || !siteUrl) {
		return url;
	}

	return `${siteUrl}${url}`;
};
