// TODO: ED-13875 Remove Emoji & EmojiProps exports once root entry point for editor-common has been removed
export { default as Emoji } from './Emoji'; //exported from ./src/emoji.ts
export type { EmojiProps } from './Emoji'; //exported from ./src/emoji.ts
export { default as Caption } from './Caption';
export {
  default as MediaSingle,
  DEFAULT_IMAGE_WIDTH,
  DEFAULT_IMAGE_HEIGHT,
  wrappedLayouts,
  shouldAddDefaultWrappedWidth,
} from './MediaSingle';
export type { Props as MediaSingleProps } from './MediaSingle';

export { MediaSingleDimensionHelper } from './MediaSingle/styled';
export type { MediaSingleWrapperProps as MediaSingleDimensionHelperProps } from './MediaSingle/styled';

export {
  layoutSupportsWidth,
  calcPxFromColumns,
  calcPctFromPx,
  calcPxFromPct,
  calcColumnsFromPx,
  snapToGrid,
} from './MediaSingle/grid';

export { MediaLink } from './MediaSingle/link';
// TODO: ED-13875 Remove Mention export once root entry point for editor-common has been removed
export { default as Mention } from './Mention'; //exported from ./src/mention.ts
export { default as Popup, findOverflowScrollParent } from './Popup';
export type { Position as PopupPosition, Props as PopupProps } from './Popup';
export { default as UnsupportedBlock } from './UnsupportedBlock';
export { default as UnsupportedInline } from './UnsupportedInline';
export { BaseTheme, mapBreakpointToLayoutMaxWidth } from './BaseTheme';

export { default as withOuterListeners } from './with-outer-listeners';
export type {
  CardEventClickHandler,
  CardSurroundings,
  EventHandlers,
  LinkEventClickHandler,
  MentionEventHandler,
  MentionEventHandlers,
  SmartCardEventClickHandler,
} from './EventHandlers';
export { WidthConsumer, WidthProvider, getBreakpoint } from './WidthProvider';
export type { WidthConsumerContext } from './WidthProvider';

export { default as overflowShadow, shadowClassNames } from './OverflowShadow';
export type {
  OverflowShadowOptions,
  OverflowShadowProps,
  OverflowShadowState,
} from './OverflowShadow';

export { WithCreateAnalyticsEvent } from './WithCreateAnalyticsEvent';

export {
  messages as expandMessages,
  sharedExpandStyles,
  ExpandIconWrapper,
  ExpandLayoutWrapper,
} from './Expand';
export type { StyleProps as ExpandStyleProps } from './Expand';

export { ErrorMessage, HelperMessage, ValidMessage } from './Messages';
export { ClearNextSiblingMarginTop } from './clear-next-sibling-margin-top';
export {
  IntlNextErrorBoundary,
  REACT_INTL_ERROR_MESSAGE,
} from './IntlNextErrorBoundary';
export { IntlLegacyFallbackProvider } from './IntlLegacyFallbackProvider';
export { LegacyToNextIntlProvider } from './LegacyToNextIntlProvider';
