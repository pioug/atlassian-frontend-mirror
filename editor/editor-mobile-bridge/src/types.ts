import { EditorView } from 'prosemirror-view';
import { SelectionData } from '@atlaskit/editor-core';
import { AnnotationMarkStates } from '@atlaskit/adf-schema';
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
  | 'getCollabConfig'
  | 'nativeFetch'
  | 'getAccountId'
  | 'getResolvedLink'
  | 'getLinkResolve'
  | 'onSelection'
  | 'getAnnotationStates'
  | 'deleteStorageValue'
  | 'setStorageValue'
  | 'getStorageValue'
  | 'asyncCallCompleted';

export type PromisePayload =
  | GetAuthPayload
  | GetConfigPayload
  | NativeFetchPayload
  | GetAccountIdPayload
  | GetResolvedLinkPayload
  | GetLinkResolvePayload
  | GetAnnotationStatesPayload;

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

export interface GetCollabConfigPayload {
  baseUrl: string;
  documentAri: string;
  userId: string;
}

export type GetAccountIdPayload = string;

export type GetResolvedLinkPayload = ResolveResponse;

// RPC not implemented on native side pending
// upstream work for SmartLinks v2
export type GetLinkResolvePayload = unknown;

export interface GetAnnotationStatesPayload {
  annotationIdToState: {
    [AnnotationId: string]: AnnotationMarkStates;
  };
}

export interface SelectionPayload {
  selection: SelectionData;
  rect: { top: number; left: number };
}

export type Serialized<T> = string | T;
