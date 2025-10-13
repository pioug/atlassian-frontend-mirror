// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { css, type SerializedStyles } from '@emotion/react';

import { token } from '@atlaskit/tokens';

const blockNodesVerticalMargin = '0.75rem';
const scaledBlockNodesVerticalMargin = '0.75em';

// When cleaning up `platform_editor_content_mode_button_mvp` simplify the name/ use the other paragraph style name
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const paragraphStylesWithScaledMargin: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.ProseMirror p': {
		// The `editor.font.body` token is used for the UGC typography theme.
		// We don't use `editorUGCToken('editor.font.body')` here because we want to build this styles statically.
		// See platform/packages/editor/editor-common/src/ugc-tokens/get-editor-ugc-token.tsx
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		font: 'normal 400 1em/1.714 "Atlassian Sans", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
		marginTop: scaledBlockNodesVerticalMargin,
		marginBottom: 0,
	},
});

// When cleaning up `platform_editor_content_mode_button_mvp` simplify the name/ use the other paragraph style name
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const paragraphStylesOldWithScaledMargin: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.ProseMirror p': {
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		fontSize: '1em',
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		lineHeight: 1.714,
		fontWeight: token('font.weight.regular'),
		marginTop: scaledBlockNodesVerticalMargin,
		marginBottom: 0,
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		letterSpacing: '-0.005em',
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const paragraphStylesUGCRefreshed: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.ProseMirror p': {
		// The `editor.font.body` token is used for the UGC typography theme.
		// We don't use `editorUGCToken('editor.font.body')` here because we want to build this styles statically.
		// See platform/packages/editor/editor-common/src/ugc-tokens/get-editor-ugc-token.tsx
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		font: 'normal 400 1em/1.714 "Atlassian Sans", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
		marginTop: blockNodesVerticalMargin,
		marginBottom: 0,
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const paragraphStylesUGCModernized: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.ProseMirror p': {
		// The `editor.font.body` token is used for the UGC typography theme.
		// We don't use `editorUGCToken('editor.font.body')` here because we want to build this styles statically.
		// See platform/packages/editor/editor-common/src/ugc-tokens/get-editor-ugc-token.tsx
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		font: 'normal 400 1em/1.714 ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
		marginTop: blockNodesVerticalMargin,
		marginBottom: 0,
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const paragraphStylesOld: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.ProseMirror p': {
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		fontSize: '1em',
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		lineHeight: 1.714,
		fontWeight: token('font.weight.regular'),
		marginTop: blockNodesVerticalMargin,
		marginBottom: 0,
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		letterSpacing: '-0.005em',
	},
});
