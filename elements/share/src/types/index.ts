export {
  ConfigResponse,
  ConfigResponseMode,
  ShareClient,
  ShareRequest,
  ShareResponse,
} from '../clients/ShareServiceClient';
export { FormChildrenArgs } from './form';
export {
  Flag,
  FlagType,
  MessageDescriptor,
  ADMIN_NOTIFIED,
  OBJECT_SHARED,
} from './Flag';
export {
  OriginAnalyticAttributes,
  OriginTracing,
  OriginTracingFactory,
  OriginTracingForSubSequentEvents,
  OriginTracingWithIdGenerated,
} from './OriginTracing';
export { ProductId, ProductName } from './Products';
export { ShareButtonStyle, TooltipPosition } from './ShareButton';
export {
  DialogContentState,
  ShareContentState,
  ShareError,
} from './ShareContentState';
export {
  DialogPlacement,
  DialogBoundariesElement,
  RenderCustomTriggerButton,
} from './ShareDialogWithTrigger';
export { Comment, Content, MetaData } from './ShareEntities';
export { User, UserWithEmail, UserWithId } from './User';
export {
  ShareToSlackResponse,
  SlackTeamsResponse,
  SlackTeamsServiceResponse,
  SlackConversationsResponse,
  SlackConversationsServiceResponse,
  SelectOption,
  SlackContentState,
  Channel,
  SlackUser,
  Workspace,
  Team,
  Conversation,
} from './ShareToSlackEntities';
export { ShareToSlackClient } from '../clients/ShareToSlackClient';

export type KeysOfType<T, TProp> = {
  [P in keyof T]: T[P] extends TProp ? P : never;
}[keyof T];
