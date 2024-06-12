import { css } from '@emotion/react';

import { getCodeStyles } from '@atlaskit/code/inline';
import { N30A } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

export const codeMarkSharedStyles = () => {
	return css({
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'.code': {
			'--ds--code--bg-color': token('color.background.neutral', N30A),
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			...getCodeStyles(),
		},
	});
};
