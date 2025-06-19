import type { BreakoutMarkAttrs } from '@atlaskit/adf-schema';
import {
	akEditorBreakoutPadding,
	akEditorDefaultLayoutWidth,
	akEditorFullWidthLayoutWidth,
	akEditorSwoopCubicBezier,
	akEditorWideLayoutWidth,
	breakoutWideScaleRatio,
} from '@atlaskit/editor-shared-styles';

import commonMessages from '../messages';
import type { BreakoutMode } from '../types/breakout';
import { mapBreakpointToLayoutMaxWidth } from '../ui/BaseTheme';
import { getBreakpoint } from '../ui/WidthProvider';

import { parsePx } from './dom';

/**
 * Variables required to construct a context for breakout ssr inline script.
 *
 * TODO: Clean this up after: https://product-fabric.atlassian.net/browse/ED-8942
 *
 */
export type BreakoutConstsType = {
	padding: number;
	defaultLayoutWidth: number;
	wideScaleRatio: number;
	fullWidthLayoutWidth: number;
	wideLayoutWidth: number;
	mapBreakpointToLayoutMaxWidth: typeof mapBreakpointToLayoutMaxWidth;
	getBreakpoint: typeof getBreakpoint;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	calcBreakoutWidth: any;
	calcBreakoutWithCustomWidth: (
		mode: 'full-width' | 'wide',
		width: number | null,
		editorContainerWidth: number,
	) => string;
	calcLineLength: () => number;
	calcWideWidth: (
		containerWidth?: number,
		maxWidth?: number,
		fallback?: string,
		padding?: number,
	) => string;
};

const breakoutConsts: BreakoutConstsType = {
	padding: akEditorBreakoutPadding,
	defaultLayoutWidth: akEditorDefaultLayoutWidth,
	wideScaleRatio: breakoutWideScaleRatio,
	fullWidthLayoutWidth: akEditorFullWidthLayoutWidth,
	wideLayoutWidth: akEditorWideLayoutWidth,
	mapBreakpointToLayoutMaxWidth,
	getBreakpoint,
	/**
	 * This function can return percentage value or px value depending upon the inputs
	 */
	calcBreakoutWidth: (
		layout: 'full-width' | 'wide' | string,
		containerWidth: number,
		padding?: number,
	) => {
		const effectiveFullWidth = containerWidth - (padding ?? breakoutConsts.padding);

		switch (layout) {
			case 'full-width':
				return `${Math.min(effectiveFullWidth, breakoutConsts.fullWidthLayoutWidth)}px`;
			case 'wide':
				if (effectiveFullWidth <= 0) {
					return '100%';
				}

				const wideWidth = breakoutConsts.calcWideWidth(
					containerWidth,
					undefined,
					undefined,
					padding,
				);
				if (wideWidth.endsWith('%')) {
					return `${Math.min(effectiveFullWidth, breakoutConsts.fullWidthLayoutWidth)}px`;
				}
				return wideWidth;
			default:
				return '100%';
		}
	},
	calcBreakoutWithCustomWidth: (
		mode: 'full-width' | 'wide',
		width: number | null,
		editorContainerWidth: number,
	) => {
		if (width !== null && width > 0) {
			const effectiveFullWidth = editorContainerWidth - breakoutConsts.padding;
			// if below 0 then expect we're rendering in SSR
			return `${Math.min(width, effectiveFullWidth)}px`;
		}
		return breakoutConsts.calcBreakoutWidth(mode, editorContainerWidth);
	},
	calcLineLength: () => breakoutConsts.defaultLayoutWidth,
	calcWideWidth: (
		containerWidth: number = breakoutConsts.defaultLayoutWidth,
		maxWidth: number = Infinity,
		fallback: string = '100%',
		padding?: number,
	) => {
		const effectiveFullWidth = containerWidth - (padding ?? breakoutConsts.padding);
		const layoutMaxWidth = breakoutConsts.mapBreakpointToLayoutMaxWidth(
			breakoutConsts.getBreakpoint(containerWidth),
		);
		const wideWidth = Math.min(
			Math.ceil(layoutMaxWidth * breakoutConsts.wideScaleRatio),
			effectiveFullWidth,
		);
		return layoutMaxWidth > wideWidth ? fallback : `${Math.min(maxWidth, wideWidth)}px`;
	},
};

