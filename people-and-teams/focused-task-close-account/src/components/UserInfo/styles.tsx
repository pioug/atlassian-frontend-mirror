/* eslint-disable @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766 */
import { styled, type StyledProps } from '@compiled/react';
import { token } from '@atlaskit/tokens';
import type { ComponentType, ClassAttributes, HTMLAttributes } from 'react';

export const UserInfoOuter: ComponentType<ClassAttributes<HTMLDivElement> & HTMLAttributes<HTMLDivElement> & StyledProps> = styled.div({
	display: 'flex',
	alignItems: 'center',
	width: '100%',
	gap: token('space.150'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	marginBottom: token('space.200'),
});

export const Avatar: ComponentType<ClassAttributes<HTMLDivElement> & HTMLAttributes<HTMLDivElement> & StyledProps> = styled.div({
	display: 'flex',
	flexDirection: 'column',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	marginLeft: token('space.250'),
});
