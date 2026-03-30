import { type ReactElement, type Ref, useContext, useLayoutEffect, useRef, useState } from 'react';

import __noop from '@atlaskit/ds-lib/noop';

import { PortalPlacementContext } from '../internal/portal-placement-context';
import type {
	CoercedMenuPlacement,
	CommonProps,
	GroupBase,
	MenuPlacement,
	MenuPosition,
} from '../types';

const noop: () => void = __noop;

function getScrollParent(element: HTMLElement): HTMLElement {
	let style = getComputedStyle(element);
	const excludeStaticParent = style.position === 'absolute';
	const overflowRx = /(auto|scroll)/;

	if (style.position === 'fixed') {
		return document.documentElement;
	}

	for (let parent: HTMLElement | null = element; (parent = parent.parentElement); ) {
		style = getComputedStyle(parent);
		if (excludeStaticParent && style.position === 'static') {
			continue;
		}
		if (overflowRx.test(style.overflow + style.overflowY + style.overflowX)) {
			return parent;
		}
	}

	return document.documentElement;
}

function isDocumentElement(el: HTMLElement | typeof window): el is typeof window {
	return [document.documentElement, document.body, window].indexOf(el) > -1;
}

function normalizedHeight(el: HTMLElement | typeof window): number {
	if (isDocumentElement(el)) {
		return window.innerHeight;
	}

	return el.clientHeight;
}

function scrollTo(el: HTMLElement | typeof window, top: number): void {
	// with a scroll distance, we perform scroll on the element
	if (isDocumentElement(el)) {
		window.scrollTo(0, top);
		return;
	}

	el.scrollTop = top;
}

function easeOutCubic(t: number, b: number, c: number, d: number): number {
	return c * ((t = t / d - 1) * t * t + 1) + b;
}

function getScrollTop(el: HTMLElement | typeof window): number {
	if (isDocumentElement(el)) {
		return window.pageYOffset;
	}
	return el.scrollTop;
}

function animatedScrollTo(
	element: HTMLElement | typeof window,
	to: number,
	duration = 200,
	callback: (element: HTMLElement | typeof window) => void = noop,
): void {
	const start = getScrollTop(element);
	const change = to - start;
	const increment = 10;
	let currentTime = 0;

	function animateScroll() {
		currentTime += increment;
		const val = easeOutCubic(currentTime, start, change, duration);
		scrollTo(element, val);
		if (currentTime < duration) {
			window.requestAnimationFrame(animateScroll);
		} else {
			callback(element);
		}
	}
	animateScroll();
}

interface CalculatedMenuPlacementAndHeight {
	placement: CoercedMenuPlacement;
	maxHeight: number;
}

interface PlacementArgs {
	maxHeight: number;
	menuEl: HTMLDivElement | null;
	minHeight: number;
	placement: MenuPlacement;
	shouldScroll: boolean;
	isFixedPosition: boolean;
	controlHeight: number;
}

