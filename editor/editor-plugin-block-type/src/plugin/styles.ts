// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';

import {
	blockquoteSharedStyles,
	blockquoteSharedStylesNew,
	headingsSharedStyles,
} from '@atlaskit/editor-common/styles';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- Imports are not safe in an object syntax
export const blocktypeStyles = () => css`
	.ProseMirror {
		${editorExperiment('nested-dnd', true) ? blockquoteSharedStylesNew : blockquoteSharedStyles};
		${headingsSharedStyles()};
	}
`;
