/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { flushSync } from 'react-dom';

import { cssMap, jsx } from '@compiled/react';
import { bind } from 'bind-event-listener';

import Button from '@atlaskit/button/default/button';
import noop from '@atlaskit/ds-lib/noop';
import useControlledState from '@atlaskit/ds-lib/use-controlled';
import useFocus from '@atlaskit/ds-lib/use-focus-event';
import { useLayoutEffect } from '@atlaskit/ds-lib/use-layout-effect';
import ExpandIcon from '@atlaskit/icon/core/chevron-down';
import MenuGroup from '@atlaskit/menu/menu-group';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import Spinner from '@atlaskit/spinner/spinner';
import { token } from '@atlaskit/tokens';
import { getAriaForTrigger } from '@atlaskit/top-layer/get-aria-for-trigger';
import { isAtCurrentMenuLevel } from '@atlaskit/top-layer/is-at-current-menu-level';
import type { TLegacyPlacement } from '@atlaskit/top-layer/legacy-placements';
import { fromLegacyPlacement } from '@atlaskit/top-layer/placement-map/index';
import { PopoverSurface } from '@atlaskit/top-layer/popover-surface';
import { createPopoverCloseEvent } from '@atlaskit/top-layer/popover/create-close-event';
import { Popover } from '@atlaskit/top-layer/popover/popover';
import type { TPopoverCloseReason } from '@atlaskit/top-layer/popover/types';
import { useAnchoredPopover } from '@atlaskit/top-layer/use-anchored-popover';
import { useArrowNavigation } from '@atlaskit/top-layer/use-arrow-navigation/use-arrow-navigation';
import { useManualLightDismiss } from '@atlaskit/top-layer/use-manual-light-dismiss';
import { usePopoverId } from '@atlaskit/top-layer/use-popover-id';

import { DropdownTriggerContext } from './internal/context/dropdown-trigger-context';
import SelectionStore from './internal/context/selection-store';
import type { DropdownMenuProps } from './types';

const MAX_HEIGHT = `calc(100vh - 16px)`;
const MAX_WIDTH = '800px';
const NESTED_MENU_OFFSET = 16;

const styles = cssMap({
	spinnerContainer: {
		display: 'flex',
		minWidth: '160px',
		justifyContent: 'center',
		paddingBlockStart: token('space.250', '20px'),
		paddingInlineEnd: token('space.250', '20px'),
		paddingBlockEnd: token('space.250', '20px'),
		paddingInlineStart: token('space.250', '20px'),
	},
	newWrapper: {
		display: 'flex',
		position: 'static',
		flexDirection: 'column',
		overflow: 'auto',
	},
	height: {
		maxHeight: MAX_HEIGHT,
	},
	width: {
		maxWidth: MAX_WIDTH,
	},
});

const semanticStyles = cssMap({
	spinnerContainer: {
		paddingBlockStart: token('space.inset.xxlarge', '20px'),
		paddingInlineEnd: token('space.inset.xxlarge', '20px'),
		paddingBlockEnd: token('space.inset.xxlarge', '20px'),
		paddingInlineStart: token('space.inset.xxlarge', '20px'),
	},
});

/**
 * Event types produced by trigger interactions.
 *
 * - `React.MouseEvent<Element>`: from the trigger's `onClick` handler
 * - `React.KeyboardEvent<Element>`: from the trigger's `onClick` when activated via keyboard
 * - `KeyboardEvent`: native event from the ArrowDown `bind(window, ...)` listener
 */
type TriggerEvent = React.MouseEvent<Element> | React.KeyboardEvent<Element> | KeyboardEvent;

/**
 * The menu and its parent menus, innermost first. The last one is the root menu.
 */
function getMenuStack({ menu }: { menu: HTMLElement }): HTMLElement[] {
	const parentMenu = menu.parentElement?.closest<HTMLElement>('[popover][role="menu"]');
	if (!parentMenu) {
		return [menu];
	}

	return [menu, ...getMenuStack({ menu: parentMenu })];
}

/**
 * Asks each open menu to close for a Tab, so a Tab in a nested menu can ask every menu in its
 * stack, as the legacy path does.
 */
const menuTabCloseRequests = new WeakMap<HTMLElement, () => void>();

/**
 * A submenu trigger: `aria-haspopup` `menu` or `true`.
 */
const submenuTriggerSelector = '[aria-haspopup="menu"], [aria-haspopup="true"]';

/**
 * A group title (`GroupTitle`, or a `@atlaskit/menu` `HeadingItem`).
 */
const headingItemSelector = '[data-ds--menu--heading-item]';

/**
 * Loading indicator for the dropdown menu.
 */
