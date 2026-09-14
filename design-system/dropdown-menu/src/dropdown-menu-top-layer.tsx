/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useEffect, useMemo, useRef } from 'react';

import { cssMap, jsx } from '@compiled/react';
import { bind } from 'bind-event-listener';

import Button from '@atlaskit/button/default/button';
import { KEY_DOWN } from '@atlaskit/ds-lib/keycodes';
import noop from '@atlaskit/ds-lib/noop';
import useControlledState from '@atlaskit/ds-lib/use-controlled';
import useFocus from '@atlaskit/ds-lib/use-focus-event';
import ExpandIcon from '@atlaskit/icon/core/chevron-down';
import MenuGroup from '@atlaskit/menu/menu-group';
import Spinner from '@atlaskit/spinner/spinner';
import { token } from '@atlaskit/tokens';
import { getAriaForTrigger } from '@atlaskit/top-layer/get-aria-for-trigger';
import type { TLegacyPlacement } from '@atlaskit/top-layer/legacy-placements';
import { fromLegacyPlacement } from '@atlaskit/top-layer/placement-map/index';
import { Popover } from '@atlaskit/top-layer/popover/popover';
import { PopoverSurface } from '@atlaskit/top-layer/popover-surface';
import { useAnchorPosition } from '@atlaskit/top-layer/use-anchor-position';
import { isAtCurrentMenuLevel } from '@atlaskit/top-layer/is-at-current-menu-level';
import { useArrowNavigation } from '@atlaskit/top-layer/use-arrow-navigation/use-arrow-navigation';
import { usePopoverId } from '@atlaskit/top-layer/use-popover-id';
import { useWidthFromAnchor } from '@atlaskit/top-layer/use-width-from-anchor';

import SelectionStore from './internal/context/selection-store';
import type { DropdownMenuProps } from './types';

const MAX_HEIGHT = `calc(100vh - 16px)`;

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
});

/**
 * Event types produced by trigger interactions.
 *
 * - `React.MouseEvent<Element>`: from the trigger's `onClick` handler
 * - `React.KeyboardEvent<Element>`: from the trigger's `onClick` when activated via keyboard
 * - `KeyboardEvent`: native event from the ArrowDown `bind(window, ...)` listener
 */
type TriggerEvent = React.MouseEvent<Element> | React.KeyboardEvent<Element> | KeyboardEvent;

function getRootMenuPopover({ menu }: { menu: HTMLElement }): HTMLElement {
	const parentMenu = menu.parentElement?.closest<HTMLElement>('[popover][role="menu"]');
	if (!parentMenu) {
		return menu;
	}

	return getRootMenuPopover({ menu: parentMenu });
}

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
		<div css={styles.spinnerContainer} role="menuitem">
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
 * - FocusLock / react-focus-lock: popover=auto provides light dismiss
 * - z-index: top layer is always above everything
 * - FocusManager (ref registration): replaced by DOM-query-based `useArrowNavigation`
 * - handle-focus.tsx: replaced by `useArrowNavigation`
 * - Layering context: top layer nesting is handled by the browser
 * - Fallback placements / Popper: CSS Anchor Positioning handles positioning
 */
