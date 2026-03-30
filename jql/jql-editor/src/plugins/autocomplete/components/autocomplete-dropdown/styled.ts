// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';

import { layers } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const AutocompleteContainer = styled.div<{
	isOpen: boolean;
	usePopper?: boolean;
}>(
	{
		position: 'absolute',
		backgroundColor: token('elevation.surface.overlay'),
		borderRadius: token('radius.small', '3px'),
		willChange: 'top, left',
		zIndex: layers.dialog(),
		boxShadow: token('elevation.shadow.overlay'),
		padding: `${token('space.075')} ${token('space.0')}`,
		minWidth: '200px',
		maxWidth: '400px',
		'&:focus': {
			outline: 'none',
		},
		marginLeft: token('space.negative.100'),
		marginTop: token('space.200'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-dynamic-styles, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	({ isOpen }) => (isOpen ? { visibility: 'visible' } : { visibility: 'hidden' }),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-dynamic-styles, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	({ usePopper }) =>
		usePopper && {
			marginTop: token('space.100'),
		},
);

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const AutocompleteOptionsContainer = styled.div({
	maxHeight: '288px',
	overflow: 'auto',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const OptionList = styled.ul({
	listStyle: 'none',
	margin: `${token('space.0')}`,
	padding: `${token('space.0')}`,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const AutocompleteLoadingFooter = styled.div<{ hasOptions: boolean }>(
	{
		display: 'flex',
		justifyContent: 'center',
		color: token('color.text.subtlest'),
		fontStyle: 'italic',
		padding: token('space.150'),
		textAlign: 'center',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-dynamic-styles -- Ignored via go/DSP-18766
	({ hasOptions }) =>
		hasOptions && {
			borderTop: `solid ${token('border.width')} ${token('color.border')}`,
			marginTop: token('space.075'),
			paddingTop: token('space.250'),
		},
);