function LoadingIndicator({
	statusLabel = 'Loading',
	testId,
}: {
	statusLabel?: string;
	testId?: string;
}) {
	return (
		<div
			css={[
				styles.spinnerContainer,
				fg('platform-semantic-spacing') && semanticStyles.spinnerContainer,
			]}
			role="menuitem"
		>
			<Spinner size="small" label={statusLabel} testId={testId} />
		</div>
	);
}

/**
 * Top-layer implementation of DropdownMenu.
 *
 * Replaces the legacy `@atlaskit/popup` + `@atlaskit/portal` + `@atlaskit/layering` pipeline
 * with the native Popover API via `@atlaskit/top-layer`.
 *
 * What is no longer needed:
 * - Portal: top layer handles stacking natively
 * - FocusLock / react-focus-lock: `useManualLightDismiss` provides light dismiss
 * - z-index: top layer is always above everything
 * - FocusManager (ref registration): replaced by DOM-query-based `useArrowNavigation`
 * - handle-focus.tsx: replaced by `useArrowNavigation`
 * - Layering context: top layer nesting is handled by the browser
 * - Fallback placements / Popper: CSS Anchor Positioning handles positioning
 */
function DropdownMenuTopLayer({
	children,
	defaultOpen = false,
	isLoading,
	isOpen: isOpenProp,
	onOpenChange = noop,
	placement = 'bottom-start',
	shouldFitContainer = false,
	spacing,
	statusLabel,
	testId,
	trigger,
	label,
	interactionName,
	menuLabel,
}: DropdownMenuProps): React.JSX.Element {
	const [isLocalOpen, setLocalIsOpen] = useControlledState(isOpenProp, () => defaultOpen);
	const [isNestedTrigger, setIsNestedTrigger] = useState(false);
	const triggerRef = useRef<HTMLElement | null>(null);
	const popoverRef = useRef<HTMLDivElement | null>(null);
	const setPopoverRef = useCallback(
		(element: HTMLDivElement | null) => {
			popoverRef.current = element;
			// Leave untouched menus without a busy state; retain false once it has been set.
			if (isLoading !== undefined || element?.hasAttribute('aria-busy')) {
				element?.setAttribute('aria-busy', String(Boolean(isLoading)));
			}
		},
		[isLoading],
	);

	const oldSpacing = (spacing === 'spacious' ? 'cozy' : spacing) || 'cozy';
	const popoverId = usePopoverId();

	const topLayerPlacement = useMemo(() => {
		return fromLegacyPlacement({
			legacy: placement as TLegacyPlacement,
			// If the menu is nested, give it an offset so it doesn't overlap the edges of the previous menu
			offset: fg('platform-dst-new-menu') && isNestedTrigger ? [0, NESTED_MENU_OFFSET] : undefined,
		});
	}, [placement, isNestedTrigger]);

	// DropdownMenu has no `shouldFitViewport` equivalent, so neither axis ever
	// fits and `blockSize` stays `'content'` - `MenuGroup`'s `maxHeight` owns the
	// block axis.
	useAnchoredPopover({
		anchorRef: triggerRef,
		popoverRef,
		placement: topLayerPlacement,
		isOpen: isLocalOpen,
		inlineSize: shouldFitContainer ? 'min-anchor' : 'content',
	});

	// Close handling. Escape, Tab, Left arrow, an outside press and an item select
	// close through here; the trigger toggle closes in `handleTriggerClicked`.
	// With a controlled `isOpen`, it only asks: the menu hides when `isOpen` becomes `false`.
	// Focus return:
	//   - Escape, Tab or a close from state: `Popover` returns focus to the element that had
	//     focus when the menu opened (usually the trigger), as the menu hides
	//   - Outside press: no focus return; focus stays where the user pressed
	// `returnFocusRef` is a no-op on this path.
	const closeMenu = useCallback(
		({ event }: { event: Event | null }) => {
			setLocalIsOpen(false);
			onOpenChange({ isOpen: false, event });
		},
		[onOpenChange, setLocalIsOpen],
	);

	// Bridges the Popover close reason to the legacy `onOpenChange` event: a
	// `KeyboardEvent` for Escape, a `MouseEvent` for an outside press, and
	// `null` for a programmatic close (as `OnOpenChangeArgs` documents).
	const handleOnClose = useCallback(
		({ reason }: { reason: TPopoverCloseReason }) => {
			closeMenu({ event: reason === 'programmatic' ? null : createPopoverCloseEvent({ reason }) });
		},
		[closeMenu],
	);

	// A Tab in this menu or a nested one asks this menu to close, with a Tab `KeyboardEvent`, as the
	// legacy path does.
	useLayoutEffect(() => {
		const menu = popoverRef.current;
		if (!isLocalOpen || !menu) {
			return;
		}
		menuTabCloseRequests.set(menu, () => {
			closeMenu({ event: new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }) });
		});
		return () => {
			menuTabCloseRequests.delete(menu);
		};
	}, [closeMenu, isLocalOpen]);

	/**
	 * **Ask first, close second**
	 *
	 * A `manual` popover, so the browser never closes it. An outside press or Escape asks through
	 * `onOpenChange`, and the menu hides only when `isOpen` becomes `false`. A press on the trigger
	 * does not ask: the trigger's click toggles the menu, as on the legacy path. A press in a nested
	 * menu is inside this menu (it renders in place).
	 * See `@atlaskit/top-layer` `notes/decisions/wrappers-ask-first-close.md`.
	 */
	const triggerRefs = useMemo(() => [triggerRef], []);
	useManualLightDismiss({
		isOpen: isLocalOpen,
		popoverRef,
		additionalInsideElementRefs: triggerRefs,
		onClose: handleOnClose,
	});

	const handleNestedClose = useCallback(() => {
		closeMenu({ event: new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }) });
	}, [closeMenu]);

	// Trigger click handling.
	const handleTriggerClicked = useCallback(
		(event: TriggerEvent) => {
			const nextIsOpen = !isLocalOpen;
			setLocalIsOpen(nextIsOpen);

			// Extract the native DOM event for onOpenChange
			const nativeEvent: Event = 'nativeEvent' in event ? event.nativeEvent : event;
			onOpenChange({ isOpen: nextIsOpen, event: nativeEvent });
		},
		[isLocalOpen, setLocalIsOpen, onOpenChange],
	);

	const { isFocused, bindFocus } = useFocus();

	// When trigger is focused, open dropdown on ArrowDown (top-level only).
	// Per WAI-ARIA, ArrowDown opens a menu from a menubar/button trigger,
	// but inside a vertical submenu, ArrowDown navigates between siblings
	// and ArrowRight opens nested menus instead.
	useEffect(() => {
		const isNestedTriggerLocal = Boolean(triggerRef.current?.closest('[role="menu"]'));
		setIsNestedTrigger(isNestedTriggerLocal);

		if (!isFocused || isLocalOpen) {
			return;
		}

		// Do not open on ArrowDown if this trigger is inside a parent menu.
		// Nested menus should only be opened via ArrowRight or Enter.
		return bind(window, {
			type: 'keydown',
			listener: function openOnKeyDown(e: KeyboardEvent) {
				if (e.key === 'ArrowDown' && !isNestedTriggerLocal) {
					e.preventDefault();
					handleTriggerClicked(e);
				}
			},
		});
	}, [isFocused, isLocalOpen, handleTriggerClicked]);

	const handleNestedOpen = useCallback(({ trigger }: { trigger: HTMLElement }) => {
		if (!trigger.matches(submenuTriggerSelector)) {
			return;
		}
		trigger.click();
	}, []);

	const handleTabClose = useCallback(() => {
		const currentMenu = popoverRef.current;
		if (!currentMenu) {
			return;
		}

		const menuStack = getMenuStack({ menu: currentMenu });

		// Ask every menu in the stack, innermost first. In one `flushSync`, so the menus that accept
		// hide before the browser performs the Tab default action.
		flushSync(() => {
			menuStack.forEach((menu) => menuTabCloseRequests.get(menu)?.());
		});
	}, []);

	useArrowNavigation({
		containerRef: popoverRef,
		onClose: handleTabClose,
		onNestedOpen: handleNestedOpen,
		onNestedClose: handleNestedClose,
		isEnabled: isLocalOpen,
		filter: isAtCurrentMenuLevel,
	});

	// Close on menu item click, as the WAI-ARIA APG menu pattern describes: activating an item
	// closes the menu. Checkbox and radio items, and submenu triggers, keep it open. Any other
	// item closes it, also an item that opens a popup (the popup must open outside the menu, or
	// in a modal). A click on an item of a nested menu also bubbles here, so every menu in the
	// stack closes and focus returns to the root trigger (only Escape and Left arrow go back one
	// level).
	const handleMenuClick = useCallback(
		(e: React.MouseEvent | React.KeyboardEvent) => {
			if (!(e.target instanceof Element)) {
				return;
			}
			const menuItem = e.target.closest?.(
				'[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]',
			);
			if (!menuItem) {
				return;
			}
			// A group title has `role="menuitem"` (see `GroupTitle`), but it is not an item. The legacy
			// menu closes only for its registered items.
			if (menuItem.matches(headingItemSelector)) {
				return;
			}
			const isCheckboxOrRadio =
				menuItem.getAttribute('role') === 'menuitemcheckbox' ||
				menuItem.getAttribute('role') === 'menuitemradio';
			if (!isCheckboxOrRadio && !menuItem.matches(submenuTriggerSelector)) {
				// APG menu button: choosing an item focuses the trigger. Do it now, in the click. React
				// applies the item's change before the menu hides, so an item that this click disables,
				// removes or moves has lost focus by then, and `Popover` does not move lost focus.
				// Focus that the item's handler moved elsewhere stays.
				const trigger = triggerRef.current;
				const activeElement = trigger?.ownerDocument.activeElement;
				if (
					trigger?.isConnected &&
					(activeElement === trigger.ownerDocument.body ||
						popoverRef.current?.contains(activeElement ?? null))
				) {
					trigger.focus({ preventScroll: true });
				}
				closeMenu({ event: e.nativeEvent });
			}
		},
		[closeMenu],
	);

	const ariaAttributes = getAriaForTrigger({
		role: 'menu',
		isOpen: isLocalOpen,
		popoverId,
	});

	/**
	 * Custom trigger consumers historically receive a callback ref,
	 * and their code assumes it is one.
	 * Using this wrapper for compatibility...
	 */
	const setTriggerRef = useCallback((node: HTMLElement | null) => {
		triggerRef.current = node;
	}, []);

	const renderTrigger = () => {
		if (typeof trigger === 'function') {
			return (
				<DropdownTriggerContext.Provider value={true}>
					{trigger({
						...ariaAttributes,
						onFocus: bindFocus.onFocus,
						onBlur: bindFocus.onBlur,
						triggerRef: setTriggerRef,
						isSelected: isLocalOpen,
						onClick: handleTriggerClicked,
						testId: testId && `${testId}--trigger`,
					})}
				</DropdownTriggerContext.Provider>
			);
		}

		return (
			<Button
				onFocus={bindFocus.onFocus}
				onBlur={bindFocus.onBlur}
				ref={setTriggerRef}
				{...ariaAttributes}
				isSelected={isLocalOpen}
				iconAfter={(iconProps) => <ExpandIcon {...iconProps} size="small" />}
				onClick={handleTriggerClicked}
				testId={testId && `${testId}--trigger`}
				aria-label={label}
				interactionName={interactionName}
			>
				{trigger}
			</Button>
		);
	};

	if (fg('platform-dst-new-menu')) {
		return (
			<SelectionStore>
				{renderTrigger()}
				<Popover
					ref={popoverRef}
					id={popoverId}
					role="menu"
					label={menuLabel ?? label ?? (typeof trigger === 'string' ? trigger : 'Menu')}
					isOpen={isLocalOpen}
					mode="manual"
					onClose={handleOnClose}
					shouldAnimate
					placement={topLayerPlacement}
					testId={testId && `${testId}--content`}
				>
					<PopoverSurface>
						{/* eslint-disable-next-line @atlassian/a11y/click-events-have-key-events, @atlassian/a11y/no-static-element-interactions, @atlassian/a11y/interactive-element-not-keyboard-focusable */}
						<div
							css={[
								styles.newWrapper,
								styles.height,
								shouldFitContainer ? undefined : styles.width,
							]}
							onClick={handleMenuClick}
							data-testid={testId && `${testId}--menu-wrapper--menu-group`}
						>
							{isLoading ? (
								<LoadingIndicator
									statusLabel={statusLabel}
									testId={testId && `${testId}--menu-wrapper--loading-indicator`}
								/>
							) : (
								children
							)}
						</div>
					</PopoverSurface>
				</Popover>
			</SelectionStore>
		);
	}

	return (
		<SelectionStore>
			{renderTrigger()}
			<Popover
				ref={setPopoverRef}
				id={popoverId}
				role="menu"
				label={menuLabel ?? label ?? (typeof trigger === 'string' ? trigger : 'Menu')}
				isOpen={isLocalOpen}
				mode="manual"
				onClose={handleOnClose}
				shouldAnimate
				placement={topLayerPlacement}
				testId={testId && `${testId}--content`}
			>
				<PopoverSurface>
					<MenuGroup
						maxHeight={MAX_HEIGHT}
						maxWidth={shouldFitContainer ? undefined : MAX_WIDTH}
						onClick={handleMenuClick}
						spacing={oldSpacing}
						testId={testId && `${testId}--menu-wrapper--menu-group`}
					>
						{isLoading ? (
							<LoadingIndicator
								statusLabel={statusLabel}
								testId={testId && `${testId}--menu-wrapper--loading-indicator`}
							/>
						) : (
							children
						)}
					</MenuGroup>
				</PopoverSurface>
			</Popover>
		</SelectionStore>
	);
}

export default DropdownMenuTopLayer;
