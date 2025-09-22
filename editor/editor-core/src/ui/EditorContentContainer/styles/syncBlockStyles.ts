// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { css, type SerializedStyles } from '@emotion/react';

import { akEditorGutterPaddingDynamic } from '@atlaskit/editor-shared-styles';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const syncBlockStyles: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.ak-editor-sync-block': {
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
			},

			// borderRadius: token('radius.small', '3px'),
			marginTop: token('space.150', '12px'),
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			marginRight: `-${akEditorGutterPaddingDynamic()}px`,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			marginLeft: `-${akEditorGutterPaddingDynamic()}px`,
			marginBottom: 0,
			paddingTop: 0,
			paddingBottom: 0,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			paddingRight: `${akEditorGutterPaddingDynamic() - 32}px`,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			paddingLeft: `${akEditorGutterPaddingDynamic() - 32}px`,

			color: 'inherit',

			'&:hover': {
				// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
				boxShadow: `0px 0px 0px 1px ${token('color.background.accent.purple.subtle')}`,
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
		boxShadow: `0 0 0 1px ${token('color.background.accent.purple.bolder')}`,
		borderColor: 'transparent',
	},
});
