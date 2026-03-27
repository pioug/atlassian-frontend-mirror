/* eslint-disable @atlaskit/ui-styling-standard/use-compiled */
import { css } from '@emotion/react';
import type { SerializedStyles } from '@emotion/react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const fontSizeStyles: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.fabric-editor-font-size': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			"&[data-font-size='small']": {
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
				font: 'var(--editor-font-ugc-token-body-small)',
			},
		},

		// Apply font-size to the ::marker pseudo-element of list items that have a font-size mark.
		// Targeting ::marker directly avoids setting font on the <li> itself, which would cascade
		// into nested lists and compound the sizing at each nesting level.
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
		"li:has(> .fabric-editor-font-size[data-font-size='small'])::marker": {
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			font: 'var(--editor-font-ugc-token-body-small)',
		},

		// For blockTaskItem nodes: propagate font-size to the task container so the
		// checkbox and layout align with the content size. Reset on the inner mark to avoid
		// double-applying.
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
		"[data-prosemirror-node-name='blockTaskItem']:has(.fabric-editor-font-size[data-font-size='small'])":
			{
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
				font: 'var(--editor-font-ugc-token-body-small)',

				// Reset the inner block mark so the font value is not applied twice
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'.fabric-editor-font-size': {
					font: 'inherit',
				},
			},
	},
});
