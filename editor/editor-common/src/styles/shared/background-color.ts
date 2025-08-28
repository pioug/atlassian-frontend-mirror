// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';

import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const backgroundColorStyles = () => {
	return css({
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'.fabric-background-color-mark': {
			backgroundColor: 'var(--custom-palette-color, inherit)',
			borderRadius: token('radius.xsmall'),
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
			paddingTop: '1px',
			paddingBottom: token('space.025'),
			boxDecorationBreak: 'clone',
		},
		// Don't show text highlight styling when there is a hyperlink
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'a .fabric-background-color-mark': {
			backgroundColor: 'unset',
		},
		// Don't show text highlight styling when there is an inline comment
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'.fabric-background-color-mark .ak-editor-annotation': {
			backgroundColor: 'unset',
		},
	});
};
