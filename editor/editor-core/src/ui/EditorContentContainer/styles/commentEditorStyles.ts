// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { css } from '@emotion/react';

import { token } from '@atlaskit/tokens';

const CommentEditorMargin = 14;
const GRID_GUTTER = 12;

// Originally copied from packages/editor/editor-core/src/ui/Appearance/Comment/Comment.tsx
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const commentEditorStyles = css({
	flexGrow: 1,
	overflowX: 'clip',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	lineHeight: '24px',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.ProseMirror': {
		margin: token('space.150', '12px'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.gridParent': {
		marginLeft: token('space.025', '2px'),
		marginRight: token('space.025', '2px'),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		width: `calc(100% + ${CommentEditorMargin - GRID_GUTTER}px)`,
	},
	padding: token('space.250', '20px'),
});
