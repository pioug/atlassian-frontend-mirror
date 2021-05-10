import { ReactNode } from 'react';
import { RequestAccessMessageKey } from './messages';
import { ActionProps } from './BlockCard/components/Action';

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
}

export type InlinePreloaderStyle =
  | 'on-left-with-skeleton'
  | 'on-right-without-skeleton';
