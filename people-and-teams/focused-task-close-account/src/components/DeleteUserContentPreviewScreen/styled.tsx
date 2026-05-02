/* eslint-disable @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766 */
import { styled, type StyledProps } from '@compiled/react';
import { token } from '@atlaskit/tokens';
import type { ComponentType, ClassAttributes, HTMLAttributes } from 'react';

export const Screen: ComponentType<
	ClassAttributes<HTMLDivElement> & HTMLAttributes<HTMLDivElement> & StyledProps
> = styled.div({
	width: '100%',
	maxWidth: '640px',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	marginBottom: token('space.400'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
export const Title: ComponentType<
	ClassAttributes<HTMLDivElement> & HTMLAttributes<HTMLDivElement> & StyledProps
> = styled.div({
	font: token('font.heading.large'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	marginBottom: token('space.400'),
});

export const SectionCard: ComponentType<
	ClassAttributes<HTMLDivElement> & HTMLAttributes<HTMLDivElement> & StyledProps
> = styled.div({
	position: 'relative',
	display: 'flex',
	paddingTop: token('space.250'),
	paddingRight: token('space.250'),
	paddingBottom: token('space.250'),
	paddingLeft: token('space.250'),
	width: '100%',
	borderRadius: token('radius.small', '3px'),
	boxShadow: token('elevation.shadow.overlay'),
	marginTop: token('space.200'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&[data-selected="true"]': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		backgroundColor: token('color.background.selected'),
	},
});

export const Avatar: ComponentType<
	ClassAttributes<HTMLDivElement> & HTMLAttributes<HTMLDivElement> & StyledProps
> = styled.div({
	display: 'flex',
	flexDirection: 'column',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	marginLeft: token('space.250'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	marginRight: token('space.100'),
});

export const UserDetails: ComponentType<
	ClassAttributes<HTMLDivElement> & HTMLAttributes<HTMLDivElement> & StyledProps
> = styled.div({
	display: 'flex',
	flexDirection: 'column',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	marginTop: token('space.150'),
	fontWeight: token('font.weight.semibold'),
	color: token('color.text.accent.blue'),
});
