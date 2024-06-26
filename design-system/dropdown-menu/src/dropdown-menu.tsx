/* eslint-disable import/order */
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { bind } from 'bind-event-listener';

import Button from '@atlaskit/button/new';
import { KEY_DOWN, KEY_ENTER, KEY_SPACE, KEY_TAB } from '@atlaskit/ds-lib/keycodes';

import mergeRefs from '@atlaskit/ds-lib/merge-refs';
import noop from '@atlaskit/ds-lib/noop';
import useControlledState from '@atlaskit/ds-lib/use-controlled';
import useFocus from '@atlaskit/ds-lib/use-focus-event';
import ExpandIcon from '@atlaskit/icon/glyph/chevron-down';
import Popup, { type TriggerProps } from '@atlaskit/popup';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { gridSize as gridSizeFn, layers } from '@atlaskit/theme/constants';

import FocusManager from './internal/components/focus-manager';
import MenuWrapper from './internal/components/menu-wrapper';
import SelectionStore from './internal/context/selection-store';
import useRegisterItemWithFocusManager from './internal/hooks/use-register-item-with-focus-manager';
import useGeneratedId, { PREFIX } from './internal/utils/use-generated-id';
import type { DropdownMenuProps, Placement } from './types';

const gridSize = gridSizeFn();

const MAX_HEIGHT = `calc(100vh - ${gridSize * 2}px)`;
type mainAxes = 'top' | 'bottom' | 'left' | 'right' | 'auto';
type crossAxes = 'start' | 'end';
const opposites = {
	top: 'bottom',
	bottom: 'top',
	left: 'right',
	right: 'left',
	start: 'end',
	auto: 'auto',
	end: 'start',
};

const getFallbackPlacements = (placement: Placement): Placement[] | undefined => {
	const placementPieces = placement.split('-');
	const mainAxis = placementPieces[0] as mainAxes;

	// Left, right and auto placements can rely on standard popper sliding behaviour
	if (!['top', 'bottom'].includes(mainAxis)) {
		return undefined;
	}

	// Top and bottom placements need to flip to the right/left to ensure
	// long lists don't extend off the screen
	else if (placementPieces.length === 2 && ['start', 'end'].includes(placementPieces[1])) {
		const crossAxis = placementPieces[1] as crossAxes;
		return [
			`${mainAxis}`,
			`${mainAxis}-${opposites[crossAxis]}`,
			`${opposites[mainAxis]}-${crossAxis}`,
			`${opposites[mainAxis]}`,
			`${opposites[mainAxis]}-${opposites[crossAxis]}`,
			'auto',
		] as Placement[];
	} else {
		return [
			`${mainAxis}-start`,
			`${mainAxis}-end`,
			`${opposites[mainAxis]}`,
			`${opposites[mainAxis]}-start`,
			`${opposites[mainAxis]}-end`,
			`auto`,
		] as Placement[];
	}
};

/**
 * __Dropdown menu__
 *
 * A dropdown menu displays a list of actions or options to a user.
 *
 * - [Examples](https://atlassian.design/components/dropdown-menu/examples)
 * - [Code](https://atlassian.design/components/dropdown-menu/code)
 * - [Usage](https://atlassian.design/components/dropdown-menu/usage)
 */
