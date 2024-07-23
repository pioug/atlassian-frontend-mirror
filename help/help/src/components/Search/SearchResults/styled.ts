/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';
import * as colors from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const SearchResultsContainer = styled.div({
	position: 'absolute',
	height: '100%',
	width: '100%',
	top: 0,
	backgroundColor: token('elevation.surface', '#FFFFFF'),
	flex: 1,
	flexDirection: 'column',
	boxSizing: 'border-box',
	overflowX: 'hidden',
	overflowY: 'auto',
	zIndex: 10,
	padding: `0 ${token('space.200', '16px')}`,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const SearchResultsList = styled.div({
	paddingTop: token('space.300', '24px'),
	position: 'relative',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const SearchResultEmptyMessageImage = styled.div({
	padding: `${token('space.300', '24px')} ${token(
		'space.300',
		'24px',
	)} 0 ${token('space.300', '24px')}`,
	textAlign: 'center',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const SearchResultEmptyMessageText = styled.div({
	padding: `${token('space.300', '24px')} ${token(
		'space.300',
		'24px',
	)} 0 ${token('space.300', '24px')}`,
	textAlign: 'center',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	p: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		color: token('color.text.subtlest', colors.N200),
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const SearchResultSearchExternalSiteContainer = styled.div({
	padding: token('space.300', '24px'),
	textAlign: 'center',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	p: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		color: token('color.text.subtlest', colors.N200),
	},
});
