/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode, useCallback, useContext, useRef } from 'react';

import { cssMap, cx, jsx } from '@compiled/react';

import { useNotifyOpenLayerObserver } from '@atlaskit/layering/use-notify-open-layer-observer';
import { Popover } from '@atlaskit/top-layer/popover';
import { useAnchorPosition } from '@atlaskit/top-layer/use-anchor-position';
import { useWidthFromAnchor } from '@atlaskit/top-layer/use-width-from-anchor';

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
		maxBlockSize: '100dvh',
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
	const { children, controlElement, innerProps, menuPlacement, menuPosition, xcss } = props;
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

	// `gap: 0` matches the legacy MenuPortal (no trigger-to-menu gap; the
	// menu root already declares its own `marginBlockStart`). Without this
	// override `useAnchorPosition`'s default 8px gap would diverge visually
	// from the legacy path.
	useAnchorPosition({
		anchorRef,
		popoverRef,
		placement: {
			axis: 'block',
			edge: reactSelectEdgeToTopLayerEdge(menuPlacement),
			offset: { gap: 0 },
		},
		isOpen: isAnchored,
	});

	useWidthFromAnchor({
		anchorRef,
		popoverRef,
		mode: 'match-anchor',
		isOpen: isAnchored,
	});

	const handlePopoverClose = useCallback(() => {
		if (closeSelect) {
			closeSelect();
		}
	}, [closeSelect]);

	// Explicit observer registration: the outer Popover is intentionally
	// roleless (see Popover comment below), so Popover cannot auto-register
	// from its role. This lets `closeLayers()` (Modal / Drawer) dismiss us.
	useNotifyOpenLayerObserver({
		type: 'popup',
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
	// teardown (`hidePopover`, observer cleanup, position-hook style reset)
	// runs against a live element. Conditional render would skip that path.
	//
	// `mode="manual"` opts out of native light-dismiss: react-select already
	// owns outside-click and Escape via its own handlers, and the combobox
	// trigger lives in a separate DOM subtree that the spec algorithm cannot
	// see. Matches the pattern in `@atlaskit/datetime-picker`'s MenuTopLayer.
	//
	// The Popover host is intentionally roleless: the inner `MenuList`
	// keeps `role="listbox"` and the id referenced by `aria-controls`.
	// Putting the role on the outer host caused Playwright `toBeVisible`
	// and some SR hit-testing to treat it as hidden (zero bounding rect
	// while `styles.root` opts out of UA `[popover]` positioning).
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
