/* eslint-disable @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766 */
import { styled, type StyledProps } from '@compiled/react';
import { token } from '@atlaskit/tokens';
import type { ComponentType, ClassAttributes, HTMLAttributes } from 'react';

export const AccessibleSitesList: ComponentType<ClassAttributes<HTMLUListElement> & HTMLAttributes<HTMLUListElement> & StyledProps> = styled.ul({
	listStyle: 'none',
	paddingLeft: 0,
	fontWeight: token('font.weight.semibold'),
	marginLeft: token('space.100'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'> li': {
		marginTop: 0,
	},
});

export const AccessibleSitesListFootnote: ComponentType<ClassAttributes<HTMLDivElement> & HTMLAttributes<HTMLDivElement> & StyledProps> = styled.div({
	paddingLeft: 0,
	marginLeft: token('space.100'),
});

export const ButtonWrapper: ComponentType<ClassAttributes<HTMLDivElement> & HTMLAttributes<HTMLDivElement> & StyledProps> = styled.div({
	paddingTop: 0,
	paddingBottom: 0,
	paddingLeft: token('space.100'),
	paddingRight: token('space.100'),
});
