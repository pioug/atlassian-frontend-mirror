import { css } from '@emotion/react';

import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const colorPaletteWrapper = css({
	padding: `0 ${token('space.100', '8px')}`,
	/* Firefox bug fix: https://product-fabric.atlassian.net/browse/ED-1789 */
	display: 'flex',
});
