// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { css, type SerializedStyles } from '@emotion/react';

import { akEditorGutterPadding } from '@atlaskit/editor-shared-styles';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const syncBlockStyles: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.ak-editor-sync-block': {
			position: 'relative',
			cursor: 'pointer',

			/* Danger when top level node */
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'&.danger': {
				boxShadow: `0 0 0 1px ${token('color.border.danger')}`,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
				backgroundColor: `${token('color.background.danger')} !important`,

				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'.ak-editor-panel__icon': {
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
					color: `${token('color.icon.danger')} !important`,
				},

				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'.ak-editor-sync-block__label': {
					color: token('color.icon.danger'),
					backgroundColor: token('color.background.danger.hovered'),
				},
			},

			borderRadius: token('radius.small', '3px'),
			marginTop: token('space.150', '12px'),
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			marginRight: `-${akEditorGutterPadding}px`,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			marginLeft: `-${akEditorGutterPadding}px`,
			marginBottom: 0,
			paddingTop: token('space.050', '4px'),
			paddingBottom: token('space.050', '4px'),

			color: 'inherit',

			'&:hover': {
				// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
				boxShadow: `0px 0px 0px 1px ${token('color.border.accent.purple')}`,
			},

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'.ak-editor-sync-block__editor': {
				cursor: 'text',
			},

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'.ak-editor-sync-block__renderer': {
				padding: '0 32px',
			},
		},
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
	'.ak-editor-sync-block.ak-editor-selected-node:not(.danger)': {
		boxShadow: `0 0 0 1px ${token('color.border.accent.purple')}`,
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ak-editor-sync-block.ak-editor-selected-node': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.ak-editor-sync-block__label': {
			display: 'unset',
		},
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ak-editor-sync-block__label': {
		color: token('color.text.accent.purple'),
		borderRadius: token('radius.small', '3px'),
		position: 'absolute',
		display: 'none',

		paddingLeft: token('space.100', '8px'),
		paddingRight: token('space.100', '8px'),
		paddingBottom: token('space.050', '4px'),
		paddingTop: token('space.050', '4px'),

		// height of label (32px) + space between sync block and label (4px) = 36px
		top: '-36px',
		right: '0px',
		backgroundColor: token('color.background.accent.purple.subtlest'),
	},
});
