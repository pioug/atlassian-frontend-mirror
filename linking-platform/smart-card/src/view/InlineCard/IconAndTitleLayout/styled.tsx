/* eslint-disable @atlaskit/ui-styling-standard/no-styled */
import type { ClassAttributes, ComponentType, HTMLAttributes } from 'react';

import { styled, type StyledProps } from '@compiled/react';

import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const RightIconPositionWrapper: ComponentType<ClassAttributes<HTMLSpanElement> & HTMLAttributes<HTMLSpanElement> & StyledProps> = styled.span({
	marginLeft: token('space.025'),
	position: 'relative',
	display: 'inline-block',
});
