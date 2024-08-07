// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import { TEXT_HIGHLIGHT_CLASS } from '../pm-plugins/constants';

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const textHighlightStyle = css`
	.${TEXT_HIGHLIGHT_CLASS} {
		background-color: ${token('color.background.accent.blue.subtlest', '#E9F2FF')};

		border-bottom: 2px solid ${token('color.background.accent.blue.subtler', '#cce0ff')};
	}
`;
