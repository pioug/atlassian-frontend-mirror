import { css } from '@emotion/react';

import { N60A } from '@atlaskit/theme/colors';
import { borderRadius } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

export const dropdown = css({
	display: 'flex',
	flexDirection: 'column',
	background: token('elevation.surface.overlay', 'white'),
	borderRadius: `${borderRadius()}px`,
	boxShadow: token('elevation.shadow.overlay', `0 4px 8px -2px ${N60A}, 0 0 1px ${N60A}`),
	boxSizing: 'border-box',
	padding: `${token('space.050', '4px')} 0`,
});
