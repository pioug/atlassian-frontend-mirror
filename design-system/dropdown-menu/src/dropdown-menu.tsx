/** @jsx jsx */
import { useCallback, useState } from 'react';

import { css, jsx } from '@emotion/core';

import Button from '@atlaskit/button/standard-button';
import { KEY_DOWN } from '@atlaskit/ds-lib/keycodes';
import noop from '@atlaskit/ds-lib/noop';
import useControlledState from '@atlaskit/ds-lib/use-controlled';
import useFocus from '@atlaskit/ds-lib/use-focus-event';
import useKeydownEvent from '@atlaskit/ds-lib/use-keydown-event';
import ExpandIcon from '@atlaskit/icon/glyph/chevron-down';
import Popup, { PopupProps, TriggerProps } from '@atlaskit/popup';
import Spinner from '@atlaskit/spinner';
import { gridSize as gridSizeFn, layers } from '@atlaskit/theme/constants';
import VisuallyHidden from '@atlaskit/visually-hidden';

import FocusManager from './internal/components/focus-manager';
import MenuWrapper from './internal/components/menu-wrapper';
import SelectionStore from './internal/context/selection-store';
import type { DropdownMenuProps } from './types';

const gridSize = gridSizeFn();
const spinnerContainerStyles = css({
  display: 'flex',
  minWidth: `${gridSize * 20}px`,
  padding: `${gridSize * 2.5}px`,
  justifyContent: 'center',
});
const MAX_HEIGHT = `calc(100vh - ${gridSize * 2}px)`;

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
    trigger: Trigger,
    shouldFlip = true,
    isLoading = false,
    autoFocus = false,
    testId,
    statusLabel = 'Loading',
  } = props;
  const [isLocalOpen, setLocalIsOpen] = useControlledState(
    isOpen,
    () => defaultOpen,
  );

  const [isTriggeredUsingKeyboard, setTriggeredUsingKeyboard] = useState(false);

  const handleTriggerClicked = useCallback(
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

  const handleOnClose = useCallback(() => {
    const newValue = false;
    setLocalIsOpen(newValue);
    onOpenChange({ isOpen: newValue });
  }, [onOpenChange, setLocalIsOpen]);

  const { isFocused, bindFocus } = useFocus();
  const handleDownArrow = (e: KeyboardEvent) => {
    if (e.key === KEY_DOWN) {
      // prevent page scroll
      e.preventDefault();
      handleTriggerClicked(e);
    }
  };
  useKeydownEvent(handleDownArrow, isFocused);

  const renderTrigger = (triggerProps: TriggerProps) => {
    if (typeof Trigger === 'function') {
      const { ref, ...providedProps } = triggerProps;
      return (
        <Trigger
          {...providedProps}
          {...bindFocus}
          triggerRef={ref}
          isSelected={isLocalOpen}
          onClick={handleTriggerClicked}
          testId={testId && `${testId}--trigger`}
        />
      );
    }

    return (
      <Button
        {...triggerProps}
        {...bindFocus}
        isSelected={isLocalOpen}
        iconAfter={<ExpandIcon size="medium" label="expand" />}
        onClick={handleTriggerClicked}
        testId={testId && `${testId}--trigger`}
      >
        {Trigger}
      </Button>
    );
  };

  const fallbackPlacements: PopupProps['fallbackPlacements'] = [
    'bottom',
    'bottom-end',
    'right-start',
    'left-start',
    'auto',
  ];

  return (
    <SelectionStore>
      <Popup
        shouldFlip={shouldFlip}
        isOpen={isLocalOpen}
        onClose={handleOnClose}
        zIndex={layers.modal()}
        placement={placement}
        fallbackPlacements={fallbackPlacements}
        testId={testId && `${testId}--content`}
        trigger={renderTrigger}
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
