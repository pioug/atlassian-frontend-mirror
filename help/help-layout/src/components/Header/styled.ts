/** @jsx jsx */
import styled from '@emotion/styled';
import * as colors from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const HeaderContainer = styled.div({
	backgroundColor: token('color.background.neutral', colors.N10),
	borderBottom: `${token('space.025', '2px')} solid ${token('color.border', colors.N30)}`,
	justifyContent: 'space-between',
	position: 'relative',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const CloseButtonContainer = styled.div({
	position: 'absolute',
	right: token('space.100', '8px'),
	top: token('space.150', '12px'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const BackButtonContainer = styled.div({
	position: 'absolute',
	top: token('space.150', '12px'),
	left: token('space.100', '8px'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const HeaderTitle = styled.h2({
	color: token('color.text.subtle', colors.N500),
	textAlign: 'center',
	fontSize: '1rem',
	fontWeight: 600,
	lineHeight: token('space.800', '56px'),
	width: '100%',
	whiteSpace: 'nowrap',
	textOverflow: 'ellipsis',
	display: 'inline-block',
	overflow: 'hidden',
	verticalAlign: 'middle',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const HeaderContent = styled.div({
	padding: `0 ${token('space.200', '16px')} ${token('space.200', '16px')} ${token(
		'space.200',
		'16px',
	)}`,
});
