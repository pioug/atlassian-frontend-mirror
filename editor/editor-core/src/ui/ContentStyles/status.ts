// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, type SerializedStyles } from '@emotion/react';

import { StatusSharedCssClassName, TableSharedCssClassName } from '@atlaskit/editor-common/styles';
import {
	akEditorDeleteBackgroundWithOpacity,
	akEditorDeleteBorder,
	akEditorSelectedBorderSize,
	akEditorSelectedNodeClassName,
	akEditorSelectedBoldBoxShadow,
	getSelectionStyles,
	SelectionStyle,
} from '@atlaskit/editor-shared-styles';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';
import { token } from '@atlaskit/tokens';

const getVisualRefreshStatusStyles: () => SerializedStyles = () =>
	// eslint-disable-next-line @atlaskit/platform/ensure-feature-flag-prefix
	fg('platform-component-visual-refresh')
		? expValEqualsNoExposure('platform_editor_find_and_replace_improvements', 'isEnabled', true)
			? css({
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values,  @atlaskit/ui-styling-standard/no-imported-style-values
					[`&.${akEditorSelectedNodeClassName}:not('.search-match-block') .${StatusSharedCssClassName.STATUS_LOZENGE} > span`]:
						{
							// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
							boxShadow: akEditorSelectedBoldBoxShadow,
						},
				})
			: // eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression
				css`
					&.${akEditorSelectedNodeClassName} .${StatusSharedCssClassName.STATUS_LOZENGE} > span {
						box-shadow: ${akEditorSelectedBoldBoxShadow};
					}
				`
		: expValEqualsNoExposure('platform_editor_find_and_replace_improvements', 'isEnabled', true)
			? // eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression
				css`
					&.${akEditorSelectedNodeClassName}:not('.search-match-block')
						.${StatusSharedCssClassName.STATUS_LOZENGE}
						> span {
						${getSelectionStyles([SelectionStyle.BoxShadow])}
					}
				`
			: // eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression
				css`
					&.${akEditorSelectedNodeClassName} .${StatusSharedCssClassName.STATUS_LOZENGE} > span {
						${getSelectionStyles([SelectionStyle.BoxShadow])}
					}
				`;

const getStatusColors: () => SerializedStyles = () =>
	fg('platform-component-visual-refresh')
		? css({
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'[data-prosemirror-node-name="status"] .lozenge-text': {
					// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
					color: '#292A2E',
				},
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'[data-prosemirror-node-name="status"] > [data-color=neutral] > .lozenge-wrapper': {
					// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
					backgroundColor: '#DDDEE1',
				},
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'[data-prosemirror-node-name="status"] > [data-color=purple] > .lozenge-wrapper': {
					// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
					backgroundColor: '#D8A0F7',
				},
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'[data-prosemirror-node-name="status"] > [data-color=blue] > .lozenge-wrapper': {
					// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
					backgroundColor: '#8FB8F6',
				},
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'[data-prosemirror-node-name="status"] > [data-color=yellow] > .lozenge-wrapper': {
					// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
					backgroundColor: '#F9C84E',
				},
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'[data-prosemirror-node-name="status"] > [data-color=red] > .lozenge-wrapper': {
					// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
					backgroundColor: '#FD9891',
				},
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'[data-prosemirror-node-name="status"] > [data-color=green] > .lozenge-wrapper': {
					// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
					backgroundColor: '#B3DF72',
				},
			})
		: css({
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'[data-prosemirror-node-name="status"] > [data-color=neutral] .lozenge-wrapper': {
					backgroundColor: token('color.background.neutral'),
				},
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'[data-prosemirror-node-name="status"] > [data-color=neutral] .lozenge-text': {
					color: token('color.text.subtle'),
				},
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'[data-prosemirror-node-name="status"] > [data-color=purple] .lozenge-wrapper': {
					backgroundColor: token('color.background.discovery'),
				},
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'[data-prosemirror-node-name="status"] > [data-color=purple] .lozenge-text': {
					color: token('color.text.discovery'),
				},
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'[data-prosemirror-node-name="status"] > [data-color=blue] .lozenge-wrapper': {
					backgroundColor: token('color.background.information'),
				},
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'[data-prosemirror-node-name="status"] > [data-color=blue] .lozenge-text': {
					color: token('color.text.information'),
				},
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'[data-prosemirror-node-name="status"] > [data-color=yellow] .lozenge-wrapper': {
					backgroundColor: token('color.background.warning'),
				},
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'[data-prosemirror-node-name="status"] > [data-color=yellow] .lozenge-text': {
					color: token('color.text.warning'),
				},
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'[data-prosemirror-node-name="status"] > [data-color=red] .lozenge-wrapper': {
					backgroundColor: token('color.background.danger'),
				},
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'[data-prosemirror-node-name="status"] > [data-color=red] .lozenge-text': {
					color: token('color.text.danger'),
				},
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'[data-prosemirror-node-name="status"] > [data-color=green] .lozenge-wrapper': {
					backgroundColor: token('color.background.success'),
				},
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'[data-prosemirror-node-name="status"] > [data-color=green] .lozenge-text': {
					color: token('color.text.success'),
				},
			});

const baseStatusStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-name="status"] .lozenge-wrapper': {
		backgroundColor: token('color.background.neutral'),
		maxWidth: '100%',
		paddingInline: token('space.050'),
		display: 'inline-flex',
		// eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
		borderRadius: token('radius.small', '3px'),
		blockSize: 'min-content',
		position: 'static',
		overflow: 'hidden',
		boxSizing: 'border-box',
		appearance: 'none',
		border: 'none',
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-name="status"] .lozenge-text': {
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		fontSize: '11px',
		fontStyle: 'normal',
		fontFamily: token('font.family.body'),
		fontWeight: token('font.weight.bold'),
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		lineHeight: '16px',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		textTransform: 'uppercase',
		whiteSpace: 'nowrap',
		maxWidth: `calc(200px - ${token('space.100', '8px')})`,
	},
});

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const statusNodeStyles: () => SerializedStyles = () => css`
	${baseStatusStyles}
	${getStatusColors()}
`;

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const statusStyles: () => SerializedStyles = () => css`
	.${TableSharedCssClassName.TABLE_CELL_WRAPPER},
		.${TableSharedCssClassName.TABLE_HEADER_CELL_WRAPPER},
		[data-layout-section] {
		.${StatusSharedCssClassName.STATUS_CONTAINER} {
			max-width: 100%;
			line-height: 0;

			> span {
				width: 100%;
			}
		}
	}

	.${StatusSharedCssClassName.STATUS_CONTAINER} {
		> span {
			cursor: pointer;
			line-height: 0; /* Prevent responsive layouts increasing height of container. */
		}

		${getVisualRefreshStatusStyles()}
	}

	.danger {
		.${StatusSharedCssClassName.STATUS_LOZENGE} > span {
			background-color: ${akEditorDeleteBackgroundWithOpacity};
		}

		.${StatusSharedCssClassName.STATUS_CONTAINER}.${akEditorSelectedNodeClassName}
			.${StatusSharedCssClassName.STATUS_LOZENGE}
			> span {
			box-shadow: 0 0 0 ${akEditorSelectedBorderSize}px ${akEditorDeleteBorder};
		}
	}
`;
