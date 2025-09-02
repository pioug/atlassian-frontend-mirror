// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, type SerializedStyles } from '@emotion/react';

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
export const dateNodeStyles: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	"[data-prosemirror-node-name='date'] .date-lozenger-container span": {
		backgroundColor: token('color.background.neutral'),
		color: token('color.text'),
		borderRadius: token('radius.small'),
		padding: `${token('space.025')} ${token('space.050')}`,
		margin: '0 1px',
		position: 'relative',
		transition: 'background 0.3s',
		whiteSpace: 'nowrap',
		cursor: 'unset',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	"[data-prosemirror-node-name='date'] .date-lozenger-container span:hover": {
		backgroundColor: token('color.background.neutral.hovered'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	"[data-prosemirror-node-name='date'] .date-lozenger-container span.date-node-color-red": {
		backgroundColor: token('color.background.accent.red.subtlest'),
		color: token('color.text.accent.red'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	"[data-prosemirror-node-name='date'] .date-lozenger-container span.date-node-color-red:hover": {
		backgroundColor: token('color.background.accent.red.subtler'),
	},
});

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const dateStyles: SerializedStyles = css`
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
