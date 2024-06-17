// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';
import { borderRadius } from '@atlaskit/theme/constants';
import { B50, B400, N50A, N60A } from '@atlaskit/theme/colors';
import { h700 } from '@atlaskit/theme/typography';
import { token } from '@atlaskit/tokens';
import gridSizeTimes from '../../util/gridSizeTimes';

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
	marginBottom: `${gridSizeTimes(4)}px`,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
export const Title = styled.div(h700, {
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	marginBottom: `${gridSizeTimes(4)}px`,
	marginTop: 0,
});

// eslint-disable-next-line @atlaskit/design-system/no-styled-tagged-template-expression, @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const SectionCard = styled.div`
	position: relative;
	display: flex;
	padding: ${gridSizeTimes(2.5)}px;
	width: 100%;
	background-color: ${(props: SectionCardProps) => getSelectedCardColor(props)};
	border-radius: ${borderRadius()}px;
	box-shadow: ${token('elevation.shadow.overlay', `0 4px 8px -2px ${N50A}, 0 0 1px ${N60A}`)};
	margin-top: ${gridSizeTimes(2)}px;
`;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const Avatar = styled.div({
	display: 'flex',
	flexDirection: 'column',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	marginLeft: `${gridSizeTimes(2.5)}px`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	marginRight: `${gridSizeTimes(1)}px`,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const UserDetails = styled.div({
	display: 'flex',
	flexDirection: 'column',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	marginTop: `${gridSizeTimes(1.5)}px`,
	fontWeight: 600,
	color: token('color.text.accent.blue', B400),
});
