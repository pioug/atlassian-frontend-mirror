/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
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
export const SearchInputContainerAi = styled.div({
	width: `calc(100% - ${token('space.300', '24px')} - ${token('space.300', '24px')})`,
	height: token('space.400', '32px'),
	marginLeft: token('space.300', '24px'),
	marginRight: token('space.300', '24px'),
	marginTop: token('space.200', '14px'),
	marginBottom: token('space.200', '14px'),
	order: 0,
	flex: '0 1 auto',
	alignSelf: 'auto',
	boxSizing: 'border-box',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const SearchIconContainer = styled.div({
	width: token('space.300', '24px'),
	height: token('space.300', '24px'),
	paddingLeft: token('space.050', '4px'),
	marginLeft: token('space.negative.025', '-2px'),
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
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
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
