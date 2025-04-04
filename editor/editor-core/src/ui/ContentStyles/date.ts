// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';

import { DateSharedCssClassName } from '@atlaskit/editor-common/styles';
import {
	akEditorDeleteBorder,
	akEditorSelectedBorderSize,
	akEditorSelectedNodeClassName,
	getSelectionStyles,
	SelectionStyle,
} from '@atlaskit/editor-shared-styles';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const dateVanillaStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	"[data-prosemirror-node-view-type='vanilla'][data-prosemirror-node-name='date']": {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.date-lozenger-container': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			span: {
				backgroundColor: token('color.background.neutral'),
				color: token('color.text'),
				borderRadius: token('border.radius.100'),
				padding: `${token('space.025')} ${token('space.050')}`,
				margin: '0 1px',
				position: 'relative',
				transition: 'background 0.3s',
				whiteSpace: 'nowrap',
				cursor: 'unset',
				'&:hover': {
					backgroundColor: token('color.background.neutral.hovered'),
				},
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'&.date-node-color-red': {
					backgroundColor: token('color.background.accent.red.subtlest'),
					color: token('color.text.accent.red'),
					'&:hover': {
						backgroundColor: token('color.background.accent.red.subtler'),
					},
				},
			},
		},
	},
});

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const dateStyles = css`
	.${DateSharedCssClassName.DATE_CONTAINER} {
		.${DateSharedCssClassName.DATE_WRAPPER} {
			line-height: initial;
			cursor: pointer;
		}

		&.${akEditorSelectedNodeClassName} {
			.${DateSharedCssClassName.DATE_WRAPPER} > span {
				${getSelectionStyles([SelectionStyle.BoxShadow])}
			}
		}
	}

	.danger {
		.${DateSharedCssClassName.DATE_CONTAINER}.${akEditorSelectedNodeClassName}
			.${DateSharedCssClassName.DATE_WRAPPER}
			> span {
			box-shadow: 0 0 0 ${akEditorSelectedBorderSize}px
				${token('color.border.danger', akEditorDeleteBorder)};
		}
	}
`;
