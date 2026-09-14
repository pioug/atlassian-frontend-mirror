import type { Ari } from '../types';
import { extractCloudIdAndProductFromSite } from './extractCloudIdAndProductFromSite';

export const getInvocationUrl = async (site: Ari, ruleId: number): Promise<string> => {
	const { product, cloudId } = extractCloudIdAndProductFromSite(site);

	return `/gateway/api/automation/public/${product}/${cloudId}/rest/v1/rule/manual/${ruleId}/invocation`;
};
