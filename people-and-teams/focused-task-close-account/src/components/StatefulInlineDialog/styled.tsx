/* eslint-disable @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766 */
import { styled, type StyledProps } from '@compiled/react';
import type { ComponentType, ClassAttributes, ButtonHTMLAttributes } from 'react';

export const TriggerButton: ComponentType<
	ClassAttributes<HTMLButtonElement> & ButtonHTMLAttributes<HTMLButtonElement> & StyledProps
> = styled.button({
	background: 'none',
	border: 'none',
	padding: 0,
	cursor: 'default',
});
