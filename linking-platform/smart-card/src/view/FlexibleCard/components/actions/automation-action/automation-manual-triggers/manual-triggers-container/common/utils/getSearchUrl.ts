import type { Ari } from '../types';
import { extractCloudIdAndProductFromSite } from './extractCloudIdAndProductFromSite';

/***
 * TODO remove when unified public API is available.
 *
 * Currently we're in a transitory phase where we have one API for invocation for Jira, and one for JSM. They concern themselves
 * with issues and alerts respectively.
 *
 * We are working on a unified public API that only cares about product-agnostic filters like object, workspace, container as
 * part of the collaboration model. For the meantime, you'll see two APIs instead. In this package, we're only using the
 * alerts API. It is this API that will be expanded to retroactively support Jira, and thus the updated collaboration
 * model language is used here, even though for the meantime we only concern ourselves with alerts.
 *
 */
export const getSearchUrl = async (site: Ari): Promise<string> => {
	const { product, cloudId } = extractCloudIdAndProductFromSite(site);
	// TODO in the unified API, GET requests as according to Atlassian API standards will destructure the whole query into
	// query parameters as part of the URL. For now, this is considered a POST request instead and thus the query is used
	// later on as the request body.
	return `/gateway/api/automation/public/${product}/${cloudId}/rest/v1/rule/manual/search`;
};
