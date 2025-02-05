/**
 * @jsxRuntime classic
 * @jsx jsx
 */

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const ArticleContainer = styled.div({
	padding: `${token('space.200', '16px')} ${token('space.300', '24px')}`,
	position: 'absolute',
	height: '100%',
	width: '100%',
	top: 0,
	backgroundColor: token('elevation.surface', '#FFFFFF'),
	left: '100%',
	flex: 1,
	flexDirection: 'column',
	boxSizing: 'border-box',
	overflowX: 'hidden',
	overflowY: 'auto',
	zIndex: 2,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const ArticleContainerAi = styled.div({
	paddingLeft: token('space.300', '24px'),
	paddingRight: token('space.300', '24px'),
	paddingBottom: token('space.200', '16px'),
	position: 'absolute',
	height: `calc(100% - ${token('space.800', '60px')})`,
	width: '100%',
	top: token('space.800', '60px'),
	backgroundColor: token('elevation.surface', '#FFFFFF'),
	left: '100%',
	flex: 1,
	flexDirection: 'column',
	boxSizing: 'border-box',
	overflowX: 'hidden',
	overflowY: 'auto',
	zIndex: 2,
});
