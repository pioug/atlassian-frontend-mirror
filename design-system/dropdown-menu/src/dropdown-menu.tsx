/** @jsx jsx */
import { useCallback, useEffect, useState } from 'react';

import { css, jsx } from '@emotion/core';
import { bind } from 'bind-event-listener';

import Button from '@atlaskit/button/standard-button';
import { KEY_DOWN } from '@atlaskit/ds-lib/keycodes';
import noop from '@atlaskit/ds-lib/noop';
import useControlledState from '@atlaskit/ds-lib/use-controlled';
import useFocus from '@atlaskit/ds-lib/use-focus-event';
import ExpandIcon from '@atlaskit/icon/glyph/chevron-down';
import Popup, { PopupProps, TriggerProps } from '@atlaskit/popup';
import Spinner from '@atlaskit/spinner';
import { gridSize as gridSizeFn, layers } from '@atlaskit/theme/constants';
import VisuallyHidden from '@atlaskit/visually-hidden';

import FocusManager from './internal/components/focus-manager';
import MenuWrapper from './internal/components/menu-wrapper';
import SelectionStore from './internal/context/selection-store';
import useGeneratedId from './internal/utils/use-generated-id';
import type { DropdownMenuProps } from './types';

const gridSize = gridSizeFn();
const spinnerContainerStyles = css({
  display: 'flex',
  minWidth: `${gridSize * 20}px`,
  padding: `${gridSize * 2.5}px`,
  justifyContent: 'center',
});
const MAX_HEIGHT = `calc(100vh - ${gridSize * 2}px)`;
const fallbackPlacements: PopupProps['fallbackPlacements'] = [
  'bottom',
  'bottom-end',
  'right-start',
  'left-start',
  'auto',
];

/**
 * __Dropdown menu__
 *
 * A dropdown menu displays a list of actions or options to a user.
 *
 * - [Examples](https://atlassian.design/components/dropdown-menu/examples)
 * - [Code](https://atlassian.design/components/dropdown-menu/code)
 * - [Usage](https://atlassian.design/components/dropdown-menu/usage)
 */
const DropdownMenu = (props: DropdownMenuProps) => {
  const {
    defaultOpen = false,
    isOpen,
    onOpenChange = noop,
    children,
    placement = 'bottom-start',
    trigger,
    shouldFlip = true,
    isLoading = false,
    autoFocus = false,
    testId,
    statusLabel = 'Loading',
    zIndex = layers.modal(),
  } = props;
  const [isLocalOpen, setLocalIsOpen] = useControlledState(
    isOpen,
    () => defaultOpen,
  );

  const [isTriggeredUsingKeyboard, setTriggeredUsingKeyboard] = useState(false);

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
        trigger={(triggerProps: TriggerProps) => {
          if (typeof trigger === 'function') {
            const { ref, ...providedProps } = triggerProps;

            return trigger({
              ...providedProps,
              ...bindFocus,
              triggerRef: ref,
              isSelected: isLocalOpen,
              onClick: handleTriggerClicked,
              testId: testId && `${testId}--trigger`,
            });
          }

          return (
            <Button
              {...bindFocus}
              ref={triggerProps.ref}
              aria-controls={triggerProps['aria-controls']}
              aria-expanded={triggerProps['aria-expanded']}
              aria-haspopup={triggerProps['aria-haspopup']}
              isSelected={isLocalOpen}
              iconAfter={<ExpandIcon size="medium" label="expand" />}
              onClick={handleTriggerClicked}
              testId={testId && `${testId}--trigger`}
            >
              {trigger}
            </Button>
          );
        }}
        content={({ setInitialFocusRef }) => (
          <FocusManager>
            <MenuWrapper
              maxHeight={MAX_HEIGHT}
              maxWidth={800}
              onClose={handleOnClose}
              setInitialFocusRef={
                isTriggeredUsingKeyboard || autoFocus
                  ? setInitialFocusRef
                  : undefined
              }
            >
              {isLoading ? (
                <div css={spinnerContainerStyles}>
                  <Spinner size="small" />
                  <VisuallyHidden role="status">{statusLabel}</VisuallyHidden>
                </div>
              ) : (
                children
              )}
            </MenuWrapper>
          </FocusManager>
        )}
      />
    </SelectionStore>
  );
};

export default DropdownMenu;
