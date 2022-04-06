import { ServerActionOpts } from '@atlaskit/linking-common';

export interface ResolveRequest {
  resourceUrl: string;
  context?: string;
}

export interface BatchResolveRequest {
  resourceUrls: ResolveRequest[];
}

export type InvokeRequest = ServerActionOpts;
