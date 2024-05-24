import type { Ari, Environment, ProjectKey, ProjectType } from '../types';

import { getAutomationStack } from './stack-resolver';

/**
 * This function will extract the cloud ID and product from a product level Site ARI.
 * ARIs can be found at the following link: {@link https://developer.atlassian.com/platform/atlassian-resource-identifier/resource-owners/registry/#ari-registry}
 * @param site The Site ARI where the manual trigger rule is executed. Should be a product level Site ARI.
 */
export const extractCloudIdAndProductFromSite = (
  site: Ari,
): { product: string; cloudId: string } => {
  let cloudId;
  let resourceOwner;
  let resourceType;
    const ariRegex = new RegExp("^ari:cloud:([a-zA-Z.\\-]+)::([a-zA-Z.\\-]+)/([a-zA-Z0-9\\-]+)");
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
export const getSearchUrl = async (env: Environment | null, site: Ari) => {
  const { product, cloudId } = extractCloudIdAndProductFromSite(site);
  const automationStack = await getAutomationStack(env, cloudId);
  // TODO in the unified API, GET requests as according to Atlassian API standards will destructure the whole query into
  // query parameters as part of the URL. For now, this is considered a POST request instead and thus the query is used
  // later on as the request body.
  return `/gateway/api/automation/internal-api/${product}/${cloudId}/${automationStack}/rest/v1/rules/manual/search`;
};

export const getInvocationUrl = async (
  env: Environment | null,
  site: Ari,
  ruleId: number,
): Promise<string> => {
  const { product, cloudId } = extractCloudIdAndProductFromSite(site);
  const automationStack = await getAutomationStack(env, cloudId);

  return `/gateway/api/automation/internal-api/${product}/${cloudId}/${automationStack}/rest/v1/rules/manual/invocation/${ruleId}`;
};

const DEFAULT_HEADER = { 'Content-Type': 'application/json' };

const _performRequest = async (
  url: string,
  method: string,
  options: RequestInit = { headers: DEFAULT_HEADER },
): Promise<any> => {
  const response = await fetch(url, { ...options, method });
  return response.json();
};

export const performGetRequest = async (
  url: string,
  options?: RequestInit,
): Promise<any> => {
  return _performRequest(url, 'GET', options);
};

export const performPostRequest = async (
  url: string,
  options?: RequestInit,
): Promise<any> => {
  return _performRequest(url, 'POST', options);
};

// TODO this will need to be expanded to resolve the correct product URL, too.
// TODO for instance this will need to support Alerts UI URL resolution in the
// TODO short term
export const getBaseAutomationUrl = ({
  projectKey,
  projectType,
  isSimplified,
}: {
  isSimplified: boolean;
  projectType: ProjectType | undefined;
  projectKey: ProjectKey;
}): string => {
  /**
   * Confusing mapping of urls here.
   * Classic Projects - always under /automate
   * Next Gen Projects - under /automation for all project types except JSD
   */
  switch (projectType) {
    case 'service_desk':
      return `/jira/servicedesk/projects/${projectKey}/settings/automate`;
    case 'business':
      return `/jira/core/projects/${projectKey}/settings/${
        isSimplified ? 'automation' : 'automate'
      }`;
    default:
      return `/jira/software/${
        isSimplified ? '' : 'c/'
      }projects/${projectKey}/settings/${
        isSimplified ? 'automation' : 'automate'
      }`;
  }
};
