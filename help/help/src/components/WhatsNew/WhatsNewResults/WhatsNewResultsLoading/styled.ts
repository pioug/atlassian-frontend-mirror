/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';
import { token } from '@atlaskit/tokens';

/**
 * Loading styled-components
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const LoadignWhatsNewResultsList = styled.ul({
	width: '100%',
	margin: 0,
	padding: 0,
	boxSizing: 'border-box',
	marginTop: token('space.200', '16px'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const LoadignWhatsNewResultsListItem = styled.li({
	display: 'block',
	width: '100%',
	padding: token('space.100', '8px'),
	margin: 0,
	boxSizing: 'border-box',
});
