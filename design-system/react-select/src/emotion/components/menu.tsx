/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import {
	createContext,
	type LegacyRef,
	type ReactElement,
	type ReactNode,
	type Ref,
	useCallback,
	useContext,
	useMemo,
	useRef,
	useState,
} from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { jsx } from '@emotion/react';
import { autoUpdate } from '@floating-ui/dom';
import { createPortal } from 'react-dom';
import useLayoutEffect from 'use-isomorphic-layout-effect';

import { Text } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import {
	type CoercedMenuPlacement,
	type CommonProps,
	type CommonPropsAndClassName,
	type CSSObjectWithLabel,
	type GroupBase,
	type MenuPlacement,
	type MenuPosition,
} from '../../types';
import {
	animatedScrollTo,
	getBoundingClientObj,
	getScrollParent,
	getScrollTop,
	getStyleProps,
	normalizedHeight,
	scrollTo,
} from '../../utils';

// ==============================
// Menu
// ==============================

// Get Menu Placement
// ------------------------------

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

// Menu Component
// ------------------------------

interface MenuPlacementProps {
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

export interface MenuProps<
	Option = unknown,
	IsMulti extends boolean = boolean,
	Group extends GroupBase<Option> = GroupBase<Option>,
> extends CommonPropsAndClassName<Option, IsMulti, Group>,
		MenuPlacementProps {
	/**
	 * Reference to the internal element, consumed by the MenuPlacer component
	 */
	innerRef: Ref<HTMLDivElement>;
	innerProps: JSX.IntrinsicElements['div'];
	isLoading: boolean;
	placement: CoercedMenuPlacement;
	/**
	 * The children to be rendered.
	 */
	children: ReactNode;
}

interface PlacerProps {
	placement: CoercedMenuPlacement;
	maxHeight: number;
}

interface ChildrenProps {
	ref: Ref<HTMLDivElement>;
	placerProps: PlacerProps;
}

interface MenuPlacerProps<Option, IsMulti extends boolean, Group extends GroupBase<Option>>
	extends CommonProps<Option, IsMulti, Group>,
		MenuPlacementProps {
	/**
	 * The children to be rendered.
	 */
	children: (childrenProps: ChildrenProps) => ReactElement;
}

function alignToControl(placement: CoercedMenuPlacement) {
	const placementToCSSProp = { bottom: 'top', top: 'bottom' };
	return placement ? placementToCSSProp[placement] : 'bottom';
}
const coercePlacement = (p: MenuPlacement) => (p === 'auto' ? 'bottom' : p);

export const menuCSS = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>({
	placement,
}: MenuProps<Option, IsMulti, Group>): CSSObjectWithLabel => ({
	label: 'menu',
	[alignToControl(placement)]: '100%',
	position: 'absolute',
	width: '100%',
	zIndex: 1,
	borderRadius: token('border.radius'),
	marginBottom: token('space.100'),
	marginTop: token('space.100'),
	backgroundColor: token('elevation.surface.overlay', 'white'),
	boxShadow: token(
		'elevation.shadow.overlay',
		'0 0 0 1px hsl(0deg 0% 0% / 10%), 0 4px 11px hsl(0deg 0% 0% / 10%)',
	),
});

const PortalPlacementContext = createContext<{
	setPortalPlacement: (placement: CoercedMenuPlacement) => void;
} | null>(null);

// NOTE: internal only
// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const MenuPlacer = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
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

const Menu = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: MenuProps<Option, IsMulti, Group>,
) => {
	const { children, innerRef, innerProps } = props;
	return (
		<div {...getStyleProps(props, 'menu', { menu: true })} ref={innerRef} {...innerProps}>
			{children}
		</div>
	);
};

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Menu;

// ==============================
// Menu List
// ==============================

export interface MenuListProps<
	Option = unknown,
	IsMulti extends boolean = boolean,
	Group extends GroupBase<Option> = GroupBase<Option>,
> extends CommonPropsAndClassName<Option, IsMulti, Group> {
	/**
	 * Set the max height of the Menu component
	 */
	maxHeight: number;
	/**
	 * The children to be rendered.
	 */
	children: ReactNode;
	/**
	 * Inner ref to DOM ReactNode
	 */
	innerRef: LegacyRef<HTMLDivElement>;
	/**
	 * The currently focused option
	 */
	focusedOption: Option;
	/**
	 * Props to be passed to the menu-list wrapper.
	 */
	innerProps: JSX.IntrinsicElements['div'];
}
export const menuListCSS = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>({
	maxHeight,
}: MenuListProps<Option, IsMulti, Group>): CSSObjectWithLabel => ({
	maxHeight,
	overflowY: 'auto',
	position: 'relative', // required for offset[Height, Top] > keyboard scroll
	WebkitOverflowScrolling: 'touch',
	paddingTop: token('space.100', '8px'),
	paddingBottom: token('space.100', '8px'),
});

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const MenuList = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: MenuListProps<Option, IsMulti, Group>,
) => {
	const { children, innerProps, innerRef, isMulti } = props;

	return (
		<div
			{...getStyleProps(props, 'menuList', {
				'menu-list': true,
				'menu-list--is-multi': isMulti,
			})}
			ref={innerRef}
			{...innerProps}
			tabIndex={-1}
		>
			{children}
		</div>
	);
};

// ==============================
// Menu Notices
// ==============================

const noticeCSS = <
	Option,
	IsMulti extends boolean,
	Group extends GroupBase<Option>,
>({}: NoticeProps<Option, IsMulti, Group>): CSSObjectWithLabel => ({
	textAlign: 'center',
	padding: `${token('space.100')} ${token('space.150')}`,
});
export const noOptionsMessageCSS = noticeCSS;
export const loadingMessageCSS = noticeCSS;

