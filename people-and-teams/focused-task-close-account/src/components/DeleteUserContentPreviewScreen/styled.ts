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

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const Screen = styled.div({
	width: '100%',
	maxWidth: '640px',
	marginBottom: `${gridSizeTimes(4)}px`,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const Title = styled.div(h700, {
	marginBottom: `${gridSizeTimes(4)}px`,
	marginTop: 0,
});

// eslint-disable-next-line @atlaskit/design-system/no-styled-tagged-template-expression, @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
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

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const Avatar = styled.div({
	display: 'flex',
	flexDirection: 'column',
	marginLeft: `${gridSizeTimes(2.5)}px`,
	marginRight: `${gridSizeTimes(1)}px`,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const UserDetails = styled.div({
	display: 'flex',
	flexDirection: 'column',
	marginTop: `${gridSizeTimes(1.5)}px`,
	fontWeight: 600,
	color: token('color.text.accent.blue', B400),
});
