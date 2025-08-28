// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { css, type SerializedStyles } from '@emotion/react';

import { akEditorSelectedNodeClassName } from '@atlaskit/editor-shared-styles';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const ruleStyles: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror hr': {
		border: 'none',
		backgroundColor: token('color.border'),
		height: '2px',
		borderRadius: '1px',
		cursor: 'pointer',
		padding: `${token('space.050', '4px')} 0`,
		margin: `${token('space.300', '24px')} 0`,
		backgroundClip: 'content-box',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
	[`.ProseMirror hr.${akEditorSelectedNodeClassName}`]: {
		outline: 'none',
		backgroundColor: token('color.border.selected'),
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const dangerRuleStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
	[`.ProseMirror hr.${akEditorSelectedNodeClassName}.danger`]: {
		backgroundColor: token('color.border.danger'),
	},
});
