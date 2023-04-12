import type { InvokeRequest } from '@atlaskit/linking-types/smart-link-actions';

export enum InvokeActionError {
  NoData = 'NoData',
  Unknown = 'Unknown',
}

export type InvokeActions = {
  create?: InvokeRequest;
  read?: InvokeRequest;
  update?: InvokeRequest;
  delete?: InvokeRequest;
};
