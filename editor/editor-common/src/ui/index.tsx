// Disable no-re-export rule for entry point files
/* eslint-disable @atlaskit/editor/no-re-export */

export { AssistiveText } from './AssistiveText/AssistiveText';
export { default as Caption } from './Caption';
export { default as MediaSingle } from './MediaSingle';
export type { Props as MediaSingleProps } from './MediaSingle';
export type { MediaSingleWidthType, MediaSingleSize } from './MediaSingle/types';

export { MediaSingleDimensionHelper, MediaBorderGapFiller } from './MediaSingle/styled';
export type { MediaSingleWrapperProps as MediaSingleDimensionHelperProps } from './MediaSingle/styled';

export {
	layoutSupportsWidth,
	calcPxFromColumns,
	calcPctFromPx,
	calcPxFromPct,
	calcColumnsFromPx,
	snapToGrid,
	calcMediaPxWidth,
	wrappedLayouts,
} from './MediaSingle/grid';

export { mediaLinkStyle } from './MediaSingle/link';
export { default as Popup } from './Popup';
export { findOverflowScrollParent } from './Popup/utils';
export type { Props as PopupProps } from './Popup';
export type { Position as PopupPosition } from './Popup/utils';
export { default as UnsupportedBlock } from './UnsupportedBlock';
export { default as UnsupportedInline } from './UnsupportedInline';
export { BaseTheme, mapBreakpointToLayoutMaxWidth } from './BaseTheme';

export {
	default as withOuterListeners,
	PlainOutsideClickTargetRefContext,
} from './with-outer-listeners';
export type { WithOutsideClickProps } from './with-outer-listeners';
export type {
	CardEventClickHandler,
	CardSurroundings,
	EventHandlers,
	LinkEventClickHandler,
	MentionEventHandler,
	MentionEventHandlers,
	SmartCardEventClickHandler,
} from './EventHandlers';
export {
	WidthContext,
	WidthConsumer,
	WidthProvider,
	createWidthContext,
	getBreakpoint,
} from './WidthProvider';
export type { WidthConsumerContext, Breakpoints } from './WidthProvider';

export { default as overflowShadow, shadowClassNames } from './OverflowShadow';
export type {
	OverflowShadowOptions,
	OverflowShadowProps,
	OverflowShadowState,
} from './OverflowShadow';

export { shadowObserverClassNames, ShadowObserver } from './OverflowShadow/shadowObserver';

export { WithCreateAnalyticsEvent } from './WithCreateAnalyticsEvent';

export {
	messages as expandMessages,
	ExpandIconWrapper,
	expandLayoutWrapperStyle,
	ExpandLayoutWrapperWithRef,
} from './Expand';

export { ErrorMessage, HelperMessage, ValidMessage } from './Messages';
export {
	clearNextSiblingMarginTopStyle,
	clearNextSiblingBlockMarkMarginTopStyle,
} from './clear-next-sibling-margin-top';
export { IntlErrorBoundary, REACT_INTL_ERROR_MESSAGE } from './IntlErrorBoundary';
export { default as IntlProviderIfMissingWrapper } from './IntlProviderIfMissingWrapper';

export { default as FloatingToolbarButton } from './FloatingToolbar/Button';
export { default as FloatingToolbarSeparator } from './FloatingToolbar/Separator';
export { SmallerEditIcon } from './FloatingToolbar/SmallerEditIcon';

export {
	RECENT_SEARCH_WIDTH_IN_PX,
	RECENT_SEARCH_WIDTH_WITHOUT_ITEMS_IN_PX,
	RECENT_SEARCH_HEIGHT_IN_PX,
	LINKPICKER_HEIGHT_IN_PX,
} from './LinkSearch/const';

export {
	ContextPanelProvider,
	ContextPanelWidthProvider,
	ContextPanelConsumer,
	ContextPanel,
} from './ContextPanel/context';

export { default as Resizer } from './ResizerLegacy';
export type { ResizerState } from './ResizerLegacy';

export type { EnabledHandles, Props as ResizerProps } from './ResizerLegacy/types';

export { snapTo, handleSides, imageAlignmentMap } from './ResizerLegacy/utils';

export { wrapperStyle } from './ResizerLegacy/styled';
export { panelTextInput } from './PanelTextInput/styles';
export { default as PanelTextInput } from './PanelTextInput';
export { default as Announcer } from './Announcer/announcer';
export { Shortcut } from './Shortcut';
export { EDIT_AREA_ID } from './Toolbar';
export { ToolbarButtonGroup } from './Toolbar/ButtonGroup';
export { ToolbarDropdownTriggerWrapper } from './Toolbar/DropdownTriggerWrapper';
export { ToolbarDropdownWrapper } from './Toolbar/DropdownWrapper';
export { ToolbarExpandIcon } from './Toolbar/ExpandIcon';
export { ToolbarSeparator } from './Toolbar/Separator';
export { default as DropList, type Props as DropListProps } from './DropList';
export type { UseStickyToolbarType } from './Toolbar';
export type { OpenChangedEvent } from './DropList';

export { sharedMultiBodiedExtensionStyles } from './MultiBodiedExtension';

export { default as TableSelectorPopup, type TableSelectorPopupProps } from './TableSelector';

export { default as HoverLinkOverlay } from './HoverLinkOverlay';
