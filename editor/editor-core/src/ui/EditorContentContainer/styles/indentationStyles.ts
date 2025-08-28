// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { css, type SerializedStyles } from '@emotion/react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const indentationStyles: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'.fabric-editor-indentation-mark': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
			"&[data-level='1']": {
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
				marginLeft: 30,
			},

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
			"&[data-level='2']": {
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
				marginLeft: 60,
			},

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
			"&[data-level='3']": {
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
				marginLeft: 90,
			},

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
			"&[data-level='4']": {
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
				marginLeft: 120,
			},

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
			"&[data-level='5']": {
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
				marginLeft: 150,
			},

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
			"&[data-level='6']": {
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
				marginLeft: 180,
			},
		},
	},
});
