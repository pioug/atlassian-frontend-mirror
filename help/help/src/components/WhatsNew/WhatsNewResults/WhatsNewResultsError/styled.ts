/** @jsx jsx */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';
import * as colors from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

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