function getMenuPlacement({
	maxHeight: preferredMaxHeight,
	menuEl,
	minHeight,
	placement: preferredPlacement,
	shouldScroll,
	isFixedPosition,
	controlHeight,
}: PlacementArgs): CalculatedMenuPlacementAndHeight {
	const scrollParent = getScrollParent(menuEl!);
	const defaultState: CalculatedMenuPlacementAndHeight = {
		placement: 'bottom',
		maxHeight: preferredMaxHeight,
	};

	// something went wrong, return default state
	if (!menuEl || !menuEl.offsetParent) {
		return defaultState;
	}

	// we can't trust `scrollParent.scrollHeight` --> it may increase when
	// the menu is rendered
	const { height: scrollHeight } = scrollParent.getBoundingClientRect();
	const { bottom: menuBottom, height: menuHeight, top: menuTop } = menuEl.getBoundingClientRect();

	const { top: containerTop } = menuEl.offsetParent.getBoundingClientRect();
	const viewHeight = isFixedPosition ? window.innerHeight : normalizedHeight(scrollParent);
	const scrollTop = getScrollTop(scrollParent);
	const menuTopFromParent = menuTop;
	const marginBottom = parseInt(getComputedStyle(menuEl).marginBottom, 10);
	const marginTop = parseInt(getComputedStyle(menuEl).marginTop, 10);
	const viewSpaceAbove = containerTop - marginTop;
	const viewSpaceBelow = viewHeight - menuTopFromParent;
	const scrollSpaceAbove = viewSpaceAbove + scrollTop;
	const scrollSpaceBelow = scrollHeight - scrollTop - menuTopFromParent;
	const scrollDown = menuBottom - viewHeight + scrollTop + marginBottom;
	const scrollUp = scrollTop + menuTop - marginTop;
	const scrollDuration = 160;

	switch (preferredPlacement) {
		case 'auto':
		case 'bottom':
			// 1: the menu will fit, do nothing
			if (viewSpaceBelow >= menuHeight) {
				return { placement: 'bottom', maxHeight: preferredMaxHeight };
			}

			// 2: the menu will fit, if scrolled
			if (scrollSpaceBelow >= menuHeight && !isFixedPosition) {
				if (shouldScroll) {
					animatedScrollTo(scrollParent, scrollDown, scrollDuration);
				}

				return { placement: 'bottom', maxHeight: preferredMaxHeight };
			}

			// 3: the menu will fit, if constrained
			if (
				(!isFixedPosition && scrollSpaceBelow >= minHeight) ||
				(isFixedPosition && viewSpaceBelow >= minHeight)
			) {
				if (shouldScroll) {
					animatedScrollTo(scrollParent, scrollDown, scrollDuration);
				}

				// we want to provide as much of the menu as possible to the user,
				// so give them whatever is available below rather than the minHeight.
				const constrainedHeight = isFixedPosition
					? viewSpaceBelow - marginBottom
					: scrollSpaceBelow - marginBottom;

				return {
					placement: 'bottom',
					maxHeight: constrainedHeight,
				};
			}

			// 4. Forked beviour when there isn't enough space below

			// AUTO: flip the menu, render above
			if (preferredPlacement === 'auto' || isFixedPosition) {
				// may need to be constrained after flipping
				let constrainedHeight = preferredMaxHeight;
				const spaceAbove = isFixedPosition ? viewSpaceAbove : scrollSpaceAbove;

				if (spaceAbove >= minHeight) {
					constrainedHeight = Math.min(
						spaceAbove - marginBottom - controlHeight,
						preferredMaxHeight,
					);
				}

				return { placement: 'top', maxHeight: constrainedHeight };
			}

			// BOTTOM: allow browser to increase scrollable area and immediately set scroll
			if (preferredPlacement === 'bottom') {
				if (shouldScroll) {
					scrollTo(scrollParent, scrollDown);
				}
				return { placement: 'bottom', maxHeight: preferredMaxHeight };
			}
			break;
		case 'top':
			// 1: the menu will fit, do nothing
			if (viewSpaceAbove >= menuHeight) {
				return { placement: 'top', maxHeight: preferredMaxHeight };
			}

			// 2: the menu will fit, if scrolled
			if (scrollSpaceAbove >= menuHeight && !isFixedPosition) {
				if (shouldScroll) {
					animatedScrollTo(scrollParent, scrollUp, scrollDuration);
				}

				return { placement: 'top', maxHeight: preferredMaxHeight };
			}

			// 3: the menu will fit, if constrained
			if (
				(!isFixedPosition && scrollSpaceAbove >= minHeight) ||
				(isFixedPosition && viewSpaceAbove >= minHeight)
			) {
				let constrainedHeight = preferredMaxHeight;

				// we want to provide as much of the menu as possible to the user,
				// so give them whatever is available below rather than the minHeight.
				if (
					(!isFixedPosition && scrollSpaceAbove >= minHeight) ||
					(isFixedPosition && viewSpaceAbove >= minHeight)
				) {
					constrainedHeight = isFixedPosition
						? viewSpaceAbove - marginTop
						: scrollSpaceAbove - marginTop;
				}

				if (shouldScroll) {
					animatedScrollTo(scrollParent, scrollUp, scrollDuration);
				}

				return {
					placement: 'top',
					maxHeight: constrainedHeight,
				};
			}

			// 4. not enough space, the browser WILL NOT increase scrollable area when
			// absolutely positioned element rendered above the viewport (only below).
			// Flip the menu, render below
			return { placement: 'bottom', maxHeight: preferredMaxHeight };
		default:
			throw new Error(`Invalid placement provided "${preferredPlacement}".`);
	}

	return defaultState;
}

