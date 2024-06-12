/** @jsx jsx */
import styled from '@emotion/styled';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const SearchInputContainer = styled.div({
	order: 0,
	flex: '0 1 auto',
	alignSelf: 'auto',
	width: '100%',
	boxSizing: 'border-box',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const SearchIconContainer = styled.div({
	width: token('space.300', '24px'),
	height: token('space.300', '24px'),
	paddingLeft: token('space.050', '4px'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& > span': {
		paddingLeft: token('space.050', '4px'),
		height: token('space.300', '24px'),
		width: token('space.300', '24px'),
		boxSizing: 'border-box',
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const CloseButtonAndSpinnerContainer = styled.div({
	fontSize: 0,
	paddingRight: token('space.100', '8px'),
	position: 'relative',
	whiteSpace: 'nowrap',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& > span': {
		paddingRight: token('space.050', '4px'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& > button, & > span': {
		display: 'inline-block',
		verticalAlign: 'middle',
	},
});
