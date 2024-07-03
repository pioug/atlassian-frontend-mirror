import { token } from '@atlaskit/tokens';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';
import {
	visuallyHiddenRadioStyles,
	selectedShadow,
	focusedShadow,
	avatarImageStyles,
} from '../styles';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
export const largeAvatarImageStyles = css(avatarImageStyles, {
	width: '72px',
	height: '72px',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const predefinedAvatarViewWrapperStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.body': {
		display: 'flex',
		flexFlow: 'row wrap',
		width: '353px',
		maxHeight: '294px',
		overflowY: 'auto',
		padding: `${token('space.100', '8px')} 0 0`,
		margin: 0,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	input: visuallyHiddenRadioStyles,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	'input:checked + img': selectedShadow,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	'input:focus + img': focusedShadow,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	label: {
		paddingRight: token('space.050', '4px'),
		paddingLeft: token('space.050', '4px'),
		paddingBottom: token('space.100', '8px'),
		display: 'inline-flex',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.header': {
		display: 'flex',
		alignItems: 'center',
		paddingTop: token('space.050', '4px'),
		paddingBottom: token('space.100', '8px'),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'.description': {
			paddingLeft: token('space.100', '8px'),
			margin: 0,
			fontSize: '14px',
			fontWeight: 400,
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'.back-button': {
			width: '32px',
			height: '32px',
			borderRadius: token('border.radius.400', '16px'),
			alignItems: 'center',
			justifyContent: 'center',
			margin: 0,
			padding: 0,
		},
	},
});
