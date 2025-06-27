import type { CSSProperties } from 'react';

import type { StrictXCSSProp, XCSSAllProperties, XCSSAllPseudos } from '@atlaskit/css';

export type BasePrimitiveProps = {
	/**
	 * A unique string that appears as data attribute `data-testid` in the rendered code, serving as a hook for automated tests.
	 */
	testId?: string;

	/**
	 * `data-testid` is strictly controlled through the `testId` prop.
	 * This lets consumers know that this data attribute will not be applied.
	 */
	'data-testid'?: never;

	/**
	 * Apply a subset of permitted styles powered by Atlassian Design System design tokens.
	 */
	xcss?: StrictXCSSProp<XCSSAllProperties, XCSSAllPseudos>;

	/**
	 * Accessible role.
	 */
	role?: string;
};

export type StyleProp = {
	// TODO: Can we have some bounded styles here, like only `width, height` or at least our same Design System token interface?
	style?: CSSProperties;
};

// NOTE: May be some cross-over in here to reduce.
export type AlignBlock = 'start' | 'center' | 'end' | 'baseline' | 'stretch';
export type AlignContent =
	| 'center'
	| 'start'
	| 'space-around'
	| 'space-between'
	| 'space-evenly'
	| 'stretch'
	| 'end';
export type AlignInline = 'start' | 'center' | 'end' | 'stretch';
export type AlignItems = 'center' | 'start' | 'stretch' | 'end' | 'baseline';
export type AutoFlow = 'column' | 'row' | 'dense' | 'row dense' | 'column dense';
export type Direction = 'column' | 'row';
export type Grow = 'hug' | 'fill';
export type JustifyContent =
	| 'center'
	| 'start'
	| 'space-around'
	| 'space-between'
	| 'space-evenly'
	| 'stretch'
	| 'end';
export type JustifyItems = 'center' | 'start' | 'stretch' | 'end';
export type Spread = 'space-between';
export type Wrap = 'wrap' | 'nowrap';

// NOTE: Separated as tokens as these should be rare and hardcoded, not generated, because generation can lead to bundle bloat.
export type BleedSpaceToken = 'space.025' | 'space.050' | 'space.100' | 'space.150' | 'space.200';
export type PositiveSpaceToken =
	| 'space.0'
	| 'space.025'
	| 'space.050'
	| 'space.075'
	| 'space.100'
	| 'space.150'
	| 'space.200'
	| 'space.250'
	| 'space.300'
	| 'space.400'
	| 'space.500'
	| 'space.600'
	| 'space.800'
	| 'space.1000';
export type PaddingToken = PositiveSpaceToken;
export type GapToken = PositiveSpaceToken;

export type SurfaceColorToken =
	| 'utility.elevation.surface.current'
	| 'elevation.surface'
	| 'elevation.surface.overlay'
	| 'elevation.surface.raised'
	| 'elevation.surface.sunken';

export type TextAlign = 'center' | 'end' | 'start';
export type TextColor =
	| 'color.text'
	| 'color.text.accent.lime'
	| 'color.text.accent.lime.bolder'
	| 'color.text.accent.red'
	| 'color.text.accent.red.bolder'
	| 'color.text.accent.orange'
	| 'color.text.accent.orange.bolder'
	| 'color.text.accent.yellow'
	| 'color.text.accent.yellow.bolder'
	| 'color.text.accent.green'
	| 'color.text.accent.green.bolder'
	| 'color.text.accent.teal'
	| 'color.text.accent.teal.bolder'
	| 'color.text.accent.blue'
	| 'color.text.accent.blue.bolder'
	| 'color.text.accent.purple'
	| 'color.text.accent.purple.bolder'
	| 'color.text.accent.magenta'
	| 'color.text.accent.magenta.bolder'
	| 'color.text.accent.gray'
	| 'color.text.accent.gray.bolder'
	| 'color.text.disabled'
	| 'color.text.inverse'
	| 'color.text.selected'
	| 'color.text.brand'
	| 'color.text.danger'
	| 'color.text.warning'
	| 'color.text.warning.inverse'
	| 'color.text.success'
	| 'color.text.discovery'
	| 'color.text.information'
	| 'color.text.subtlest'
	| 'color.text.subtle'
	| 'color.link'
	| 'color.link.pressed'
	| 'color.link.visited'
	| 'color.link.visited.pressed';
export type FontSize = 'small' | 'medium' | 'UNSAFE_small' | 'large';
export type FontWeight = 'bold' | 'medium' | 'regular' | 'semibold';

export type MetricTextFontSize = 'small' | 'medium' | 'large';
