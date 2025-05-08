// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';

import type { TableLayout } from '@atlaskit/adf-schema';
import {
	tableCellContentDomSelector,
	tableCellSelector,
	tableHeaderSelector,
	tablePrefixSelector,
} from '@atlaskit/adf-schema';
import {
	akEditorBreakoutPadding,
	akEditorFullWidthLayoutWidth,
	akEditorSelectedNodeClassName,
	akEditorTableBorder,
	akEditorTableNumberColumnWidth,
	akEditorTableToolbar,
	akEditorWideLayoutWidth,
	overflowShadow,
} from '@atlaskit/editor-shared-styles';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import { browser } from '../../utils/browser';

import { CodeBlockSharedCssClassName } from './code-block';
import { tableCellBackgroundStyleOverride } from './tableCell';

export const tableMarginTop = 24;
export const tableMarginBottom = 16;
export const tableMarginTopWithControl = 14;
export const tableMarginSides = 8;
export const tableCellMinWidth = 48;
export const tableNewColumnMinWidth = 140;
export const tableCellBorderWidth = 1;
export const tableCellPadding = 8;
export const tableResizeHandleWidth = 6;
export const tablePadding = 8;
export const tableControlsSpacing = tableMarginTop + tablePadding - tableCellBorderWidth;

export const TableSharedCssClassName = {
	TABLE_CONTAINER: `${tablePrefixSelector}-container`,
	TABLE_NODE_WRAPPER: `${tablePrefixSelector}-wrapper`,
	TABLE_LEFT_SHADOW: `${tablePrefixSelector}-with-left-shadow`,
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
	// eslint-disable-next-line @atlaskit/editor/no-re-export
	TABLE_CELL_NODEVIEW_CONTENT_DOM: tableCellContentDomSelector,
	// eslint-disable-next-line @atlaskit/editor/no-re-export
	TABLE_CELL_WRAPPER: tableCellSelector,
	// eslint-disable-next-line @atlaskit/editor/no-re-export
	TABLE_HEADER_CELL_WRAPPER: tableHeaderSelector,
	TABLE_ROW_CONTROLS_WRAPPER: `${tablePrefixSelector}-row-controls-wrapper`,
	TABLE_COLUMN_CONTROLS_DECORATIONS: `${tablePrefixSelector}-column-controls-decoration`,
	TABLE_RESIZER_CONTAINER: `${tablePrefixSelector}-resizer-container`,
} as const;

