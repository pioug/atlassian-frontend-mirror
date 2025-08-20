// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, keyframes } from '@emotion/react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';

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

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const MobileNavSlider = styled.div<{
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

// make space so content below doesn't slip beneath the header
// since the content is `position: fixed`
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const MobilePageHeader = styled.header({
	height: `${mobileHeaderHeight}px`,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const MobilePageHeaderContent = styled.div<{
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

// @atlaskit/blanket has a z-index *higher* than @atlaskit/navigation,
// so we can't display the AK blanket underneath the navigation.
// eslint-disable-next-line @atlaskit/design-system/no-styled-tagged-template-expression, @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const FakeBlanket = styled.div<{
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

// use proper h1 and header styles but for mobile we don't want a top margin
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const PageHeading = styled.h1({
	flexGrow: 1,
	margin: 0,
	marginLeft: token('space.100'),
	font: token('font.heading.small'),
	alignSelf: 'center',
});
