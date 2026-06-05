import { tableCellContentDomSelector, tableCellSelector, tableHeaderSelector, tablePrefixSelector } from '@atlaskit/adf-schema';

export const TableSharedCssClassName: {
	// eslint-disable-next-line @atlaskit/editor/no-re-export
	readonly TABLE_CELL_NODEVIEW_CONTENT_DOM: 'pm-table-cell-nodeview-content-dom';
	// eslint-disable-next-line @atlaskit/editor/no-re-export
	readonly TABLE_CELL_WRAPPER: 'pm-table-cell-content-wrap';
	readonly TABLE_COLUMN_CONTROLS_DECORATIONS: 'pm-table-column-controls-decoration';
	readonly TABLE_CONTAINER: 'pm-table-container';
	// eslint-disable-next-line @atlaskit/editor/no-re-export
	readonly TABLE_HEADER_CELL_WRAPPER: 'pm-table-header-content-wrap';
	readonly TABLE_LEFT_BORDER: 'pm-table-left-border';
	readonly TABLE_LEFT_SHADOW: 'pm-table-with-left-shadow';
	readonly TABLE_NATIVE_STICKY: 'pm-table-row-native-sticky';
	readonly TABLE_NODE_WRAPPER: 'pm-table-wrapper';
	readonly TABLE_NODE_WRAPPER_NO_OVERFLOW: 'pm-table-wrapper-no-overflow';
	readonly TABLE_RESIZER_CONTAINER: 'pm-table-resizer-container';
	readonly TABLE_RIGHT_BORDER: 'pm-table-right-border';
	readonly TABLE_RIGHT_SHADOW: 'pm-table-with-right-shadow';
	readonly TABLE_ROW_CONTROLS_WRAPPER: 'pm-table-row-controls-wrapper';
	readonly TABLE_SCROLL_INLINE_SHADOW: 'pm-table-scroll-inline-shadow';
	readonly TABLE_SHADOW_SENTINEL_LEFT: 'pm-table-shadow-sentinel-left';
	readonly TABLE_SHADOW_SENTINEL_RIGHT: 'pm-table-shadow-sentinel-right';
	readonly TABLE_STICKY: 'pm-table-sticky';
	readonly TABLE_STICKY_SCROLLBAR_CONTAINER: 'pm-table-sticky-scrollbar-container';
	readonly TABLE_STICKY_SCROLLBAR_SENTINEL_BOTTOM: 'pm-table-sticky-scrollbar-sentinel-bottom';
	readonly TABLE_STICKY_SCROLLBAR_SENTINEL_TOP: 'pm-table-sticky-scrollbar-sentinel-top';
	readonly TABLE_STICKY_SENTINEL_BOTTOM: 'pm-table-sticky-sentinel-bottom';
	readonly TABLE_STICKY_SENTINEL_TOP: 'pm-table-sticky-sentinel-top';
	readonly TABLE_STICKY_SHADOW: 'pm-table-sticky-shadow';
	readonly TABLE_STICKY_WRAPPER: 'pm-table-sticky-wrapper';
	readonly TABLE_VIEW_CONTENT_WRAP: 'tableView-content-wrap';
} = {
	TABLE_CONTAINER: `${tablePrefixSelector}-container`,
	TABLE_NODE_WRAPPER: `${tablePrefixSelector}-wrapper`,
	TABLE_NODE_WRAPPER_NO_OVERFLOW: `${tablePrefixSelector}-wrapper-no-overflow`,
	TABLE_SCROLL_INLINE_SHADOW: `${tablePrefixSelector}-scroll-inline-shadow`,
	TABLE_RIGHT_BORDER: `${tablePrefixSelector}-right-border`,
	TABLE_LEFT_BORDER: `${tablePrefixSelector}-left-border`,
	TABLE_LEFT_SHADOW: `${tablePrefixSelector}-with-left-shadow`,
	TABLE_NATIVE_STICKY: `${tablePrefixSelector}-row-native-sticky`,
	TABLE_RIGHT_SHADOW: `${tablePrefixSelector}-with-right-shadow`,
	TABLE_STICKY_SHADOW: `${tablePrefixSelector}-sticky-shadow`,
	TABLE_STICKY_WRAPPER: `${tablePrefixSelector}-sticky-wrapper`,
	TABLE_STICKY_SCROLLBAR_CONTAINER: `${tablePrefixSelector}-sticky-scrollbar-container`,
	TABLE_STICKY_SENTINEL_TOP: `${tablePrefixSelector}-sticky-sentinel-top`,
	TABLE_STICKY_SENTINEL_BOTTOM: `${tablePrefixSelector}-sticky-sentinel-bottom`,
	TABLE_STICKY_SCROLLBAR_SENTINEL_TOP: `${tablePrefixSelector}-sticky-scrollbar-sentinel-top`,
	TABLE_STICKY_SCROLLBAR_SENTINEL_BOTTOM: `${tablePrefixSelector}-sticky-scrollbar-sentinel-bottom`,
	TABLE_SHADOW_SENTINEL_LEFT: `${tablePrefixSelector}-shadow-sentinel-left`,
	TABLE_SHADOW_SENTINEL_RIGHT: `${tablePrefixSelector}-shadow-sentinel-right`,
	TABLE_STICKY: `${tablePrefixSelector}-sticky`,
	// eslint-disable-next-line @atlaskit/editor/no-re-export
	TABLE_CELL_NODEVIEW_CONTENT_DOM: tableCellContentDomSelector,
	// eslint-disable-next-line @atlaskit/editor/no-re-export
	TABLE_CELL_WRAPPER: tableCellSelector,
	// eslint-disable-next-line @atlaskit/editor/no-re-export
	TABLE_HEADER_CELL_WRAPPER: tableHeaderSelector,
	TABLE_ROW_CONTROLS_WRAPPER: `${tablePrefixSelector}-row-controls-wrapper`,
	TABLE_COLUMN_CONTROLS_DECORATIONS: `${tablePrefixSelector}-column-controls-decoration`,
	TABLE_RESIZER_CONTAINER: `${tablePrefixSelector}-resizer-container`,
	TABLE_VIEW_CONTENT_WRAP: 'tableView-content-wrap',
} as const;