interface ChildrenProps {
	ref: Ref<HTMLDivElement>;
	placerProps: PlacerProps;
}

interface PlacerProps {
	placement: CoercedMenuPlacement;
	maxHeight: number;
}

export interface MenuPlacementProps {
	/**
	 * Set the minimum height of the menu.
	 */
	minMenuHeight: number;
	/**
	 * Set the maximum height of the menu.
	 */
	maxMenuHeight: number;
	/**
	 * Set whether the menu should be at the top, at the bottom. The auto options sets it to bottom.
	 */
	menuPlacement: MenuPlacement;
	/**
	 * The CSS position value of the menu, when "fixed" extra layout management is required
	 */
	menuPosition: MenuPosition;
	/**
	 * Set whether the page should scroll to show the menu.
	 */
	// eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention
	menuShouldScrollIntoView: boolean;
}

interface MenuPlacerProps<Option, IsMulti extends boolean, Group extends GroupBase<Option>>
	extends CommonProps<Option, IsMulti, Group>, MenuPlacementProps {
	/**
	 * The children to be rendered.
	 */
	children: (childrenProps: ChildrenProps) => ReactElement;
}

const coercePlacement = (p: MenuPlacement) => (p === 'auto' ? 'bottom' : p);

// NOTE: internal only
// eslint-disable-next-line @repo/internal/react/require-jsdoc
// TODO: Fill in the component {description} and ensure links point to the correct {packageName} location.
// Remove links that the component does not have (such as usage). If there are no links remove them all.
/**
 * __Menu placer__
 *
 * A menu placer {description}.
 *
 * - [Examples](https://atlassian.design/components/{packageName}/examples)
 * - [Code](https://atlassian.design/components/{packageName}/code)
 * - [Usage](https://atlassian.design/components/{packageName}/usage)
 */
const MenuPlacer: <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: MenuPlacerProps<Option, IsMulti, Group>,
) => ReactElement<any, string | import('react').JSXElementConstructor<any>> = <
	Option,
	IsMulti extends boolean,
	Group extends GroupBase<Option>,
>(
	props: MenuPlacerProps<Option, IsMulti, Group>,
) => {
	const {
		children,
		minMenuHeight,
		maxMenuHeight,
		menuPlacement,
		menuPosition,
		menuShouldScrollIntoView,
	} = props;
	const { setPortalPlacement } = useContext(PortalPlacementContext) || {};
	const ref = useRef<HTMLDivElement | null>(null);
	const [maxHeight, setMaxHeight] = useState(maxMenuHeight);
	const [placement, setPlacement] = useState<CoercedMenuPlacement | null>(null);
	// The minimum height of the control
	const controlHeight = 38;

	useLayoutEffect(() => {
		const menuEl = ref.current;
		if (!menuEl) {
			return;
		}

		// DO NOT scroll if position is fixed
		const isFixedPosition = menuPosition === 'fixed';
		const shouldScroll = menuShouldScrollIntoView && !isFixedPosition;

		const state = getMenuPlacement({
			maxHeight: maxMenuHeight,
			menuEl,
			minHeight: minMenuHeight,
			placement: menuPlacement,
			shouldScroll,
			isFixedPosition,
			controlHeight,
		});

		setMaxHeight(state.maxHeight);
		setPlacement(state.placement);
		setPortalPlacement?.(state.placement);
	}, [
		maxMenuHeight,
		menuPlacement,
		menuPosition,
		menuShouldScrollIntoView,
		minMenuHeight,
		setPortalPlacement,
		controlHeight,
	]);

	return children({
		ref,
		placerProps: {
			...props,
			placement: placement || coercePlacement(menuPlacement),
			maxHeight,
		},
	});
};

export default MenuPlacer;
