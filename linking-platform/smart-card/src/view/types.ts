import { type ReactNode } from 'react';
import { type CardType } from '@atlaskit/linking-common';
import { type ActionProps } from './BlockCard/components/Action';
import { type RequestAccessMessageKey } from '../messages';

export interface WithShowControlMethodProp {
  showControls?: () => void;
}

export interface ContextViewModel {
  icon?: ReactNode;
  text: string;
}

export type AccessTypes =
  | 'REQUEST_ACCESS'
  | 'PENDING_REQUEST_EXISTS'
  | 'FORBIDDEN'
  | 'DIRECT_ACCESS'
  | 'DENIED_REQUEST_EXISTS'
  | 'APPROVED_REQUEST_EXISTS'
  | 'ACCESS_EXISTS';

export interface AccessContext {
  accessType?: AccessTypes;
  cloudId?: string;
  url?: string;
  smartLinksAccessMetadataExperimentCohort?:
    | 'experiment'
    | 'control'
    | 'not-enrolled';
}

export interface RequestAccessContextProps extends AccessContext {
  action?: ActionProps;
  callToActionMessageKey?: RequestAccessMessageKey;
  descriptiveMessageKey?: RequestAccessMessageKey;
  titleMessageKey?: RequestAccessMessageKey;
  hostname?: string;
  buttonDisabled?: boolean;
}

export type InlinePreloaderStyle =
  | 'on-left-with-skeleton'
  | 'on-right-without-skeleton';

export type ErrorCardType =
  | 'errored'
  | 'fallback'
  | 'forbidden'
  | 'not_found'
  | 'unauthorized';

export type OnErrorCallback = (data: {
  status: Extract<CardType, ErrorCardType>;
  url: string;
  err?: Error;
}) => void;
