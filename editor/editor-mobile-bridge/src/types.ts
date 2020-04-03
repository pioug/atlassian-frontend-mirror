import { EditorView } from 'prosemirror-view';
import { ResolveResponse } from '@atlaskit/smart-card';

export type EditorViewWithComposition = EditorView & {
  domObserver: {
    observer?: MutationObserver;
    flush: () => void;
  };
  composing: boolean;
};

export type PromiseName =
  | 'getAuth'
  | 'getConfig'
  | 'nativeFetch'
  | 'getAccountId'
  | 'getResolvedLink'
  | 'getLinkResolve';

export type PromisePayload =
  | GetAuthPayload
  | GetConfigPayload
  | NativeFetchPayload
  | GetAccountIdPayload
  | GetResolvedLinkPayload
  | GetLinkResolvePayload;

export interface GetAuthPayload {
  baseUrl: string;
  clientId: string;
  token: string;
}

export interface GetConfigPayload {
  baseUrl: string;
  cloudId?: string;
}

export interface NativeFetchPayload {
  response: string;
  status: number;
  statusText: string;
}

export type GetAccountIdPayload = string;

export type GetResolvedLinkPayload = ResolveResponse;

// RPC not implemented on native side pending
// upstream work for SmartLinks v2
export type GetLinkResolvePayload = unknown;
