/* eslint-disable @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766 */
import { styled, type StyledProps } from '@compiled/react';
import { token } from '@atlaskit/tokens';
import type { ComponentType, ClassAttributes, HTMLAttributes } from 'react';

export const FooterOuter: ComponentType<ClassAttributes<HTMLDivElement> & HTMLAttributes<HTMLDivElement> & StyledProps> = styled.div({
	display: 'flex',
	width: '100%',
	maxWidth: '640px',
	'@media screen and (max-width: 640px)': {
		justifyContent: 'space-evenly',
		paddingBottom: token('space.300'),
		alignItems: 'center',
	},
	justifyContent: 'space-between',
	marginTop: token('space.400'),
});