/* first block node has 0 top margin */
const firstNodeWithNotMarginTop = () =>
	fg('platform_editor_nested_dnd_styles_changes')
		? // eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression
			css`
				> :nth-child(1 of :not(style, .ProseMirror-gapcursor, .ProseMirror-widget, span)) {
					margin-top: 0;
				}
			`
		: // eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression
			css`
				> :first-child:not(style),
				> style:first-child + * {
					margin-top: 0;
				}

				> .ProseMirror-gapcursor:first-child + *,
				> style:first-child + .ProseMirror-gapcursor + * {
					margin-top: 0;
				}

				> .ProseMirror-gapcursor:first-child + span + *,
				> style:first-child + .ProseMirror-gapcursor + span + * {
					margin-top: 0;
				}
			`;

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- Appears safe to auto-fix, but leaving it up to the team to remediate as the readability only gets worse with autofixing
const tableSharedStyle = () => css`
	${tableCellBackgroundStyleOverride()}
	.${TableSharedCssClassName.TABLE_CONTAINER} {
		position: relative;
		margin: 0 auto ${token('space.200', '16px')};
		box-sizing: border-box;

		/**
     * Fix block top alignment inside table cells.
     */
		.decisionItemView-content-wrap:first-of-type > div {
			margin-top: 0;
		}
	}
	.${TableSharedCssClassName.TABLE_CONTAINER}[data-number-column='true'] {
		padding-left: ${akEditorTableNumberColumnWidth - 1}px;
		clear: both;
	}

	.${TableSharedCssClassName.TABLE_RESIZER_CONTAINER} {
		will-change: width, margin-left;
	}

	.${TableSharedCssClassName.TABLE_RESIZER_CONTAINER} table {
		will-change: width;
	}

	.${TableSharedCssClassName.TABLE_NODE_WRAPPER} > table {
		margin: ${token('space.300', '24px')} 0 0 0;
	}

	.${TableSharedCssClassName.TABLE_CONTAINER} > table,
	.${TableSharedCssClassName.TABLE_STICKY_WRAPPER} > table {
		margin: ${token('space.300', '24px')} ${token('space.100', '8px')} 0 0;
	}

	/* avoid applying styles to nested tables (possible via extensions) */
	.${TableSharedCssClassName.TABLE_CONTAINER} > table,
	.${TableSharedCssClassName.TABLE_NODE_WRAPPER} > table,
	.${TableSharedCssClassName.TABLE_STICKY_WRAPPER} > table {
		border-collapse: collapse;
		border: ${tableCellBorderWidth}px solid
			${token('color.background.accent.gray.subtler', akEditorTableBorder)};
		table-layout: fixed;
		font-size: 1em;
		width: 100%;

		&[data-autosize='true'] {
			table-layout: auto;
		}

		& {
			* {
				box-sizing: border-box;
			}
			hr {
				box-sizing: content-box;
			}

			tbody {
				border-bottom: none;
			}
			th td {
				background-color: ${token('color.background.neutral.subtle', 'white')};
			}

			${fg('platform_editor_renderer_table_header_styles')
				? `> tbody > tr > th, > tbody > tr > td`
				: 'th, td'} {
				min-width: ${tableCellMinWidth}px;
				font-weight: ${token('font.weight.regular')};
				vertical-align: top;
				border: 1px solid ${token('color.background.accent.gray.subtler', akEditorTableBorder)};
				border-right-width: 0;
				border-bottom-width: 0;

				padding: ${token('space.100', '8px')};
				/* https://stackoverflow.com/questions/7517127/borders-not-shown-in-firefox-with-border-collapse-on-table-position-relative-o */
				${browser.gecko || browser.ie || (browser.mac && browser.chrome)
					? 'background-clip: padding-box;'
					: ''}

				${firstNodeWithNotMarginTop()}

				th p:not(:first-of-type),
				td p:not(:first-of-type) {
					margin-top: ${token('space.150', '12px')};
				}
			}

			/* Ensures nested tables are compatible with parent table background color - uses specificity to ensure tables nested by extensions are not affected */
			> tbody > tr > td {
				background-color: ${token('elevation.surface')};
			}

			th {
				background-color: ${token('color.background.accent.gray.subtlest', akEditorTableToolbar)};
				text-align: left;

				/* only apply this styling to codeblocks in default background headercells */
				/* TODO this needs to be overhauled as it relies on unsafe selectors */
				&:not([style]):not(.danger) {
					.${CodeBlockSharedCssClassName.CODEBLOCK_CONTAINER}:not(.danger) {
						background-color: ${token('elevation.surface.raised', 'rgb(235, 237, 240)')};

						:not(.${akEditorSelectedNodeClassName}) {
							box-shadow: 0px 0px 0px 1px ${token('color.border', 'transparent')};
						}

						.${CodeBlockSharedCssClassName.CODEBLOCK_CONTENT_WRAPPER} {
							background-image: ${overflowShadow({
								leftCoverWidth: token('space.300', '24px'),
							})};

							background-color: ${token('color.background.neutral', 'rgb(235, 237, 240)')};
						}

						.${CodeBlockSharedCssClassName.CODEBLOCK_LINE_NUMBER_GUTTER} {
							background-color: ${token('color.background.neutral', 'rgb(226, 229, 233)')};
						}

						/* this is only relevant to the element taken care of by renderer */
						> [data-ds--code--code-block] {
							background-image: ${overflowShadow({
								leftCoverWidth: token('space.300', '24px'),
							})}!important;

							background-color: ${token(
								'color.background.neutral',
								'rgb(235, 237, 240)',
							)}!important;

							/* selector lives inside @atlaskit/code */
							--ds--code--line-number-bg-color: ${token(
								'color.background.neutral',
								'rgb(226, 229, 233)',
							)};
						}
					}
				}
			}
		}
	}
`;

export const calcTableWidth = (
	layout: TableLayout,
	containerWidth?: number,
	addControllerPadding: boolean = true,
): number | 'inherit' => {
	switch (layout) {
		case 'full-width':
			return containerWidth
				? Math.min(
						containerWidth - (addControllerPadding ? akEditorBreakoutPadding : 0),
						akEditorFullWidthLayoutWidth,
					)
				: akEditorFullWidthLayoutWidth;
		case 'wide':
			if (containerWidth) {
				return Math.min(
					containerWidth - (addControllerPadding ? akEditorBreakoutPadding : 0),
					akEditorWideLayoutWidth,
				);
			}

			return akEditorWideLayoutWidth;
		default:
			return 'inherit';
	}
};

export { tableSharedStyle };
