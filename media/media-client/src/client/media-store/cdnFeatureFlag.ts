import { isCDNEnabled } from '../../utils/isCDNEnabled';

export const cdnFeatureFlag: any = (endpoint: string) => {
	let result = endpoint;
	if (isCDNEnabled()) {
		result += '/cdn';
	}
	return result;
};
