/* eslint-disable @atlaskit/ui-styling-standard/use-compiled,
	@repo/internal/deprecations/deprecation-ticket-required,
	@atlaskit/ui-styling-standard/no-exported-styles */
import { css } from '@emotion/react';
import type { SerializedStyles } from '@emotion/react';

import { token } from '@atlaskit/tokens';

const CommentEditorMargin = 14;
const GRID_GUTTER = 12;

// Originally copied from packages/editor/editor-core/src/ui/Appearance/Comment/Comment.tsx
/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 */
export const commentEditorStyles: SerializedStyles = css({
	flexGrow: 1,
	overflowX: 'clip',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	lineHeight: '24px',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.ProseMirror': {
		margin: token('space.150'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.gridParent': {
		marginLeft: token('space.025'),
		marginRight: token('space.025'),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		width: `calc(100% + ${CommentEditorMargin - GRID_GUTTER}px)`,
	},
	padding: token('space.250'),
});
