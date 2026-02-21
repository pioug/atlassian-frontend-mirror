import type { DetailedHTMLProps, HTMLAttributes } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { css, keyframes, type Theme } from '@emotion/react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import styled, { type StyledComponent } from '@emotion/styled';

import { layers as akLayers } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

// @atlaskit/navigation has a specific z-index, so we need to layer the header
// components relative to that.
const navLayer = akLayers.navigation();
const layers = {
	header: navLayer - 10,
	blanket: navLayer - 5,
	slider: navLayer + 5,
};

const mobileHeaderHeight = 54;

const xPositioning = ({ side, isOpen }: { isOpen: boolean; side: string }) =>
	side === 'right'
		? // eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- needs manual remediation
			css`
				right: 0;
				transform: translateX(${isOpen ? '0' : '100vw'});
			`
		: // eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- needs manual remediation
			css`
				left: 0;
				transform: translateX(${isOpen ? '0' : '-100vw'});
			`;

type StyledMobileNavSlider = StyledComponent<
	{
		as?: React.ElementType;
		theme?: Theme;
	} & {
		isOpen: boolean;
		side: string;
		topOffset: number | undefined;
		// eslint-disable-next-line @typescript-eslint/ban-types
	},
	DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
	{}
>;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const MobileNavSlider: StyledMobileNavSlider = styled.div<{
	isOpen: boolean;
	side: string;
	topOffset: number | undefined;
}>(
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-dynamic-styles -- Ignored via go/DSP-18766
	(props) => ({
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		height: `calc(100vh - ${props.topOffset}px)`,
		position: 'fixed',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		top: `${props.topOffset}px`,
		transition: 'transform 0.2s ease-out',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		zIndex: layers.slider,
	}),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	xPositioning,
);

type StyledMobilePageHeader = StyledComponent<
	{
		as?: React.ElementType;
		theme?: Theme;
		// eslint-disable-next-line @typescript-eslint/ban-types
	},
	DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>,
	{}
>;

// make space so content below doesn't slip beneath the header
// since the content is `position: fixed`
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const MobilePageHeader: StyledMobilePageHeader = styled.header({
	height: `${mobileHeaderHeight}px`,
});

type StyledMobilePageHeaderContent = StyledComponent<
	{
		as?: React.ElementType;
		theme?: Theme;
	} & {
		topOffset: number | undefined;
		// eslint-disable-next-line @typescript-eslint/ban-types
	},
	DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
	{}
>;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const MobilePageHeaderContent: StyledMobilePageHeaderContent = styled.div<{
	topOffset: number | undefined;
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-dynamic-styles -- Ignored via go/DSP-18766
}>((props) => ({
	alignItems: 'center',
	backgroundColor: token('color.background.accent.gray.subtlest'),
	boxSizing: 'border-box',
	display: 'flex',
	height: `${mobileHeaderHeight}px`,
	padding: token('space.100'),
	position: 'fixed',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	top: `${props.topOffset}px`,
	width: '100%',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	zIndex: layers.header,
}));

const opacityIn = keyframes({
	from: {
		opacity: 0,
	},
	to: {
		opacity: 1,
	},
});

const opacityOut = keyframes({
	from: {
		opacity: 1,
	},
	to: {
		opacity: 0,
	},
});

type StyledFakeBlanket = StyledComponent<
	{
		as?: React.ElementType;
		theme?: Theme;
	} & {
		isOpen: boolean;
		// eslint-disable-next-line @typescript-eslint/ban-types
	},
	DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
	{}
>;

// @atlaskit/blanket has a z-index *higher* than @atlaskit/navigation,
// so we can't display the AK blanket underneath the navigation.
// eslint-disable-next-line @atlaskit/design-system/no-styled-tagged-template-expression, @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const FakeBlanket: StyledFakeBlanket = styled.div<{
	isOpen: boolean;
}>`
	background: ${token('color.blanket')};
	bottom: 0;
	left: 0;
	position: fixed;
	right: 0;
	top: 0;
	z-index: ${layers.blanket};
	animation: ${(p) => (p.isOpen ? opacityIn : opacityOut)} 0.2s ease-out;
`;

type StyledPageHeading = StyledComponent<
	{
		as?: React.ElementType;
		theme?: Theme;
		// eslint-disable-next-line @typescript-eslint/ban-types
	},
	DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>,
	{}
>;

// use proper h1 and header styles but for mobile we don't want a top margin
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const PageHeading: StyledPageHeading = styled.h1({
	flexGrow: 1,
	margin: 0,
	marginLeft: token('space.100'),
	font: token('font.heading.small'),
	alignSelf: 'center',
});
