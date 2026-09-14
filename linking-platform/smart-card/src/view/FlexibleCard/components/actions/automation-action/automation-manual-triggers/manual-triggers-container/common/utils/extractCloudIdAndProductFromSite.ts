import type { Ari } from '../types';

/**
 * This function will extract the cloud ID and product from a product level Site ARI.
 * ARIs can be found at the following link: {@link https://developer.atlassian.com/platform/atlassian-resource-identifier/resource-owners/registry/#ari-registry}
 * @param site The Site ARI where the manual trigger rule is executed. Should be a product level Site ARI.
 */
export const extractCloudIdAndProductFromSite = (
	site: Ari,
): { cloudId: string; product: string } => {
	let cloudId;
	let resourceOwner;
	let resourceType;
	const ariRegex = new RegExp('^ari:cloud:([a-zA-Z.\\-]+)::([a-zA-Z.\\-]+)/([a-zA-Z0-9\\-]+)');
	const parsedAri = site.match(ariRegex);
	if (parsedAri) {
		resourceOwner = parsedAri[1];
		resourceType = parsedAri[2];
		cloudId = parsedAri[3];
	}
	// Keep backwards compatibility for platform site ARIs
	if (resourceOwner === 'platform') {
		resourceOwner = 'jira';
	}
	if (resourceType !== 'site' || cloudId === undefined || resourceOwner === undefined) {
		throw new Error('Not a site ARI: ' + site);
	}
	return { product: resourceOwner, cloudId: cloudId };
};
