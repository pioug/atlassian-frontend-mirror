import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { bind } from 'bind-event-listener';

import Button from '@atlaskit/button/standard-button';
import { UNSAFE_BUTTON } from '@atlaskit/button/unsafe';
import { KEY_DOWN } from '@atlaskit/ds-lib/keycodes';
import mergeRefs from '@atlaskit/ds-lib/merge-refs';
import noop from '@atlaskit/ds-lib/noop';
import useControlledState from '@atlaskit/ds-lib/use-controlled';
import useFocus from '@atlaskit/ds-lib/use-focus-event';
import ExpandIcon from '@atlaskit/icon/glyph/chevron-down';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import Popup, { TriggerProps } from '@atlaskit/popup';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { gridSize as gridSizeFn, layers } from '@atlaskit/theme/constants';

import {
  NestedLevelContext,
  TrackLevelProvider,
} from './internal/components/context';
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

const getFallbackPlacements = (
  placement: Placement,
): Placement[] | undefined => {
  const placementPieces = placement.split('-');
  const mainAxis = placementPieces[0] as mainAxes;

  // Left, right and auto placements can rely on standard popper sliding behaviour
  if (!['top', 'bottom'].includes(mainAxis)) {
    return undefined;
  }

  // Top and bottom placements need to flip to the right/left to ensure
  // long lists don't extend off the screen
  else if (
    placementPieces.length === 2 &&
    ['start', 'end'].includes(placementPieces[1])
  ) {
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
const DropdownMenu = <T extends HTMLElement = HTMLElement>(
  props: DropdownMenuProps<T>,
) => {
  const {
    defaultOpen = false,
    isOpen,
    onOpenChange = noop,
    children,
    placement = 'bottom-start',
    trigger,
    spacing,
    shouldFlip = true,
    shouldRenderToParent = false,
    isLoading = false,
    autoFocus = false,
    testId,
    statusLabel,
    zIndex = layers.modal(),
  } = props;
  const [isLocalOpen, setLocalIsOpen] = useControlledState(
    isOpen,
    () => defaultOpen,
  );
  const nestedLevel = useContext(NestedLevelContext);

  const [isTriggeredUsingKeyboard, setTriggeredUsingKeyboard] = useState(false);
  const fallbackPlacements = useMemo(
    () => getFallbackPlacements(placement),
    [placement],
  );

  const handleTriggerClicked = useCallback(
    // TODO: event is an `any` and is being cast incorrectly
    // This means that the public type for `onOpenChange` is incorrect
    // current: (event: React.MouseEvent | React.KeyboardEvent) => void;
    // correct: (event: React.MouseEvent | KeyboardEvent) => void;
    // https://product-fabric.atlassian.net/browse/DSP-4692
    (event) => {
      const newValue = !isLocalOpen;
      const { clientX, clientY, type } = event;
      if (type === 'keydown') {
        setTriggeredUsingKeyboard(true);
      } else if (clientX === 0 || clientY === 0) {
        // Hitting enter/space is registered as a click
        // with both clientX and clientY === 0
        setTriggeredUsingKeyboard(true);
      }

      setLocalIsOpen(newValue);
      onOpenChange({ isOpen: newValue, event });
    },
    [onOpenChange, isLocalOpen, setLocalIsOpen],
  );

  const handleOnClose = useCallback(
    (event) => {
      if (
        event.key !== 'Escape' &&
        event.target.closest(`[id^=${PREFIX}] [aria-haspopup]`)
      ) {
        // Check if it is within dropdown and it is a trigger button
        // if it is a nested dropdown, clicking trigger won't close the dropdown
        return;
      }
      const newValue = false;
      setLocalIsOpen(newValue);

      onOpenChange({ isOpen: newValue, event });
    },
    [onOpenChange, setLocalIsOpen],
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
        if (e.key === KEY_DOWN) {
          // prevent page scroll
          e.preventDefault();
          handleTriggerClicked(e);
        }
      },
    });
  }, [isFocused, isLocalOpen, handleTriggerClicked]);

  const id = useGeneratedId();
  const isNested = nestedLevel > 0;
  const itemRef = useRegisterItemWithFocusManager();

  return (
    <SelectionStore>
      <Popup
        id={isLocalOpen ? id : undefined}
        shouldFlip={shouldFlip}
        isOpen={isLocalOpen}
        onClose={isNested ? undefined : handleOnClose} // only outmost parent needs onCloseHandler
        zIndex={zIndex}
        placement={placement}
        fallbackPlacements={fallbackPlacements}
        testId={testId && `${testId}--content`}
        shouldUseCaptureOnOutsideClick
        shouldRenderToParent={
          getBooleanFF(
            'platform.design-system-team.render-popup-in-parent_f73ij',
          )
            ? shouldRenderToParent
            : undefined
        }
        trigger={(triggerProps: TriggerProps) => {
          if (typeof trigger === 'function') {
            const { ref, ...providedProps } = triggerProps;

            return trigger({
              ...providedProps,
              ...bindFocus,
              triggerRef: isNested ? mergeRefs([ref, itemRef]) : ref,
              isSelected: isLocalOpen,
              onClick: handleTriggerClicked,
              testId: testId && `${testId}--trigger`,
            });
          }

          return getBooleanFF(
            'platform.design-system-team.new-button-adoption-in-dropdown_p8sn4',
          ) ? (
            <UNSAFE_BUTTON
              iconAfter={<ExpandIcon size="medium" label="" />}
              onFocus={bindFocus.onFocus}
              onBlur={bindFocus.onBlur}
              ref={
                isNested
                  ? mergeRefs([triggerProps.ref, itemRef])
                  : triggerProps.ref
              }
              aria-controls={triggerProps['aria-controls']}
              aria-expanded={triggerProps['aria-expanded']}
              aria-haspopup={triggerProps['aria-haspopup']}
              isSelected={isLocalOpen}
              onClick={handleTriggerClicked}
              testId={testId && `${testId}--trigger`}
            >
              {trigger}
            </UNSAFE_BUTTON>
          ) : (
            <Button
              {...bindFocus}
              ref={
                isNested
                  ? mergeRefs([triggerProps.ref, itemRef])
                  : triggerProps.ref
              }
              aria-controls={triggerProps['aria-controls']}
              aria-expanded={triggerProps['aria-expanded']}
              aria-haspopup={triggerProps['aria-haspopup']}
              isSelected={isLocalOpen}
              iconAfter={<ExpandIcon size="medium" label="" />}
              onClick={handleTriggerClicked}
              testId={testId && `${testId}--trigger`}
            >
              {trigger}
            </Button>
          );
        }}
        content={({ setInitialFocusRef, update }) => {
          const content = (
            <FocusManager>
              <MenuWrapper
                spacing={spacing}
                maxHeight={MAX_HEIGHT}
                maxWidth={800}
                onClose={handleOnClose}
                onUpdate={update}
                isLoading={isLoading}
                statusLabel={statusLabel}
                setInitialFocusRef={
                  isTriggeredUsingKeyboard || autoFocus
                    ? setInitialFocusRef
                    : undefined
                }
              >
                <NestedLevelContext.Provider value={nestedLevel + 1}>
                  {children}
                </NestedLevelContext.Provider>
              </MenuWrapper>
            </FocusManager>
          );
          return isNested ? (
            content
          ) : (
            <TrackLevelProvider>{content}</TrackLevelProvider>
          );
        }}
      />
    </SelectionStore>
  );
};

export default DropdownMenu;