export interface NoticeProps<
	Option = unknown,
	IsMulti extends boolean = boolean,
	Group extends GroupBase<Option> = GroupBase<Option>,
> extends CommonPropsAndClassName<Option, IsMulti, Group> {
	/**
	 * The children to be rendered.
	 */
	children: ReactNode;
	/**
	 * Props to be passed on to the wrapper.
	 */
	innerProps: JSX.IntrinsicElements['div'];
}

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const NoOptionsMessage = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>({
	children = 'No options',
	innerProps,
	...restProps
}: NoticeProps<Option, IsMulti, Group>) => {
	return (
		<div
			{...getStyleProps({ ...restProps, children, innerProps }, 'noOptionsMessage', {
				'menu-notice': true,
				'menu-notice--no-options': true,
			})}
			// eslint-disable-next-line jsx-a11y/role-has-required-aria-props
			role="option"
			{...innerProps}
		>
			<Text color="color.text.subtle">{children}</Text>
		</div>
	);
};

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const LoadingMessage = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>({
	children = 'Loading...',
	innerProps,
	...restProps
}: NoticeProps<Option, IsMulti, Group>) => {
	return (
		<div
			{...getStyleProps({ ...restProps, children, innerProps }, 'loadingMessage', {
				'menu-notice': true,
				'menu-notice--loading': true,
			})}
			{...innerProps}
			// eslint-disable-next-line jsx-a11y/role-has-required-aria-props
			role="option"
		>
			<Text color="color.text.subtle">{children}</Text>
		</div>
	);
};

// ==============================
// Menu Portal
// ==============================

export interface MenuPortalProps<Option, IsMulti extends boolean, Group extends GroupBase<Option>>
	extends CommonPropsAndClassName<Option, IsMulti, Group> {
	appendTo: HTMLElement | undefined;
	children: ReactNode; // ideally Menu<MenuProps>
	controlElement: HTMLDivElement | null;
	innerProps: JSX.IntrinsicElements['div'];
	menuPlacement: MenuPlacement;
	menuPosition: MenuPosition;
}

export interface PortalStyleArgs {
	offset: number;
	position: MenuPosition;
	rect: { left: number; width: number };
}

export const menuPortalCSS = ({ rect, offset, position }: PortalStyleArgs): CSSObjectWithLabel => ({
	left: rect.left,
	position: position,
	top: offset,
	width: rect.width,
	zIndex: 1,
});

interface ComputedPosition {
	offset: number;
	rect: { left: number; width: number };
}

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const MenuPortal = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: MenuPortalProps<Option, IsMulti, Group>,
) => {
	const { appendTo, children, controlElement, innerProps, menuPlacement, menuPosition } = props;

	const menuPortalRef = useRef<HTMLDivElement | null>(null);
	const cleanupRef = useRef<(() => void) | void | null>(null);

	const [placement, setPortalPlacement] = useState<'bottom' | 'top'>(
		coercePlacement(menuPlacement),
	);
	const portalPlacementContext = useMemo(
		() => ({
			setPortalPlacement,
		}),
		[],
	);
	const [computedPosition, setComputedPosition] = useState<ComputedPosition | null>(null);

	const updateComputedPosition = useCallback(() => {
		if (!controlElement) {
			return;
		}

		const rect = getBoundingClientObj(controlElement);
		const scrollDistance = menuPosition === 'fixed' ? 0 : window.pageYOffset;
		const offset = rect[placement] + scrollDistance;
		if (
			offset !== computedPosition?.offset ||
			rect.left !== computedPosition?.rect.left ||
			rect.width !== computedPosition?.rect.width
		) {
			setComputedPosition({ offset, rect });
		}
	}, [
		controlElement,
		menuPosition,
		placement,
		computedPosition?.offset,
		computedPosition?.rect.left,
		computedPosition?.rect.width,
	]);

	useLayoutEffect(() => {
		updateComputedPosition();
	}, [updateComputedPosition]);

	const runAutoUpdate = useCallback(() => {
		if (typeof cleanupRef.current === 'function') {
			cleanupRef.current();
			cleanupRef.current = null;
		}

		if (controlElement && menuPortalRef.current) {
			cleanupRef.current = autoUpdate(
				controlElement,
				menuPortalRef.current,
				updateComputedPosition,
				{ elementResize: 'ResizeObserver' in window },
			);
		}
	}, [controlElement, updateComputedPosition]);

	useLayoutEffect(() => {
		runAutoUpdate();
	}, [runAutoUpdate]);

	const setMenuPortalElement = useCallback(
		(menuPortalElement: HTMLDivElement) => {
			menuPortalRef.current = menuPortalElement;
			runAutoUpdate();
		},
		[runAutoUpdate],
	);

	// bail early if required elements aren't present
	if ((!appendTo && menuPosition !== 'fixed') || !computedPosition) {
		return null;
	}

	// same wrapper element whether fixed or portalled
	const menuWrapper = (
		<div
			ref={setMenuPortalElement}
			{...getStyleProps(
				{
					...props,
					offset: computedPosition.offset,
					position: menuPosition,
					rect: computedPosition.rect,
				},
				'menuPortal',
				{
					'menu-portal': true,
				},
			)}
			{...innerProps}
		>
			{children}
		</div>
	);

	return (
		<PortalPlacementContext.Provider value={portalPlacementContext}>
			{appendTo ? createPortal(menuWrapper, appendTo) : menuWrapper}
		</PortalPlacementContext.Provider>
	);
};
