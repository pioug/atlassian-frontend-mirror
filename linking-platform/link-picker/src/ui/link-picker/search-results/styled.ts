import { css } from '@emotion/react';

import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const tabsWrapperStyles = css({
	marginTop: token('space.150', '12px'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const spinnerContainerStyles = css({
	minHeight: '80px',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	alignSelf: 'center',
	flexGrow: 1,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const flexColumnStyles = css({
	display: 'flex',
	flexDirection: 'column',
});
