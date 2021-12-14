export type {
  ConfigResponse,
  ShareClient,
  ShareRequest,
  ShareResponse,
} from '../clients/ShareServiceClient';
export type { FormChildrenArgs } from './form';
export { ADMIN_NOTIFIED, OBJECT_SHARED } from './Flag';
export type { Flag, FlagType, MessageDescriptor } from './Flag';
export type {
  OriginAnalyticAttributes,
  OriginTracing,
  OriginTracingFactory,
  OriginTracingForSubSequentEvents,
  OriginTracingWithIdGenerated,
} from './OriginTracing';
export type { ProductId, ProductName } from './Products';
export type { ShareButtonStyle, TooltipPosition } from './ShareButton';
export type {
  ShareData,
  // for legacy support
  ShareData as DialogContentState,
  ShareContentState,
  ShareError,
} from './ShareContentState';
export type {
  DialogPlacement,
  DialogBoundariesElement,
  RenderCustomTriggerButton,
  ShareDialogWithTriggerProps,
  ShareDialogWithTriggerStates,
} from './ShareDialogWithTrigger';
export type { User, UserWithEmail, UserWithId } from './User';
export type {
  Comment,
  Content,
  MetaData,
  Integration,
  IntegrationContentProps,
} from './ShareEntities';

export { TabType } from './ShareEntities';

export type KeysOfType<T, TProp> = {
  [P in keyof T]: T[P] extends TProp ? P : never;
}[keyof T];

export type { ShareDialogContainerProps } from './ShareDialogContainer';
export type { ShareFormProps } from './ShareForm';
