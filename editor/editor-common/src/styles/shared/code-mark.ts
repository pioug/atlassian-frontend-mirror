// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';

import { getCodeStyles } from '@atlaskit/code/inline';
import { token } from '@atlaskit/tokens';

export const codeMarkSharedStyles = () => {
	return css({
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'.code': {
			'--ds--code--bg-color': token('color.background.neutral'),
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			...getCodeStyles(),
		},
	});
};
