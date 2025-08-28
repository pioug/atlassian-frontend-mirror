// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { css, type SerializedStyles } from '@emotion/react';

import { token } from '@atlaskit/tokens';

// Make sure the first floating toolbar button has focus ring when focused via .focus()
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const firstFloatingToolbarButtonStyles: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'button.first-floating-toolbar-button:focus': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		outline: `2px solid ${token('color.border.focused')}`,
	},
});
