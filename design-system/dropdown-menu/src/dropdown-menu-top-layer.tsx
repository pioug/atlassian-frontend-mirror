/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { cssMap, jsx } from '@compiled/react';
import { bind } from 'bind-event-listener';

import Button from '@atlaskit/button/new';
import { KEY_DOWN, KEY_ENTER, KEY_SPACE } from '@atlaskit/ds-lib/keycodes';
import mergeRefs from '@atlaskit/ds-lib/merge-refs';
import noop from '@atlaskit/ds-lib/noop';
import useControlledState from '@atlaskit/ds-lib/use-controlled';
import useFocus from '@atlaskit/ds-lib/use-focus-event';
import ExpandIcon from '@atlaskit/icon/core/chevron-down';
import MenuGroup from '@atlaskit/menu/menu-group';
import Spinner from '@atlaskit/spinner';
import { token } from '@atlaskit/tokens';
import { slideAndFade } from '@atlaskit/top-layer/animations';
import { getAriaForTrigger } from '@atlaskit/top-layer/get-aria-for-trigger';
import { fromLegacyPlacement, type TLegacyPlacement } from '@atlaskit/top-layer/placement-map';
import { Popover, type TPopoverCloseReason } from '@atlaskit/top-layer/popover';
import { useAnchorPosition } from '@atlaskit/top-layer/use-anchor-position';
import { usePopoverId } from '@atlaskit/top-layer/use-popover-id';
import { useWidthFromAnchor } from '@atlaskit/top-layer/use-width-from-anchor';

import SelectionStore from './internal/context/selection-store';
import {
	getFirstFocusable,
	isAtCurrentMenuLevel,
	useArrowNavigation,
} from './internal/use-arrow-navigation';
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
	menuContent: {
		// Surface styles matching current dropdown appearance
		backgroundColor: token('elevation.surface.overlay'),
		borderRadius: token('radius.small', '3px'),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		boxShadow: token('elevation.shadow.overlay'),
	},
});

const animation = slideAndFade();

/**
 * Event types produced by trigger interactions.
 *
 * - `React.MouseEvent<Element>`: from the trigger's `onClick` handler
 * - `React.KeyboardEvent<Element>`: from the trigger's `onClick` when activated via keyboard
 * - `KeyboardEvent`: native event from the ArrowDown `bind(window, ...)` listener
 */
type TriggerEvent = React.MouseEvent<Element> | React.KeyboardEvent<Element> | KeyboardEvent;

/**
 * Determines whether a trigger interaction was keyboard-initiated.
 *
 * Keyboard signals:
 * - `type === 'keydown'` (native KeyboardEvent from ArrowDown handler)
 * - `clientX/clientY === 0` (assistive technology click)
 * - `detail === 0` (keyboard-activated click via Enter/Space)
 */
