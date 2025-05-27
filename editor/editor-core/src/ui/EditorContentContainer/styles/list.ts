// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { css } from '@emotion/react';

import { token } from '@atlaskit/tokens';

// copied from packages/editor/editor-shared-styles/src/consts/consts.ts
const akEditorLineHeight = 1.714;
// copied from packages/editor/editor-common/src/styles/shared/smart-card.ts
const BLOCK_CARD_CONTAINER = 'blockCardView-content-wrap';

// copied from packages/editor/editor-shared-styles/src/consts/consts.ts
const blockNodesVerticalMargin = '0.75rem';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const listsStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.ProseMirror li': {
		position: 'relative',

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
		'& > p:not(:first-child)': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
			margin: `${token('space.050', '4px')} 0 0 0`,
		},

		/* In SSR the above rule will apply to all p tags because first-child would be a style tag.
			The following rule resets the first p tag back to its original margin
			defined in packages/editor/editor-common/src/styles/shared/paragraph.ts */
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
		'& > style:first-child + p': {
			marginTop: blockNodesVerticalMargin,
		},
	},
});

/* This prevents https://product-fabric.atlassian.net/browse/ED-20924 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const listsStylesSafariFix = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
	[`.ProseMirror:not(.${BLOCK_CARD_CONTAINER}) > li::before`]: {
		content: '" "',
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography, @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
		lineHeight: akEditorLineHeight,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
	[`.ProseMirror:not(.${BLOCK_CARD_CONTAINER}) > li > p:first-child, .ProseMirror:not(.${BLOCK_CARD_CONTAINER}) > li > .code-block:first-child, .ProseMirror:not(.${BLOCK_CARD_CONTAINER}) > li > .ProseMirror-gapcursor:first-child + .code-block`]:
		{
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles, @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			marginTop: `-${akEditorLineHeight}em !important`,
		},
});
