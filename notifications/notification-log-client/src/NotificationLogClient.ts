import {
  RequestServiceOptions,
  ServiceConfig,
  utils,
} from '@atlaskit/util-service-support';
import { version as npmPackageVersion } from './version.json';
import { NotificationLogProvider, NotificationCountResponse } from './types';

export const DEFAULT_SOURCE = 'atlaskitNotificationLogClient';

export default class NotificationLogClient implements NotificationLogProvider {
  private serviceConfig: ServiceConfig;
  private cloudId?: string;
  private source: string;

  constructor(
    baseUrl: string,
    cloudId?: string,
    source: string = DEFAULT_SOURCE,
  ) {
    this.serviceConfig = { url: baseUrl };
    this.cloudId = cloudId;
    this.source = source;
  }

  public async countUnseenNotifications(
    options: RequestServiceOptions = {},
  ): Promise<NotificationCountResponse> {
    const mergedOptions: RequestServiceOptions = {
      path: '/api/2/notifications/count/unseen',
      ...options,
      queryParams: {
        ...(this.cloudId && { cloudId: this.cloudId }),
        source: this.source,
        ...(options.queryParams || {}),
      },
      requestInit: {
        mode: 'cors',
        headers: {
          'x-app-version': `${npmPackageVersion}-${DEFAULT_SOURCE}`,
        },
        ...(options.requestInit || {}),
      },
    };

    return utils.requestService(this.serviceConfig, mergedOptions) as Promise<
      NotificationCountResponse
    >;
  }
}