function isKeyboardTriggered(event: TriggerEvent): boolean {
	if (event.type === 'keydown') {
		return true;
	}
	if ('clientX' in event && (event.clientX === 0 || event.clientY === 0)) {
		return true;
	}
	if (event.detail === 0) {
		return true;
	}
	return false;
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
	autoFocus = false,
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
	const menuRef = useRef<HTMLDivElement>(null);
	const [isTriggeredUsingKeyboard, setTriggeredUsingKeyboard] = useState(false);

	const popoverId = usePopoverId();

	const topLayerPlacement = useMemo(
		() => fromLegacyPlacement({ legacy: placement as TLegacyPlacement }),
		[placement],
	);

	useAnchorPosition({
		anchorRef: triggerRef,
		popoverRef,
		placement: topLayerPlacement,
	});

	useWidthFromAnchor({
		mode: shouldFitContainer ? 'min-anchor' : 'none',
		popoverRef,
		anchorRef: triggerRef,
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
	const handleOnClose = useCallback(
		({ reason: _reason }: { reason: TPopoverCloseReason }) => {
			if (returnFocusRef) {
				requestAnimationFrame(() => {
					returnFocusRef.current?.focus();
				});
			}

			setLocalIsOpen(false);
			onOpenChange({ isOpen: false, event: null });
		},
		[onOpenChange, returnFocusRef, setLocalIsOpen],
	);

	// Trigger click handling.
	const handleTriggerClicked = useCallback(
		(event: TriggerEvent) => {
			const newValue = !isLocalOpen;
			setTriggeredUsingKeyboard(isKeyboardTriggered(event));
			setLocalIsOpen(newValue);

			// Extract the native DOM event for onOpenChange
			const nativeEvent: Event = 'nativeEvent' in event ? event.nativeEvent : event;
			onOpenChange({ isOpen: newValue, event: nativeEvent });
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
			return noop;
		}

		// Do not open on ArrowDown if this trigger is inside a parent menu.
		// Nested menus should only be opened via ArrowRight or Enter.
		const isNestedTrigger = triggerRef.current?.closest('[role="menu"]') != null;

		return bind(window, {
			type: 'keydown',
			listener: function openOnKeyDown(e: KeyboardEvent) {
				if (e.key === KEY_DOWN && !isNestedTrigger) {
					e.preventDefault();
					handleTriggerClicked(e);
				} else if ((e.code === KEY_SPACE || e.key === KEY_ENTER) && e.detail === 0) {
					setTriggeredUsingKeyboard(true);
				}
			},
		});
	}, [isFocused, isLocalOpen, handleTriggerClicked]);

	// Arrow navigation.
	// useArrowNavigation handles ArrowUp/Down, Home/End, and Tab-to-close
	// by querying focusable elements in the menu DOM container.
	const handleArrowClose = useCallback(() => {
		handleOnClose({ reason: 'escape' });
	}, [handleOnClose]);

	const handleNestedOpen = useCallback(({ trigger }: { trigger: HTMLElement }) => {
		trigger.click();
	}, []);

	const handleNestedClose = useCallback(() => {
		handleOnClose({ reason: 'escape' });
	}, [handleOnClose]);

	useArrowNavigation({
		containerRef: menuRef,
		onClose: handleArrowClose,
		onNestedOpen: handleNestedOpen,
		onNestedClose: handleNestedClose,
		isEnabled: isLocalOpen,
		filter: isAtCurrentMenuLevel,
	});

	// Auto-focus first item on open.
	useEffect(() => {
		if (!isLocalOpen || (!isTriggeredUsingKeyboard && !autoFocus)) {
			return;
		}

		requestAnimationFrame(() => {
			const menu = menuRef.current;
			if (!menu) {
				return;
			}
			const firstItem = getFirstFocusable({ container: menu });
			firstItem?.focus();
		});
	}, [isLocalOpen, isTriggeredUsingKeyboard, autoFocus]);

	// Close on menu item click.
	// Close when a regular menuitem is clicked, but not checkboxes/radios
	// and not nested triggers (items with aria-haspopup).
	const handleMenuClick = useCallback(
		(e: React.MouseEvent | React.KeyboardEvent) => {
			const target = e.target as HTMLElement;
			const menuItem = target.closest?.(
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
		'aria-controls': string;
		'aria-expanded': boolean;
		'aria-haspopup': boolean | 'dialog';
	};

	const renderTrigger = () => {
		const setRef = (node: HTMLElement | null) => {
			triggerRef.current = node;
		};
		const combinedRef = mergeRefs([setRef]);

		if (typeof trigger === 'function') {
			return trigger({
				...narrowAriaAttributes,
				...bindFocus,
				triggerRef: combinedRef,
				isSelected: isLocalOpen,
				onClick: handleTriggerClicked,
				testId: testId && `${testId}--trigger`,
			});
		}

		return (
			<Button
				{...bindFocus}
				ref={combinedRef}
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
				animate={animation}
				placement={topLayerPlacement}
				testId={testId && `${testId}--content`}
			>
				<div css={styles.menuContent} ref={menuRef}>
					<MenuGroup
						isLoading={isLoading}
						maxHeight={MAX_HEIGHT}
						maxWidth={shouldFitContainer ? undefined : 800}
						onClick={handleMenuClick}
						role="menu"
						spacing={spacing}
						testId={testId && `${testId}--menu-wrapper--menu-group`}
						menuLabel={menuLabel}
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
				</div>
			</Popover>
		</SelectionStore>
	);
}

export default DropdownMenuTopLayer;
