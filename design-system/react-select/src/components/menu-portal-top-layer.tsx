/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode, useCallback, useContext, useMemo, useRef } from 'react';

import { cssMap, cx, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';
import { Popover } from '@atlaskit/top-layer/popover/popover';
import { type TPopoverCloseReason } from '@atlaskit/top-layer/popover/types';
import { useAnchoredPopover } from '@atlaskit/top-layer/use-anchored-popover';
import { useSimpleLightDismiss } from '@atlaskit/top-layer/use-simple-light-dismiss';

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
	// Select's "close the menu" callback, distinct from `Popover.onClose`.
	const closeSelect = useContext(MenuPortalCloseContext);

	const popoverRef = useRef<HTMLDivElement | null>(null);

	// Top-layer hooks need a RefObject; in-render mutation keeps it in sync
	// with the prop without an effect. The hooks re-read `.current` from
	// `isOpen`-keyed layout effects, so a stable ref identity is fine.
	const anchorRef = useRef<HTMLElement | null>(null);
	anchorRef.current = controlElement;

	// `controlElement` is null on initial mount / SSR until `Select` mirrors
	// its ref into state. While null, every hook below no-ops to avoid DOM
	// reads or registering an unpositioned popover.
	const isAnchored = controlElement !== null;
	const additionalInsideElementRefs = useMemo(
		() => [anchorRef, ...(additionalInsideElementRefsProp ?? [])],
		[additionalInsideElementRefsProp, anchorRef],
	);

	// Inline rather than memoised: `useAnchoredPopover` re-derives a stable
	// placement from the primitive fields.
	useAnchoredPopover({
		anchorRef,
		popoverRef,
		placement: {
			axis: 'block',
			edge: reactSelectEdgeToTopLayerEdge(menuPlacement),
			// Keep the popover separated from the control, even when it flips to the opposite side.
			offset: { gap: token('space.100') },
		},
		isOpen: isAnchored,
		inlineSize: 'match-anchor',
		// Fit long menus into available space, rather than only capping at the full viewport height.
		blockSize: 'max-available',
	});

	const handlePopoverClose = useCallback(
		(args?: { reason: TPopoverCloseReason }) => {
			if (closeSelect) {
				closeSelect(args);
			}
		},
		[closeSelect],
	);

	useSimpleLightDismiss({
		popoverRef,
		additionalInsideElementRefs,
		isOpen: isAnchored,
		onClose: handlePopoverClose,
	});

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
	// TODO: add open / close animation. Select unmounts MenuPortalTopLayer
	// the moment `menuIsOpen` flips false, so Popover's `animate` exit
	// transition never gets a frame. Needs keeping the portal mounted
	// through the exit (`onExitFinish`) on the Select side.
	return (
		<Popover ref={popoverRef} mode="manual" isOpen={isAnchored} onClose={handlePopoverClose}>
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
