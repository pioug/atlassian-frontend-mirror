// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';
import { B50, B400, N50A, N60A } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

interface SectionCardProps {
	isSelected: boolean;
}

const getSelectedCardColor = (props: SectionCardProps) => {
	return props.isSelected && `${token('color.background.selected', B50)}`;
};

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const Screen = styled.div({
	width: '100%',
	maxWidth: '640px',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	marginBottom: token('space.400'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
export const Title = styled.div({
	font: token('font.heading.large'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	marginBottom: token('space.400'),
});

// eslint-disable-next-line @atlaskit/design-system/no-styled-tagged-template-expression, @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const SectionCard = styled.div`
	position: relative;
	display: flex;
	padding: ${token('space.250')};
	width: 100%;
	background-color: ${(props: SectionCardProps) => getSelectedCardColor(props)};
	border-radius: ${token('radius.small', '3px')};
	box-shadow: ${token('elevation.shadow.overlay', `0 4px 8px -2px ${N50A}, 0 0 1px ${N60A}`)};
	margin-top: ${token('space.200')};
`;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const Avatar = styled.div({
	display: 'flex',
	flexDirection: 'column',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	marginLeft: token('space.250'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	marginRight: token('space.100'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const UserDetails = styled.div({
	display: 'flex',
	flexDirection: 'column',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	marginTop: token('space.150'),
	fontWeight: token('font.weight.semibold'),
	color: token('color.text.accent.blue', B400),
});
