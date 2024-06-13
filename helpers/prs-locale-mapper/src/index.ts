/**
 * This function is being used to address locale discrepancies in Atlassian products;
 * see: https://hello.atlassian.net/wiki/spaces/i18n/pages/528623554/Locale+Discrepancies+Across+Atlassian+Products+and+Platform+Areas
 */
export const mapLocaleToPrsLocale = (locale: string): string => {
	const standardizedLocale = locale.replace('_', '-');
	switch (standardizedLocale) {
		case 'en-GB':
		case 'en-US':
		case 'en-XA':
		case 'en-XB':
		case 'en-ZZ':
		case 'pt-BR':
		case 'zh-CN':
		case 'zh-TW':
			return standardizedLocale;
		case 'en-UK':
			return 'en-GB';
		case 'en':
			return 'en-US';
		default:
			return standardizedLocale.split('-')[0];
	}
};

export default mapLocaleToPrsLocale;
