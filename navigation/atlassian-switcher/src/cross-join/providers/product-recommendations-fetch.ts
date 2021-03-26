import {
  JoinableProductDetails,
  JoinableSite,
  JoinableSitesResponse,
  JoinableSiteUser,
  ProductKey,
  ProductRecommendationsResponse,
} from '../../types';
import { enrichFetchError } from '../../common/utils/fetch';

/* Joinable Sites API was replaced by Product Recommendations API as part of productionizing the Joinable Sites
   experimental API. This code maps Product Recommendations API results into Joinable Sites API results for
   compatibility with existing UI elements.
 */

/* We are supporting services supplying this endpoint: id-invidations for Trello aa-mastered users and
 * experiment-api for Trello non-aa-masterered users. The consuming component supplies the base url for
 * the service based on local context.
 *
 * We expect to drop support for Trello non-aa-mastered users in FY22. At this point we expect to define the
 * sole service host here.
 */
const productRecommendationsUrl = (baseUrl: string): string => {
  return (
    baseUrl +
    '/v1/product-recommendations' +
    // Query parameters are optional filters. All results are returned by default.
    '?capability=DIRECT_ACCESS' +
    // Subsequent conditions are prefaced with '&'
    // i.e. + '&product=confluence'
    '&product=jira-software&product=jira-servicedesk&product=jira-core&product=confluence'
  );
};

type ARI = {
  // Always 'ari' for valid ARI
  uriScheme: string;
  // Always 'cloud' for valid ARI
  cloud: string;
  resourceOwner: string;
  resourceType: string;
  // If 'resource_type == 'site Then 'resource_id' == 'siteId' (aka cloudId)
  resourceId: string;
  // cloudId aka siteId, mainly for Confluence and Jira resources.
  cloudId?: string;
};

// tenantedProducts and nonTenantedProducts used to identify which ARIs contain cloudId
// Also used to convert resourceOwner strings to JoinableSites product strings
// ARI resource-owners whose resource-type == 'site' do set resource-id to {cloudId}
// See https://developer.atlassian.com/platform/atlassian-resource-identifier/resource-owners/registry/
const tenantedProducts: { [key: string]: string } = {
  confluence: ProductKey.CONFLUENCE,
  // 'jira': ???, // 'jira' is a valid tenanted ARI, but it is not used downstream and its presence may cause a bug
  'jira-core': ProductKey.JIRA_CORE,
  'jira-servicedesk': ProductKey.JIRA_SERVICE_DESK,
  'jira-software': ProductKey.JIRA_SOFTWARE,
  opsgenie: ProductKey.OPSGENIE,
  // 'platform': ???, // 'platform' is a valid tenanted ARI, but it is not used downstream and its presence may cause a bug
  statuspage: ProductKey.STATUSPAGE,
};

// The ARI resource-owners whose resource-type == 'site' do NOT set resource-id to {cloudId} (typically set to a constant
// string of their resource-owner name, e.g. resource-owner is Trello, then resource-id is 'trello')
/* Not used, commented to avoid linting error
const nonTenantedProducts: {[key: string]: string}  = {
  'bitbucket': ProductKey.BITBUCKET,
  'trello': ProductKey.TRELLO,
}
*/

const convertProductRecommendationsResponseToJoinableSitesResponse = (
  input: ProductRecommendationsResponse,
): JoinableSitesResponse => {
  /*
    JoinableSitesResponse shape
    {
      sites: [
        {
          // JoinableSites type
          cloudId: string
          url: string
          displayName: string
          avatarUrl?: string
          relevance?: string
          // At least one of: 'products', 'users'. We always use 'products' here.
          products: // Undefined OR Array of JoinableProductDetails OR array array of string. We always use Array of JoinableProductDetails here.
            [
              collaborators: [ // Collaborators is empty. Neither Joinable-Sites(old) or Product-Recommendations(new) can supply them
                avatarUrl: string;
                displayName: string;
                relevance?: number;
              ];
              productUrl: string;
            ]
            // OR
            [
              string[]
            ]
          users: [
            avatarUrl: string;
            displayName: string;
            relevance?: number;
          ]
        }
      ]
    }
   */

  /* Intermediate representation for holding parsed input data. As we are only returning results for tenanted products,
   * this uses cloudId as the key. Associative array used since order of cloudIds is unknown. product-recommendations
   * returns a (flat) list of all products for possibly many cloudIds, both of which are encoded in the ARI. This
   * unflattens the list, sorting the products by the cloudId as required by the JoinableSitesResponse data structure.
   */
  const sites: { [key: string]: JoinableSite } = {};

  input.capability.DIRECT_ACCESS.forEach((inputResource, index) => {
    const ari: ARI = parseAri(inputResource.resourceId);

    if (tenantedProducts[ari.resourceOwner] && ari.resourceType === 'site') {
      if (ari.resourceId in sites) {
        // Update this site with the new product
        // @ts-ignore Initializer branch assumes products is an array of JoinableProductDetails
        sites[ari.resourceId].products[tenantedProducts[ari.resourceOwner]] = <
          JoinableProductDetails
        >{
          collaborators: <JoinableSiteUser[]>[],
          productUrl: inputResource.url,
        };
      } else {
        // Add site with this product
        const url = new URL(inputResource.url);

        const products: { [key: string]: JoinableProductDetails } = {};
        products[tenantedProducts[ari.resourceOwner]] = {
          collaborators: <JoinableSiteUser[]>[], // product-recommendations cannot provide collaborators. Collaborators are not used as of 2021 Jan
          productUrl: inputResource.url,
        };

        sites[ari.resourceId] = {
          cloudId: ari.resourceId,
          url: url.origin,
          displayName: inputResource.displayName,
          products: products,
          relevance: Math.max(1000 - index, 0),
        };
      }
    }
  });

  // Place sites into Array as required by JoinableSitesResponse
  const sitesArray: JoinableSite[] = [];
  for (const cloudId in sites) {
    sitesArray.push(sites[cloudId]);
  }
  return {
    sites: sitesArray,
  };
};

