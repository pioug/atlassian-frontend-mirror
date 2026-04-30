/* eslint-disable @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766 */
import { styled, type StyledProps } from '@compiled/react';
import { token } from '@atlaskit/tokens';
import type { ComponentType, ClassAttributes, HTMLAttributes } from 'react';

export const Screen: ComponentType<ClassAttributes<HTMLDivElement> & HTMLAttributes<HTMLDivElement> & StyledProps> = styled.div({
	width: '100%',
	maxWidth: '640px',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	marginBottom: token('space.200'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'> p': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		marginTop: token('space.300'),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		marginBottom: token('space.200'),
	},
});

export const LoadingWrapper: ComponentType<ClassAttributes<HTMLDivElement> & HTMLAttributes<HTMLDivElement> & StyledProps> = styled.div({
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	height: '500px',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
export const Title: ComponentType<ClassAttributes<HTMLDivElement> & HTMLAttributes<HTMLDivElement> & StyledProps> = styled.div({
	font: token('font.heading.large'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	marginBottom: token('space.300'),
});

export const MainInformationList: ComponentType<ClassAttributes<HTMLUListElement> & HTMLAttributes<HTMLUListElement> & StyledProps> = styled.ul({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'> li b': {
		fontWeight: token('font.weight.semibold'),
	},
});

export const AccessibleSitesWrapper: ComponentType<ClassAttributes<HTMLDivElement> & HTMLAttributes<HTMLDivElement> & StyledProps> = styled.div({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	marginTop: token('space.150'),
});
