// Disable no-re-export rule for entry point files
/* eslint-disable @atlaskit/editor/no-re-export */

export {
	tableSharedStyle,
	tableMarginTop,
	tableMarginBottom,
	tableMarginSides,
	tableCellMinWidth,
	tableNewColumnMinWidth,
	tableCellBorderWidth,
	calcTableWidth,
	TableSharedCssClassName,
	tableResizeHandleWidth,
	tableCellPadding,
	tableMarginTopWithControl,
	tableControlsSpacing,
	tablePadding,
} from './shared/table';

export { AnnotationSharedClassNames, BlockAnnotationSharedClassNames } from './shared/annotation';
export {
	mediaSingleSharedStyle,
	mediaSingleSharedStyleNew,
	richMediaClassName,
} from './shared/media-single';
export { blockquoteSharedStyles } from './shared/blockquote';
export { headingsSharedStyles } from './shared/headings';
export { listItemCounterPadding, getOrderedListInlineStyles } from './shared/lists';
export { DateSharedCssClassName } from './shared/date';
export { TaskDecisionSharedCssClassName } from './shared/task-decision';

export { StatusSharedCssClassName } from './shared/status';
export { SmartCardSharedCssClassName } from './shared/smart-card';

export { DropdownMenuSharedCssClassName } from './shared/dropdown-menu';

export { CodeBlockSharedCssClassName } from './shared/code-block';
export {
	LAYOUT_SECTION_MARGIN,
	LAYOUT_COLUMN_PADDING,
	DEFAULT_TWO_COLUMN_LAYOUT_COLUMN_WIDTH,
} from './shared/layout';
export { EXTENSION_PADDING, BODIED_EXT_PADDING } from './shared/extension';
export {
	resizerItemClassName,
	resizerHandleClassName,
	resizerHandleTrackClassName,
	resizerHandleThumbClassName,
	resizerHandleThumbWidth,
} from './shared/resizer';
export { GRID_GUTTER } from './shared/grid';
export {
	FLOATING_TOOLBAR_LINKPICKER_CLASSNAME,
	DATASOURCE_INNER_CONTAINER_CLASSNAME,
} from './shared/smartCard';
export {
	buttonGroupStyle,
	buttonGroupStyleBeforeVisualRefresh,
	disableBlueBorderStyles,
	separatorStyles,
	wrapperStyle,
	triggerWrapperStyles,
	triggerWrapperStylesWithPadding,
} from './shared/plugins';

export { UnsupportedSharedCssClassName } from './shared/unsupported-content';

export {
	expandIconWrapperStyle,
	expandClassNames,
	expandIconContainerStyle,
} from './shared/expand';
export { EXPAND_CONTAINER_PADDING } from '../ui/Expand/sharedStyles';
export { ClassNames as MediaSharedClassNames } from './shared/media';

export { BreakoutCssClassName } from './shared/breakout';
export { BODIED_EXT_MBE_MARGIN_TOP } from './shared/extension';
export { DRAG_HANDLE_SELECTOR, DRAG_HANDLE_WIDTH } from './shared/drag-handle';
export {
	ANCHOR_VARIABLE_NAME,
	isCSSAnchorSupported,
	isCSSAttrAnchorSupported,
	nativeAnchorStyles,
} from './shared/native-anchor';
