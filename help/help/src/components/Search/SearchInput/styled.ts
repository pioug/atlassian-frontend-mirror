/** @jsx jsx */
import styled from '@emotion/styled';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const SearchInputContainer = styled.div({
	order: 0,
	flex: '0 1 auto',
	alignSelf: 'auto',
	width: '100%',
	boxSizing: 'border-box',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const SearchIconContainer = styled.div({
	width: token('space.300', '24px'),
	height: token('space.300', '24px'),
	paddingLeft: token('space.050', '4px'),
	'& > span': {
		paddingLeft: token('space.050', '4px'),
		height: token('space.300', '24px'),
		width: token('space.300', '24px'),
		boxSizing: 'border-box',
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const CloseButtonAndSpinnerContainer = styled.div({
	fontSize: 0,
	paddingRight: token('space.100', '8px'),
	position: 'relative',
	whiteSpace: 'nowrap',
	'& > span': {
		paddingRight: token('space.050', '4px'),
	},
	'& > button, & > span': {
		display: 'inline-block',
		verticalAlign: 'middle',
	},
});