export const absoluteBreakoutWidth = (
	layout: 'full-width' | 'wide' | string,
	containerWidth: number,
) => {
	const breakoutWidth = breakoutConsts.calcBreakoutWidth(layout, containerWidth);

	// If it's percent, map to max layout size
	if (breakoutWidth.endsWith('%')) {
		switch (layout) {
			case 'full-width':
				return akEditorFullWidthLayoutWidth;
			case 'wide':
				return akEditorWideLayoutWidth;
			default:
				return breakoutConsts.mapBreakpointToLayoutMaxWidth(
					breakoutConsts.getBreakpoint(containerWidth),
				);
		}
	}

	return parseInt(breakoutWidth, 10);
};

export { breakoutConsts };
export const calcWideWidth = breakoutConsts.calcWideWidth;
export const calcBreakoutWidth = breakoutConsts.calcBreakoutWidth;
export const calcBreakoutWithCustomWidth = breakoutConsts.calcBreakoutWithCustomWidth;

export function calculateBreakoutStyles({
	mode,
	widthStateLineLength,
	widthStateWidth,
}: {
	mode: BreakoutMarkAttrs['mode'];
	/**
	 * offsetWidth of the content the editor is attached to.
	 * Expected to be retrieved via `WidthState.lineLength`.
	 */
	widthStateWidth?: number;
	/**
	 * clientWidth of the content area in the editor (ie. EditorPlugin contentComponents).
	 * Expected to be retrieved via `WidthState.width`.
	 */
	widthStateLineLength?: number;
}) {
	const breakoutWidth = calcBreakoutWidth(mode, widthStateWidth);
	const breakoutWidthPx = parsePx(breakoutWidth) as number;

	if (!widthStateLineLength) {
		// lineLength is not normally undefined when this is run for,
		// consumers but can be in SSR, initial render or test (jsdom)
		// environments.
		//
		// this approach doesn't work well with position: fixed, so
		// it breaks things like sticky headers.
		//
		// It can also cause bluriness for some child content (such as iframes)

		return {
			type: 'line-length-unknown' as const,
			width: breakoutWidth,
			minWidth: breakoutWidthPx,
			display: 'flex',
			justifyContent: 'center',
			transform: 'none',
			transition: `min-width 0.5s ${akEditorSwoopCubicBezier}`,
		};
	}

	// NOTE
	// At time of writing -- when toggling between full-width and
	// full-page appearance modes. There is a slight delay before
	// the widthState is updated.
	// During this period -- the marginLeftPx will be incorrect.
	// const marginLeftPx = -(breakoutWidthPx - widthStateLineLength) / 2;

	return {
		type: 'line-length-known' as const,
		width: breakoutWidth,
		minWidth: breakoutWidthPx,
		transition: `min-width 0.5s ${akEditorSwoopCubicBezier}`,
		transform: `translateX(-50%)`,
		marginLeft: `50%`,
	};
}

export function calcBreakoutWidthPx(
	mode: BreakoutMarkAttrs['mode'],
	widthStateWidth?: number,
	padding?: number,
) {
	return parsePx(calcBreakoutWidth(mode, widthStateWidth, padding));
}

export const getNextBreakoutMode = (currentMode?: BreakoutMode): BreakoutMode => {
	if (currentMode === 'full-width') {
		return 'center';
	} else if (currentMode === 'wide') {
		return 'full-width';
	}

	return 'wide';
};

export const getTitle = (layout?: BreakoutMode) => {
	switch (layout) {
		case 'full-width':
			return commonMessages.layoutFixedWidth;
		case 'wide':
			return commonMessages.layoutFullWidth;
		default:
			return commonMessages.layoutWide;
	}
};
