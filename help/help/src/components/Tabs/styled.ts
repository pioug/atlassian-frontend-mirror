/**
 * @jsxRuntime classic
 * @jsx jsx
 */

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const TabContainer = styled.div({
	width: '100%',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const TabLabels = styled.div({
	display: 'flex',
	justifyContent: 'space-between',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/ui-styling-standard/no-dynamic-styles -- Ignored via go/DSP-18766
export const TabLabel = styled.div<{ isActive: boolean }>(({ isActive }) => ({
	flex: 1,
	padding: token('space.150', '12px'),
	textAlign: 'center',
	cursor: 'pointer',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
	color: isActive ? token('color.text.selected') : token('color.text'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
	borderBottom: isActive
		? `1px solid ${token('color.text.selected')}`
		: `1px solid ${token('color.text.disabled')}`,
}));
