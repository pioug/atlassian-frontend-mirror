/**
 * @jsxRuntime classic
 * @jsx jsx
 */

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';
import { token } from '@atlaskit/tokens';
import * as colors from '@atlaskit/theme/colors';

type HelpBodyProps = {
	isOverlayVisible?: boolean;
};

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const HelpBodyContainer = styled.div<HelpBodyProps>({
	flexGrow: 1,
	minHeight: 0,
	position: 'relative',
	overflowY: 'auto',
	overflowX: 'hidden',
	display: 'flex',
	flexDirection: 'column',
	flexWrap: 'nowrap',
	justifyContent: 'space-between',
	alignContent: 'stretch',
	alignItems: 'flex-start',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const HelpBody = styled.div<HelpBodyProps>({
	width: '100%',
	boxSizing: 'border-box',
	order: 0,
	flex: '1 1 auto',
	alignSelf: 'auto',
	position: 'relative',
	overflowX: 'hidden',
	overflowY: 'auto',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const HelpBodyAi = styled.div<HelpBodyProps>({
	width: '100%',
	boxSizing: 'border-box',
	order: 0,
	flex: '1 1 auto',
	alignSelf: 'auto',
	position: 'relative',
});

type HomeProps = {
	isOverlayFullyVisible?: boolean;
	isOverlayVisible?: boolean;
};

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/ui-styling-standard/no-dynamic-styles -- Ignored via go/DSP-18766
export const Home = styled.div<HomeProps>((props) => ({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	display: props.isOverlayFullyVisible ? 'none' : 'block',
	height: '100%',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	overflow: props.isOverlayVisible ? 'hidden' : 'auto',
	padding: token('space.200', '16px'),
	boxSizing: 'border-box',
}));

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/ui-styling-standard/no-dynamic-styles -- Ignored via go/DSP-18766
export const HomeAi = styled.div<HomeProps>((props) => ({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	display: props.isOverlayFullyVisible ? 'none' : 'block',
	// height: `calc(100% - ${token('space.800', '60px')})`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	overflow: props.isOverlayVisible ? 'hidden' : 'auto',
	paddingLeft: token('space.200', '16px'),
	paddingRight: token('space.200', '16px'),
	paddingBottom: token('space.200', '16px'),
	boxSizing: 'border-box',
}));

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const HelpFooter = styled.div({
	padding: `${token('space.100', '8px')} 0`,
	boxSizing: 'border-box',
	width: '100%',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	backgroundColor: token('color.background.neutral', colors.N10),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	borderTop: `${token('space.025', '2px')} solid ${token('color.border', colors.N30)}`,
	justifyContent: 'space-between',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const BackButtonContainer = styled.div({
	position: 'absolute',
	marginTop: token('space.200', '14px'),
	left: token('space.100', '8px'),
	height: token('space.400', '32px'),
});
