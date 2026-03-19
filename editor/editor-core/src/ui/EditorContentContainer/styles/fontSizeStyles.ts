// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { css, type SerializedStyles } from '@emotion/react';

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
	},
});
