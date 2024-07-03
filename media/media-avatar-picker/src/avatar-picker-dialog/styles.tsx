import { token } from '@atlaskit/tokens';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const avatarPickerErrorStyles = css({
	margin: `0 ${token('space.200', '16px')} ${token('space.200', '16px')}`,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const formStyles = css({
	margin: 0,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const avatarPickerViewWrapperStyles = css({
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'flex-start',
	textAlign: 'center',
	minHeight: '339px',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const modalHeaderStyles = css({
	// Using `&` twice to increase specificity
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&&': {
		margin: token('space.200', '16px'),
		fontWeight: 500,
		fontSize: '20px',
	},
});
