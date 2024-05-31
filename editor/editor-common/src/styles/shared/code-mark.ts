import { css } from '@emotion/react';

import { getCodeStyles } from '@atlaskit/code/inline';
import { N30A } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

export const codeMarkSharedStyles = () => {
	return css({
		'.code': {
			'--ds--code--bg-color': token('color.background.neutral', N30A),
			...getCodeStyles(),
		},
	});
};
