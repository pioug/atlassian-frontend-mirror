import {
  RequestServiceOptions,
  ServiceConfig,
  utils,
} from '@atlaskit/util-service-support';
import { Comment, Content, MetaData, User } from '../types';

export interface ShareClient {
  share(
    content: Content,
    recipients: User[],
    metadata: MetaData,
    comment?: Comment,
  ): Promise<ShareResponse>;

  getConfig(product: string, cloudId: string): Promise<ConfigResponse>;
}

export type ShareRequest = (
  content: Content,
  recipients: User[],
  metadata: MetaData,
  comment?: Comment,
) => Promise<ShareResponse>;

export type ShareResponse = {
  shareRequestId: string;
};

export type ConfigResponse = {
  mode: ConfigResponseMode;
  allowedDomains?: string[]; // e-mail domains from DES
  allowComment: boolean;
};

export type ConfigResponseMode =
  | 'EXISTING_USERS_ONLY' // can't invite nor request access, emails not allowed
  | 'INVITE_NEEDS_APPROVAL' // show warning message if email options
  | 'ONLY_DOMAIN_BASED_INVITE' // only allow emails within the allowed domains
  | 'DOMAIN_BASED_INVITE' // show warning message when emails doesn't match allowed domains
  | 'ANYONE'; // show direct invite info message if email options

export const DEFAULT_SHARE_PATH = 'share';
export const SHARE_CONFIG_PATH = 'share/config';
export const DEFAULT_SHARE_SERVICE_URL = '/gateway/api';

export class ShareServiceClient implements ShareClient {
  private serviceConfig: ServiceConfig;

  constructor(serviceConfig?: ServiceConfig) {
    this.serviceConfig = serviceConfig || {
      url: DEFAULT_SHARE_SERVICE_URL,
    };
  }

  /**
   * To send a POST request to the share endpoint in Share service
   */
  public share(
    content: Content,
    recipients: User[],
    metadata: MetaData,
    comment?: Comment,
  ): Promise<ShareResponse> {
    const options: RequestServiceOptions = {
      path: DEFAULT_SHARE_PATH,
      requestInit: {
        method: 'post',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({
          content,
          recipients,
          metadata,
          comment,
        }),
      },
    };

    return utils.requestService(this.serviceConfig, options);
  }

  public getConfig(product: string, cloudId: string): Promise<ConfigResponse> {
    const options = {
      path: SHARE_CONFIG_PATH,
      queryParams: { product, cloudId },
      requestInit: { method: 'get' },
    };
    return utils.requestService(this.serviceConfig, options);
  }
}
