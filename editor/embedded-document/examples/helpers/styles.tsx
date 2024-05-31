import styled from 'styled-components';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const Container = styled.div({
	padding: `0 ${token('space.250', '20px')}`,
	background: '#fff',
	boxSizing: 'border-box',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const Toolbar = styled.div({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'flex-end',
	padding: `0 ${token('space.250', '20px')}`,
	height: token('space.1000', '80px'),
});
