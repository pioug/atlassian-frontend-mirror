/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import {
	type CSSProperties,
	type ReactNode,
	useCallback,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from 'react';

import { cssMap, cx, jsx } from '@compiled/react';
import { autoUpdate } from '@floating-ui/dom';
import { createPortal } from 'react-dom';

import { getStyleProps } from '../get-style-props';
import { PortalPlacementContext } from '../internal/portal-placement-context';
import type { CommonPropsAndClassName, GroupBase, MenuPlacement, MenuPosition } from '../types';

function getBoundingClientObj(element: HTMLElement): {
	bottom: number;
	height: number;
	left: number;
	right: number;
	top: number;
	width: number;
} {
	const rect = element.getBoundingClientRect();
	return {
		bottom: rect.bottom,
		height: rect.height,
		left: rect.left,
		right: rect.right,
		top: rect.top,
		width: rect.width,
	};
}

const coercePlacement = (p: MenuPlacement) => (p === 'auto' ? 'bottom' : p);

export interface MenuPortalProps<
	Option,
	IsMulti extends boolean,
	Group extends GroupBase<Option>,
> extends CommonPropsAndClassName<Option, IsMulti, Group> {
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

interface ComputedPosition {
	offset: number;
	rect: { left: number; width: number };
}

const menuPortalStyles = cssMap({
	root: {
		zIndex: 1,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
		insetInlineStart: 'var(--menu-left)',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
		position: 'var(--menu-position)' as MenuPosition,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
		insetBlockStart: 'var(--menu-top)',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
		width: 'var(--menu-width)',
	},
});
// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const MenuPortal: <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: MenuPortalProps<Option, IsMulti, Group>,
) => JSX.Element | null = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: MenuPortalProps<Option, IsMulti, Group>,
) => {
	const { appendTo, children, controlElement, innerProps, menuPlacement, menuPosition, xcss } =
		props;

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
	const { css, className } = getStyleProps(
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
	);

	// same wrapper element whether fixed or portalled
	const menuWrapper = (
		<div
			css={menuPortalStyles.root}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop, @atlaskit/ui-styling-standard/local-cx-xcss, @compiled/local-cx-xcss
			className={cx(className as any, xcss, '-MenuPortal')}
			ref={setMenuPortalElement}
			style={
				{
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
					'--menu-left': `${computedPosition.rect.left}px`,
					'--menu-position': menuPosition,
					'--menu-top': `${computedPosition.offset}px`,
					'--menu-width': `${computedPosition.rect.width}px`,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
					...(css as CSSProperties),
				} as React.CSSProperties
			}
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
