/* eslint-disable @atlaskit/design-system/no-css-tagged-template-expression */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';

import { blockquoteSharedStyles, headingsSharedStyles } from '@atlaskit/editor-common/styles';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- Imports are not safe in an object syntax
export const blocktypeStyles = (
	typographyTheme?:
		| 'typography'
		| 'typography-adg3'
		| 'typography-modernized'
		| 'typography-refreshed',
) => css`
	.ProseMirror {
		${blockquoteSharedStyles};
		${headingsSharedStyles(typographyTheme)};
	}

	${editorExperiment('nested-dnd', true) &&
	`.ak-editor-content-area.appearance-full-page .ProseMirror blockquote {
		padding-left: ${token('space.250', '20px')};
	}

	/* Don't want extra padding for inline editor (nested) */
	.ak-editor-content-area .ak-editor-content-area .ProseMirror blockquote {
		padding-left: ${token('space.200', '16px')};
	}`}
`;
