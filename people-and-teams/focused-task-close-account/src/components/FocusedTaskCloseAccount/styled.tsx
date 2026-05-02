/* eslint-disable @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766 */
import { styled, type StyledProps } from '@compiled/react';
import type { ComponentType, ClassAttributes, HTMLAttributes } from 'react';

export const DrawerInner: ComponentType<
	ClassAttributes<HTMLDivElement> & HTMLAttributes<HTMLDivElement> & StyledProps
> = styled.div({
	display: 'flex',
	flexWrap: 'wrap',
	flexDirection: 'column',
	alignItems: 'center',
});

export const ContentFooter: ComponentType<
	ClassAttributes<HTMLDivElement> & HTMLAttributes<HTMLDivElement> & StyledProps
> = styled.div({
	display: 'flex',
	justifyContent: 'flex-end',
});

/** Delete me once real content is present in the drawer */
export const PlaceholderContent: ComponentType<
	ClassAttributes<HTMLDivElement> & HTMLAttributes<HTMLDivElement> & StyledProps
> = styled.div({
	width: '352px',
});
