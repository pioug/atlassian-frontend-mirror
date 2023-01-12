import { CardState } from '../../state/types';
import { InvokeHandler } from '../../model/invoke-handler';
import { CardPlatform, OnResolveCallback } from '../Card/types';
import { ReactNode } from 'react';
import { ActionProps } from '../BlockCard/components/Action';
import { RequestAccessMessageKey } from '../../messages';
import { OnErrorCallback } from '../types';
import { AnalyticsFacade } from '../../state/analytics';

export type EmbedCardProps = {
  url: string;
  cardState: CardState;
  handleAuthorize: (() => void) | undefined;
  handleErrorRetry: () => void;
  handleFrameClick: React.EventHandler<React.MouseEvent | React.KeyboardEvent>;
  analytics: AnalyticsFacade;
  handleInvoke: InvokeHandler;
  id?: string;
  isSelected?: boolean;
  isFrameVisible?: boolean;
  platform?: CardPlatform;
  onResolve?: OnResolveCallback;
  onError?: OnErrorCallback;
  testId?: string;
  inheritDimensions?: boolean;
  showActions?: boolean;
  onIframeDwell?: (dwellTime: number, dwellPercentVisible: number) => void;
  onIframeFocus?: () => void;
};
export interface WithShowControlMethodProp {
  showControls?: () => void;
}

export interface ContextViewModel {
  icon?: ReactNode;
  image?: string;
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
