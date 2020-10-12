import {
  RequestServiceOptions,
  ServiceConfig,
  utils,
} from '@atlaskit/util-service-support';
import {
  ShareToSlackResponse,
  SlackTeamsServiceResponse,
  SlackConversationsServiceResponse,
} from '../types';

export interface ShareToSlackClient {
  share(
    teamId: string,
    conversationId: string,
    conversationType: string,
    link: string,
    product: string,
    cloudId: string,
    message?: string,
  ): Promise<ShareToSlackResponse>;
  getConversations(
    teamId: string,
    product: string,
    cloudId?: string,
  ): Promise<SlackConversationsServiceResponse>;
  getTeams(
    product: string,
    cloudId?: string,
  ): Promise<SlackTeamsServiceResponse>;
}

export const DEFAULT_SHARE_TO_SLACK_SERVICE_URL = '/gateway/api/growth/middy';
export const getTeamsPath = (product: string) => {
  return `${product}-workspaces`;
};
export const getConversationsPath = (product: string) => {
  return `${product}-conversations`;
};
export const getSharePath = (product: string) => {
  return `${product}-share-link`;
};

export class ShareToSlackServiceClient implements ShareToSlackClient {
  private serviceConfig: ServiceConfig;

  constructor(serviceConfig?: ServiceConfig) {
    this.serviceConfig = serviceConfig || {
      url: DEFAULT_SHARE_TO_SLACK_SERVICE_URL,
    };
  }

  public getTeams(
    product: string,
    cloudId?: string,
  ): Promise<SlackTeamsServiceResponse> {
    const options = {
      path: getTeamsPath(product),
      queryParams: { cloudId },
      requestInit: { method: 'get' },
    };

    return utils.requestService(this.serviceConfig, options);
  }

  public getConversations(
    teamId: string,
    product: string,
    cloudId?: string,
  ): Promise<SlackConversationsServiceResponse> {
    const options = {
      path: getConversationsPath(product),
      queryParams: {
        teamId,
        cloudId,
      },
      requestInit: { method: 'get' },
    };

    return utils.requestService(this.serviceConfig, options);
  }

  public share(
    teamId: string,
    conversationId: string,
    conversationType: string,
    link: string,
    product: string,
    cloudId: string,
    message?: string,
  ): Promise<ShareToSlackResponse> {
    const options: RequestServiceOptions = {
      path: getSharePath(product),
      requestInit: {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          teamId,
          conversation: {
            id: conversationId,
            type: conversationType,
          },
          message,
          link,
          cloudId,
        }),
      },
    };

    return utils.requestService(this.serviceConfig, options);
  }
}
