// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';

import { N200, N40, N50A, N60A } from '@atlaskit/theme/colors';
import { layers } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const AutocompleteContainer = styled.div<{ isOpen: boolean }>(
	{
		position: 'absolute',
		backgroundColor: token('elevation.surface.overlay', 'white'),
		borderRadius: token('border.radius.100', '3px'),
		willChange: 'top, left',
		zIndex: layers.dialog(),
		boxShadow: token('elevation.shadow.overlay', `0 4px 8px -2px ${N50A}, 0 0 1px ${N60A}`),
		padding: `${token('space.075', '6px')} ${token('space.0', '0')}`,
		minWidth: '200px',
		maxWidth: '400px',
		'&:focus': {
			outline: 'none',
		},
		marginLeft: token('space.negative.100', '-8px'),
		marginTop: token('space.200', '16px'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-dynamic-styles, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	({ isOpen }) => (isOpen ? css({ visibility: 'visible' }) : css({ visibility: 'hidden' })),
);

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const AutocompleteOptionsContainer = styled.div({
	maxHeight: '288px',
	overflow: 'auto',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const OptionList = styled.ul({
	listStyle: 'none',
	margin: `${token('space.0', '0')}`,
	padding: `${token('space.0', '0')}`,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const AutocompleteLoadingFooter = styled.div<{ hasOptions: boolean }>(
	{
		display: 'flex',
		justifyContent: 'center',
		color: token('color.text.subtlest', N200),
		fontStyle: 'italic',
		padding: token('space.150', '12px'),
		textAlign: 'center',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-dynamic-styles -- Ignored via go/DSP-18766
	({ hasOptions }) =>
		hasOptions && {
			borderTop: `solid 1px ${token('color.border', N40)}`,
			marginTop: token('space.075', '6px'),
			paddingTop: token('space.250', '20px'),
		},
);