function DropdownMenuTopLayer({
	children,
	defaultOpen = false,
	isLoading = false,
	isOpen: isOpenProp,
	onOpenChange = noop,
	placement = 'bottom-start',
	shouldFitContainer = false,
	returnFocusRef,
	spacing,
	statusLabel,
	testId,
	trigger,
	label,
	interactionName,
	menuLabel,
}: DropdownMenuProps): React.JSX.Element {
	const [isLocalOpen, setLocalIsOpen] = useControlledState(isOpenProp, () => defaultOpen);
	const triggerRef = useRef<HTMLElement | null>(null);
	const popoverRef = useRef<HTMLDivElement>(null);

	const popoverId = usePopoverId();

	const topLayerPlacement = useMemo(
		() => fromLegacyPlacement({ legacy: placement as TLegacyPlacement }),
		[placement],
	);

	useAnchorPosition({
		anchorRef: triggerRef,
		popoverRef,
		placement: topLayerPlacement,
		isOpen: isLocalOpen,
	});

	useWidthFromAnchor({
		mode: shouldFitContainer ? 'min-anchor' : 'none',
		popoverRef,
		anchorRef: triggerRef,
		isOpen: isLocalOpen,
	});

	// Close handling.
	// Focus restoration is handled natively by the Popover API:
	//   - Escape: browser restores focus to the trigger automatically
	//   - Click-outside: browser does NOT restore (correct behavior)
	//
	// The only custom focus handling needed is `returnFocusRef`: when provided,
	// we redirect focus to a different element than the trigger. We do this
	// in the onClose callback via rAF, which runs after the browser's native
	// restoration, effectively overriding it.
	const handleOnClose = useCallback(() => {
		if (returnFocusRef) {
			requestAnimationFrame(() => {
				returnFocusRef.current?.focus();
			});
		}

		setLocalIsOpen(false);
		onOpenChange({ isOpen: false, event: null });
	}, [onOpenChange, returnFocusRef, setLocalIsOpen]);

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
		if (!isFocused || isLocalOpen) {
			return;
		}

		// Do not open on ArrowDown if this trigger is inside a parent menu.
		// Nested menus should only be opened via ArrowRight or Enter.
		const isNestedTrigger = Boolean(triggerRef.current?.closest('[role="menu"]'));

		return bind(window, {
			type: 'keydown',
			listener: function openOnKeyDown(e: KeyboardEvent) {
				if (e.key === KEY_DOWN && !isNestedTrigger) {
					e.preventDefault();
					handleTriggerClicked(e);
				}
			},
		});
	}, [isFocused, isLocalOpen, handleTriggerClicked]);

	const handleNestedOpen = useCallback(({ trigger }: { trigger: HTMLElement }) => {
		trigger.click();
	}, []);

	const handleTabClose = useCallback(() => {
		const currentMenu = popoverRef.current;
		if (!currentMenu) {
			return;
		}

		// Hiding the root native popover synchronously closes its descendant popovers and restores
		// focus to the root trigger. The browser can then perform the Tab default action from there.
		getRootMenuPopover({ menu: currentMenu }).hidePopover();
	}, []);

	useArrowNavigation({
		containerRef: popoverRef,
		onClose: handleTabClose,
		onNestedOpen: handleNestedOpen,
		onNestedClose: handleOnClose,
		isEnabled: isLocalOpen,
		filter: isAtCurrentMenuLevel,
	});

	// Close on menu item click.
	// Close when a regular menuitem is clicked, but not checkboxes/radios
	// and not nested triggers (items with aria-haspopup).
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
			const isCheckboxOrRadio =
				menuItem.getAttribute('role') === 'menuitemcheckbox' ||
				menuItem.getAttribute('role') === 'menuitemradio';
			// Do not close the menu when clicking a nested trigger (aria-haspopup).
			// The nested dropdown will handle its own open/close.
			const isNestedTrigger = menuItem.hasAttribute('aria-haspopup');
			if (!isCheckboxOrRadio && !isNestedTrigger) {
				setLocalIsOpen(false);
				onOpenChange({ isOpen: false, event: e.nativeEvent });
			}
		},
		[setLocalIsOpen, onOpenChange],
	);

	const ariaAttributes = getAriaForTrigger({ role: 'menu', isOpen: isLocalOpen, popoverId });

	// FUDGE(top-layer-api): cast `aria-haspopup` to the narrow shape that adopter
	// public types expect. `@atlaskit/top-layer` types `aria-haspopup` as the wider
	// WAI-ARIA union, but the public `CustomTriggerProps` (extending `@atlaskit/popup`
	// `TriggerProps`) is intentionally kept narrow (`boolean | 'dialog'`) because the
	// top-layer API surface is not yet settled. The runtime value is unchanged; only
	// the TypeScript-visible type is narrowed at this boundary.
	const narrowAriaAttributes = ariaAttributes as {
		'aria-controls': string | undefined;
		'aria-expanded': boolean;
		'aria-haspopup': boolean | 'dialog';
	};

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
			return trigger({
				...narrowAriaAttributes,
				onFocus: bindFocus.onFocus,
				onBlur: bindFocus.onBlur,
				triggerRef: setTriggerRef,
				isSelected: isLocalOpen,
				onClick: handleTriggerClicked,
				testId: testId && `${testId}--trigger`,
			});
		}

		return (
			<Button
				onFocus={bindFocus.onFocus}
				onBlur={bindFocus.onBlur}
				ref={setTriggerRef}
				{...narrowAriaAttributes}
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

	return (
		<SelectionStore>
			{renderTrigger()}
			<Popover
				ref={popoverRef}
				id={popoverId}
				role="menu"
				label={menuLabel ?? label ?? (typeof trigger === 'string' ? trigger : 'Menu')}
				isOpen={isLocalOpen}
				onClose={handleOnClose}
				shouldAnimate
				placement={topLayerPlacement}
				testId={testId && `${testId}--content`}
			>
				<PopoverSurface>
					<MenuGroup
						maxHeight={MAX_HEIGHT}
						maxWidth={shouldFitContainer ? undefined : 800}
						onClick={handleMenuClick}
						spacing={spacing}
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