const parseAri = (input: string): ARI => {
  /* Valid ARI: https://developer.atlassian.com/platform/atlassian-resource-identifier/spec/ari-latest/#syntax
   * ari:cloud:<resource_owner>::<resource_type>/<resource_id>
   * ari:cloud:<resource_owner>:<cloud_id>:<resource_type>/<resource_id>
   */
  const colonSplitInput = input.split(':');
  if (
    colonSplitInput.length !== 5 ||
    colonSplitInput[0] !== 'ari' ||
    colonSplitInput[1] !== 'cloud'
  ) {
    // Not a valid ARI https://developer.atlassian.com/platform/atlassian-resource-identifier/spec/ari-latest/#syntax
    // as of 2021 Jan
    throw new Error('Invalid ARI');
  }

  const slashSplitInput = colonSplitInput[4].split('/');
  if (slashSplitInput.length !== 2) {
    // Not a valid ARI https://developer.atlassian.com/platform/atlassian-resource-identifier/spec/ari-latest/#syntax
    // as of 2021 Jan
    throw new Error('Invalid ARI');
  }

  return {
    uriScheme: colonSplitInput[0],
    cloud: colonSplitInput[1],
    resourceOwner: colonSplitInput[2],
    // For back-compatibility with Jira and Confluence. May be empty
    cloudId: colonSplitInput[3],
    resourceType: slashSplitInput[0],
    resourceId: slashSplitInput[1],
  };
};

const isPublicEmailDomainError = (body: any): Boolean => {
  // Public Email Domain Error returns a body with the following content:
  // {"code":"email-public-domain","message":"Request requires a domain which is not public"}
  return body?.code && body.code === 'email-public-domain';
};

const emptyProductRecommendationResponse: ProductRecommendationsResponse = {
  capability: { DIRECT_ACCESS: [], REQUEST_ACCESS: [] },
};

/* We are unable to use fetchJson from packages/navigation/atlassian-switcher/src/common/utils/fetch.ts
 * because some 400 errors from productRecommendation API are expected and should be handled as empty data
 */
export const fetchJsonOrEmptyProductRecommendationsResponse = (
  url: string,
  init?: RequestInit,
): Promise<ProductRecommendationsResponse> =>
  fetch(url, { credentials: 'include', ...init }).then(async response => {
    const jsonPromise = response.json();
    if (response.ok) {
      return jsonPromise;
    }
    if (response.status === 400) {
      const json = await jsonPromise;
      if (isPublicEmailDomainError(json)) {
        return emptyProductRecommendationResponse;
      }
    }
    throw enrichFetchError(
      new Error(
        `Unable to fetch ${url} ${response.status} ${response.statusText}`,
      ),
      response.status,
    );
  });

export const fetchProductRecommendationsInternal = (
  baseUrl: string = '',
): Promise<JoinableSitesResponse> => {
  return fetchJsonOrEmptyProductRecommendationsResponse(
    productRecommendationsUrl(baseUrl),
    {
      method: 'get',
    },
  ).then(response => {
    return convertProductRecommendationsResponseToJoinableSitesResponse(
      response,
    );
  });
};

export const fetchProductRecommendations = (baseUrl: string) => () =>
  fetchProductRecommendationsInternal(baseUrl);
