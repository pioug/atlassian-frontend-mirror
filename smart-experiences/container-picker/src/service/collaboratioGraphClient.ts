import { getConfig } from '../config';
import { transformCollaborationGraphResponse } from './transformer';
import { CollaborationGraphContext, ProductType } from '../types';

const getUrl = (baseUrl?: string) =>
  getConfig().getCollaborationGraphUrl(baseUrl);

export const collaborationGraphClient = (
  context: CollaborationGraphContext,
  product: ProductType,
  maxRequestOptions?: number,
) => {
  const containerType = product === 'jira' ? 'jiraProject' : 'confluenceSpace';
  return fetch(getUrl(context.baseUrl), {
    credentials: 'include',
    method: 'POST',
    body: JSON.stringify({
      context: {
        contextType: context.contextType,
        principalId: 'context',
        siteId: context.cloudId,
        sessionId: context.sessionId,
      },
      containerTypes: [containerType],
      maxNumberOfResults: maxRequestOptions,
      userId: 'context',
      expanded: true,
    }),
    headers: {
      'content-type': 'application/json',
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      return Promise.reject({
        message: `error calling collaboration graph search service, statusCode=${response.status}, statusText=${response.statusText}, product=${product}`,
      });
    })
    .then(transformCollaborationGraphResponse);
};
