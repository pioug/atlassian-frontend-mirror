// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';

import {
	blockquoteSharedStyles,
	blockquoteSharedStylesNew,
	headingsSharedStyles,
} from '@atlaskit/editor-common/styles';
import { fg } from '@atlaskit/platform-feature-flags';

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- Imports are not safe in an object syntax
export const blocktypeStyles = () => css`
	.ProseMirror {
		${fg('platform_editor_element_padding_changes_gate')
			? blockquoteSharedStylesNew
			: blockquoteSharedStyles};
		${headingsSharedStyles()};
	}
`;
