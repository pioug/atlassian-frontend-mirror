/* eslint-disable @atlaskit/ui-styling-standard/use-compiled -- Pre-existing lint debt surfaced by this mechanical type-import-only PR. */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';
import type { SerializedStyles } from '@emotion/react';

import {
	akEditorSelectedNodeClassName,
	akEditorTableNumberColumnWidth,
	overflowShadow,
} from '@atlaskit/editor-shared-styles';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';
import { token } from '@atlaskit/tokens';

import { getBrowserInfo } from '../../utils/browser';

import { CodeBlockSharedCssClassName } from './code-block';
import { tableCellBackgroundStyleOverride } from './tableCell';
import { TableSharedCssClassName } from './TableSharedCssClassName';

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
export const tableControlsSpacing: number = tableMarginTop + tablePadding - tableCellBorderWidth;

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

const tableSharedStyle = (): SerializedStyles => {
	const browser = getBrowserInfo();
	// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- Appears safe to auto-fix, but leaving it up to the team to remediate as the readability only gets worse with autofixing
	return css`
		${tableCellBackgroundStyleOverride()}
		.${TableSharedCssClassName.TABLE_CONTAINER} {
			position: relative;
			margin: 0 auto ${token('space.200')};
			box-sizing: border-box;

			/**
			 * Fix block top alignment inside table cells.
			 */
			.decisionItemView-content-wrap:first-of-type > div {
				margin-top: 0;
			}
			${expValEquals('platform_editor_table_q4_loveability', 'isEnabled', true)
				? `/* Fake side borders are not needed when the rounded overlay owns the outer border. */
				.${TableSharedCssClassName.TABLE_RIGHT_BORDER},
				.${TableSharedCssClassName.TABLE_LEFT_BORDER} {
					display: none;
				}
					`
				: `.${TableSharedCssClassName.TABLE_RIGHT_BORDER},
			.${TableSharedCssClassName.TABLE_LEFT_BORDER} {
				display: block;
				width: 1px;
				height: calc(100% - ${token('space.300')});
				background: ${token('color.background.accent.gray.subtler')};
				position: absolute;
				top: ${token('space.300')};
			}
			.${TableSharedCssClassName.TABLE_RIGHT_BORDER} {
				right: 0;
			}
			.${TableSharedCssClassName.TABLE_LEFT_BORDER} {
				left: 0;
			}
			.${TableSharedCssClassName.TABLE_LEFT_BORDER}[data-with-numbered-table='true'] {
				left: ${akEditorTableNumberColumnWidth - 1}px;
			}`}
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
			margin: ${token('space.300')} 0 0 0;
		}

		.${TableSharedCssClassName.TABLE_CONTAINER} > table,
		.${TableSharedCssClassName.TABLE_STICKY_WRAPPER} > table {
			margin: ${token('space.300')} ${token('space.100')} 0 0;
		}

		/* support panel nested in table */
		${fg('platform_editor_bordered_panel_nested_in_table')
			? `.${TableSharedCssClassName.TABLE_NODE_WRAPPER} .ak-editor-panel {
			border: ${token('border.width')} solid ${token('color.border')};
		}`
			: ''}

		/* avoid applying styles to nested tables (possible via extensions) */
	.${TableSharedCssClassName.TABLE_CONTAINER} > table,
	.${TableSharedCssClassName.TABLE_NODE_WRAPPER} > table,
	.${TableSharedCssClassName.TABLE_STICKY_WRAPPER} > table {
			border-collapse: collapse;
			${expValEquals('platform_editor_table_q4_loveability', 'isEnabled', true)
				? `/* Keep a transparent border so the collapsed border model reserves the same 1px slot
			   on the table edge; the ::after overlay draws the visible rounded border instead. */
			border: ${tableCellBorderWidth}px solid transparent;`
				: `border: ${tableCellBorderWidth}px solid ${token('color.background.accent.gray.subtler')};
			border-left-color: transparent;
			border-right-color: transparent;`}
			table-layout: fixed;
			font-size: 1em;
			width: 100%;
			${expValEquals('platform_editor_table_q4_loveability', 'isEnabled', true)
				? `position: relative;

			/* Table-width outer-border owner for overflow-safe rounded corners. */
			&::after {
				content: '';
				position: absolute;
				inset: 0;
				border: ${tableCellBorderWidth}px solid ${token('color.background.accent.gray.subtler')};
				border-radius: ${token('radius.medium')};
				pointer-events: none;
				z-index: 1;
			}`
				: ''}

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
					background-color: ${token('color.background.neutral.subtle')};
				}

				> tbody > tr > th,
				> tbody > tr > td {
					min-width: ${tableCellMinWidth}px;
					font-weight: ${token('font.weight.regular')};
					vertical-align: top;
					${expValEqualsNoExposure('platform_editor_table_menu_updates', 'isEnabled', true)
						? `&[data-valign='middle'] {
								vertical-align: middle;
							}
							&[data-valign='bottom'] {
								vertical-align: bottom;
							}`
						: ''}
					border: 1px solid ${token('color.background.accent.gray.subtler')};
					border-right-width: 0;
					border-bottom-width: 0;

					padding: ${token('space.100')};
					/* https://stackoverflow.com/questions/7517127/borders-not-shown-in-firefox-with-border-collapse-on-table-position-relative-o */
					${browser.gecko || browser.ie || (browser.mac && browser.chrome)
						? 'background-clip: padding-box;'
						: ''}

					${firstNodeWithNotMarginTop()}

				th p:not(:first-of-type),
				td p:not(:first-of-type) {
						margin-top: ${token('space.150')};
					}
				}

				/* Ensures nested tables are compatible with parent table background color - uses specificity to ensure tables nested by extensions are not affected */
				> tbody > tr > td {
					background-color: ${token('elevation.surface')};
				}

				${expValEquals('platform_editor_table_q4_loveability', 'isEnabled', true)
					? `/* Let the wrapper overlay own the outer table perimeter.
				   data-reaches-* attributes are set by the TableCell node view. */
				> tbody > tr > th[data-reaches-top],
				> tbody > tr > td[data-reaches-top] {
					border-top-color: transparent;
				}

				> tbody > tr > th[data-reaches-left],
				> tbody > tr > td[data-reaches-left] {
					border-left-color: transparent;
				}

				> tbody > tr > td[data-reaches-left]::after {
					border-left-color: transparent;
				}

				> tbody > tr > td[data-reaches-bottom]::after,
				> tbody > tr > th[data-reaches-bottom]::after {
					border-bottom-color: transparent;
				}`
					: ''}
				th {
					background-color: ${token('color.background.accent.gray.subtlest')};
					text-align: left;

					/* only apply this styling to codeblocks in default background headercells */
					/* TODO this needs to be overhauled as it relies on unsafe selectors */
					${expValEquals('platform_editor_native_anchor_with_dnd', 'isEnabled', true)
						? '&:not(.danger)'
						: '&:not([style]):not(.danger)'} {
						.${CodeBlockSharedCssClassName.CODEBLOCK_CONTAINER}:not(.danger) {
							background-color: ${token('elevation.surface.raised')};

							:not(.${akEditorSelectedNodeClassName}) {
								box-shadow: 0px 0px 0px 1px ${token('color.border')};
							}

							.${CodeBlockSharedCssClassName.CODEBLOCK_CONTENT_WRAPPER} {
								background-image: ${overflowShadow({
									leftCoverWidth: token('space.300'),
								})};

								background-color: ${token('color.background.neutral')};
							}

							.${CodeBlockSharedCssClassName.CODEBLOCK_LINE_NUMBER_GUTTER} {
								background-color: ${token('color.background.neutral')};
							}

							/* this is only relevant to the element taken care of by renderer */
							> [data-ds--code--code-block] {
								background-image: ${overflowShadow({
									leftCoverWidth: token('space.300'),
								})}!important;

								background-color: ${token('color.background.neutral')}!important;

								/* selector lives inside @atlaskit/code */
								--ds--code--line-number-bg-color: ${token('color.background.neutral')};
							}
						}
					}
				}
			}
		}

		${expValEquals('platform_editor_table_q4_loveability', 'isEnabled', true)
			? `/* When the number column is enabled, the left visual edge belongs to the number column.
		   Remove the left border-radius and left border from the table's ::after overlay
		   so it doesn't double-up or round where the number column already provides that edge. */
		.${TableSharedCssClassName.TABLE_CONTAINER}[data-number-column='true'] {
			> .${TableSharedCssClassName.TABLE_NODE_WRAPPER} > table::after,
			> .${TableSharedCssClassName.TABLE_STICKY_WRAPPER} > table::after {
				border-top-left-radius: 0;
				border-bottom-left-radius: 0;
				border-left-color: transparent;
			}
		}`
			: ''}
	`;
};

export { tableSharedStyle };
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { TableSharedCssClassName } from './TableSharedCssClassName';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { calcTableWidth } from './calcTableWidth';
