import { ServerActionOpts } from '../../model/invoke-opts';

export interface ResolveRequest {
  resourceUrl: string;
  context?: string;
}

export interface BatchResolveRequest {
  resourceUrls: ResolveRequest[];
}

export type InvokeRequest = ServerActionOpts;
