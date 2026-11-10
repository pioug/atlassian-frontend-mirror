/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode, useCallback, useContext, useMemo, useRef } from 'react';

import { cssMap, cx, jsx } from '@compiled/react';

import { useLayoutEffect } from '@atlaskit/ds-lib/use-layout-effect';
import { token } from '@atlaskit/tokens';
import { Popover } from '@atlaskit/top-layer/popover/popover';
import { type TPopoverCloseReason } from '@atlaskit/top-layer/popover/types';
import { useAnchoredPopover } from '@atlaskit/top-layer/use-anchored-popover';
import { useManualLightDismiss } from '@atlaskit/top-layer/use-manual-light-dismiss';

import { getStyleProps } from '../get-style-props';
import { MenuPortalCloseContext } from '../internal/menu-portal-close-context';
import type { GroupBase, MenuPlacement } from '../types';
import type { MenuPortalProps } from './menu-portal';

// `'auto'` falls through to `'end'`; top-layer's `position-try-fallbacks` flips it if needed.
function reactSelectEdgeToTopLayerEdge(menuPlacement: MenuPlacement): 'start' | 'end' {
	return menuPlacement === 'top' ? 'start' : 'end';
}

const menuPortalStyles = cssMap({
	root: {
		// Let the list shrink vertically with the popover when viewport space is limited.
		display: 'flex',
		flexDirection: 'column',
		// Allow the wrapper to shrink below its content height, so the list can scroll.
		minBlockSize: 0,
	},
});

/**
 * Top-layer host for react-select's menu. Hands positioning, flip, and width
 * to `@atlaskit/top-layer`; ignores `appendTo` / `menuPortalTarget` /
 * `menuPosition`. The browser-dismiss handler is supplied internally by
 * `Select` via `MenuPortalCloseContext`.
 *
 * @example
 * ```tsx
 * <MenuPortalTopLayer controlElement={el} menuPlacement="bottom">
 *   <Menu />
 * </MenuPortalTopLayer>
 * ```
 */
export function MenuPortalTopLayer<
	Option,
	IsMulti extends boolean,
	Group extends GroupBase<Option>,
>(props: MenuPortalProps<Option, IsMulti, Group>): ReactNode {
	const {
		additionalInsideElementRefs: additionalInsideElementRefsProp,
		children,
		controlElement,
		innerProps,
		menuPlacement,
		menuPosition,
		xcss,
	} = props;
	// Select's close and exit callbacks. `undefined` when rendered outside `Select`.
	const menuPortalClose = useContext(MenuPortalCloseContext);

	const popoverRef = useRef<HTMLDivElement | null>(null);

	// Top-layer hooks need a RefObject; in-render mutation keeps it in sync
	// with the prop without an effect. The hooks re-read `.current` from
	// `isOpen`-keyed layout effects, so a stable ref identity is fine.
	const anchorRef = useRef<HTMLElement | null>(null);
	anchorRef.current = controlElement;

	// `controlElement` is null when the menu is open on initial mount / SSR,
	// until `Select` renders again with its control ref. While null, every
	// hook below no-ops to avoid DOM reads or registering an unpositioned
	// popover.
	const isAnchored = controlElement !== null;
	// Select keeps this portal mounted while the menu closes (`menuIsOpen` is `false`), so the
	// Popover hides in the DOM and the platform restores focus.
	const isOpen = isAnchored && Boolean(props.selectProps.menuIsOpen);
	const additionalInsideElementRefs = useMemo(
		() => [anchorRef, ...(additionalInsideElementRefsProp ?? [])],
		[additionalInsideElementRefsProp, anchorRef],
	);

	const placement = useMemo(
		() => ({
			axis: 'block' as const,
			edge: reactSelectEdgeToTopLayerEdge(menuPlacement),
			// Keep the popover separated from the control, even when it flips to the opposite side.
			offset: { gap: token('space.100') },
		}),
		[menuPlacement],
	);
	// Share the placement so Popover's animation direction matches the positioning hint.
	useAnchoredPopover({
		anchorRef,
		popoverRef,
		placement,
		isOpen,
		inlineSize: 'match-anchor',
		// Fit long menus into available space, rather than only capping at the full viewport height.
		blockSize: 'max-available',
	});

	const handlePopoverClose = useCallback(
		(args?: { reason: TPopoverCloseReason }) => {
			menuPortalClose?.closeMenu(args);
		},
		[menuPortalClose],
	);

	useManualLightDismiss({
		popoverRef,
		additionalInsideElementRefs,
		isOpen,
		onClose: handlePopoverClose,
	});

	const onExitFinish = menuPortalClose?.onExitFinish;
	// Read through a ref, so that the unmount cleanup sees the latest callback.
	const onExitFinishRef = useRef(onExitFinish);
	onExitFinishRef.current = onExitFinish;
	// With nothing showing there is no exit to wait for (for example the menu closed before its
	// control was attached), so tell Select now. A shown Popover calls `onExitFinish` itself.
	useLayoutEffect(() => {
		if (!isOpen && !popoverRef.current) {
			onExitFinishRef.current?.();
		}
	}, [isOpen]);
	// An unmount during the close (for example Select rendered no menu) also ends it.
	useLayoutEffect(
		() => () => {
			onExitFinishRef.current?.();
		},
		[],
	);

	// Top-layer owns positioning; zero offset/rect preserves the consumer
	// styles call shape.
	const { className } = getStyleProps(
		{ ...props, offset: 0, position: menuPosition, rect: { left: 0, width: 0 } },
		'menuPortal',
		{ 'menu-portal': true },
	);

	// Popover stays mounted and is driven by `isOpen` so its layout-effect
	// teardown (`hidePopover`, position-hook style reset)
	// runs against a live element. Conditional render would skip that path.
	//
	// Select owns dismissal so both its external control and menu count as inside.
	//
	// Passing `onClose` makes the menu a closable open layer: `hasOpenDialogOrPopover()`
	// counts it, and `requestClosePopovers()` (Modal / Drawer) closes it
	// through `onClose({ reason: 'programmatic' })`.
	//
	// The Popover host is intentionally roleless: the inner `MenuList`
	// keeps `role="listbox"` and the id referenced by `aria-controls`.
	//
	// Select keeps this portal mounted until `onExitFinish`, so the Popover hides
	// in the DOM and its focus restoration runs.
	return (
		<Popover
			ref={popoverRef}
			mode="manual"
			isOpen={isOpen}
			shouldAnimate
			placement={placement}
			onClose={handlePopoverClose}
			onExitFinish={onExitFinish}
		>
			<div
				css={menuPortalStyles.root}
				// `className` carries consumer `styles.menuPortal({...})` output,
				// `xcss` carries caller compiled atomic classes, and `-MenuPortal`
				// is a legacy selector hook kept for parity with MenuPortalLegacy.
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop, @atlaskit/ui-styling-standard/local-cx-xcss, @compiled/local-cx-xcss, @typescript-eslint/no-explicit-any
				className={cx(className as any, xcss, '-MenuPortal')}
				{...innerProps}
			>
				{children}
			</div>
		</Popover>
	);
}