const DropdownMenu = <T extends HTMLElement = any>({
	autoFocus = false,
	children,
	defaultOpen = false,
	isLoading = false,
	isOpen,
	onOpenChange = noop,
	placement = 'bottom-start',
	shouldFitContainer = false,
	shouldFlip = true,
	shouldRenderToParent = false,
	spacing,
	statusLabel,
	testId,
	trigger,
	zIndex = layers.modal(),
	label,
}: DropdownMenuProps<T>) => {
	const [isLocalOpen, setLocalIsOpen] = useControlledState(isOpen, () => defaultOpen);

	const [isTriggeredUsingKeyboard, setTriggeredUsingKeyboard] = useState(false);
	const id = useGeneratedId();
	const itemRef = useRegisterItemWithFocusManager();

	const fallbackPlacements = useMemo(() => getFallbackPlacements(placement), [placement]);

	const handleTriggerClicked = useCallback(
		// TODO: event is an `any` and is being cast incorrectly
		// This means that the public type for `onOpenChange` is incorrect
		// current: (event: React.MouseEvent | React.KeyboardEvent) => void;
		// correct: (event: React.MouseEvent | KeyboardEvent) => void;
		// https://product-fabric.atlassian.net/browse/DSP-4692
		(event: any) => {
			const newValue = !isLocalOpen;
			const { clientX, clientY, type, detail } = event;

			if (type === 'keydown') {
				setTriggeredUsingKeyboard(true);
			} else if (clientX === 0 || clientY === 0) {
				// Hitting enter/space is registered as a click
				// with both clientX and clientY === 0
				setTriggeredUsingKeyboard(true);
			} else if (detail === 0) {
				// Fix for Safari. clientX and clientY !== 0 in Safari
				setTriggeredUsingKeyboard(true);
			} else {
				// The trigger element must be focused to avoid problems with an incorrectly focused element after closing DropdownMenu
				itemRef?.current?.focus();
				setTriggeredUsingKeyboard(false);
			}

			setLocalIsOpen(newValue);
			onOpenChange({ isOpen: newValue, event });
		},
		[itemRef, onOpenChange, isLocalOpen, setLocalIsOpen],
	);

	const handleOnClose = useCallback(
		(event: any) => {
			if (
				event.key !== 'Escape' &&
				event.key !== 'Tab' &&
				event.target?.closest?.(`[id^=${PREFIX}] [aria-haspopup]`)
			) {
				// Check if it is within dropdown and it is a trigger button
				// if it is a nested dropdown, clicking trigger won't close the dropdown
				// Dropdown can be closed by pressing Escape, Tab or Shift + Tab
				return;
			}

			if ((event.key === 'Tab' && event.shiftKey) || event.key === 'Escape') {
				requestAnimationFrame(() => {
					itemRef.current?.focus();
				});
			}

			const newValue = false;
			setLocalIsOpen(newValue);

			onOpenChange({ isOpen: newValue, event });
		},
		[onOpenChange, setLocalIsOpen, itemRef],
	);

	const { isFocused, bindFocus } = useFocus();

	// When a trigger is focused, we want to open the dropdown if
	// the user presses the DownArrow
	useEffect(() => {
		// Only need to listen for keydown when focused
		if (!isFocused) {
			return noop;
		}

		// Being safe: we don't want to open the dropdown if it is already open
		// Note: This shouldn't happen as the trigger should not be able to get focus
		if (isLocalOpen) {
			return noop;
		}

		return bind(window, {
			type: 'keydown',
			listener: function openOnKeyDown(e: KeyboardEvent) {
				let isNestedTriggerButton;
				if (e.target instanceof HTMLElement) {
					isNestedTriggerButton = e.target.closest(`[id^=${PREFIX}] [aria-haspopup]`);
				}

				if (e.key === KEY_DOWN && !isNestedTriggerButton) {
					// prevent page scroll
					e.preventDefault();
					handleTriggerClicked(e);
				} else if ((e.code === KEY_SPACE || e.key === KEY_ENTER) && e.detail === 0) {
					// This allows us to focus on the first element if the dropdown was triggered by a custom trigger with a custom onClick
					setTriggeredUsingKeyboard(true);
				} else if (e.key === KEY_TAB && isNestedTriggerButton) {
					// This closes dropdown if it is a nested dropdown
					handleOnClose(e);
				}
			},
		});
	}, [isFocused, isLocalOpen, handleTriggerClicked, handleOnClose]);

	/*
	 * The Popup component requires either:
	 * - shouldFitContainer={true} and shouldRenderToParent={true | undefined}
	 * or
	 * - shouldFitContainer={false | undefined} and shouldRenderToParent={true | false | undefined}
	 *
	 * But not:
	 * - shouldFitContainer={true} and shouldRenderToParent={false}
	 *
	 * By only including either shouldFitContainer or shouldRenderToParent, we can ensure that the Popup component
	 * types are satisfied.
	 */
	const conditionalProps = shouldFitContainer ? { shouldFitContainer } : { shouldRenderToParent };

	return (
		<SelectionStore>
			<Popup
				id={isLocalOpen ? id : undefined}
				shouldFlip={shouldFlip}
				isOpen={isLocalOpen}
				onClose={handleOnClose}
				zIndex={zIndex}
				placement={placement}
				fallbackPlacements={fallbackPlacements}
				testId={testId && `${testId}--content`}
				shouldUseCaptureOnOutsideClick
				{...conditionalProps}
				shouldDisableFocusLock
				trigger={({
					ref,
					'aria-controls': ariaControls,
					'aria-expanded': ariaExpanded,
					'aria-haspopup': ariaHasPopup,
					// DSP-13312 TODO: remove spread props in future major release
					...rest
				}: TriggerProps) => {
					if (typeof trigger === 'function') {
						return trigger({
							'aria-controls': ariaControls,
							'aria-expanded': ariaExpanded,
							'aria-haspopup': ariaHasPopup,
							...rest,
							...bindFocus,
							triggerRef: mergeRefs([ref, itemRef]),
							isSelected: isLocalOpen,
							onClick: handleTriggerClicked,
							testId: testId && `${testId}--trigger`,
						});
					}

					return (
						<Button
							{...bindFocus}
							ref={mergeRefs([ref, itemRef])}
							aria-controls={ariaControls}
							aria-expanded={ariaExpanded}
							aria-haspopup={ariaHasPopup}
							isSelected={isLocalOpen}
							iconAfter={ExpandIcon}
							onClick={handleTriggerClicked}
							testId={testId && `${testId}--trigger`}
							aria-label={label}
						>
							{trigger}
						</Button>
					);
				}}
				content={({ setInitialFocusRef, update }) => (
					<FocusManager onClose={handleOnClose}>
						<MenuWrapper
							spacing={spacing}
							maxHeight={MAX_HEIGHT}
							maxWidth={shouldFitContainer ? undefined : 800}
							onClose={handleOnClose}
							onUpdate={update}
							isLoading={isLoading}
							statusLabel={statusLabel}
							setInitialFocusRef={
								isTriggeredUsingKeyboard || autoFocus ? setInitialFocusRef : undefined
							}
							shouldRenderToParent={shouldRenderToParent || shouldFitContainer}
							isTriggeredUsingKeyboard={isTriggeredUsingKeyboard}
							autoFocus={autoFocus}
							testId={testId && `${testId}--menu-wrapper`}
						>
							{children}
						</MenuWrapper>
					</FocusManager>
				)}
			/>
		</SelectionStore>
	);
};

export default DropdownMenu;
