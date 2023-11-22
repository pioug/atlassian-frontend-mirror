import React, { type Ref } from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import {
  UNSAFE_BUTTON as Button,
  UNSAFE_ICON_BUTTON as IconButton,
} from '@atlaskit/button/unsafe';
import DropdownMenu, {
  DropdownItem,
  DropdownItemGroup,
} from '@atlaskit/dropdown-menu';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';

import { PrimarySplitButton } from '../../../components/PrimarySplitButton';

describe('PrimarySplitButton', () => {
  const primaryActionClickMock = jest.fn();
  const secondaryActionClickMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should allow clicks for both actions when secondary action is icon button', () => {
    render(
      <PrimarySplitButton>
        <Button onClick={primaryActionClickMock}>Explore</Button>
        <DropdownMenu
          trigger={({ triggerRef, ...triggerProps }) => (
            <IconButton
              ref={triggerRef as Ref<HTMLButtonElement>}
              {...triggerProps}
              icon={ChevronDownIcon}
              label="Open link issue options"
              onClick={secondaryActionClickMock}
            />
          )}
        >
          <DropdownItemGroup>
            <DropdownItem>Option one</DropdownItem>
            <DropdownItem>Option two</DropdownItem>
          </DropdownItemGroup>
        </DropdownMenu>
      </PrimarySplitButton>,
    );

    const actions = screen.getAllByRole('button');
    fireEvent.click(actions[0]);
    fireEvent.click(actions[1]);

    expect(primaryActionClickMock).toHaveBeenCalledTimes(1);
    expect(secondaryActionClickMock).toHaveBeenCalledTimes(1);
  });

  it('should allow clicks for both actions when highlighted', () => {
    render(
      <PrimarySplitButton isHighlighted>
        <Button onClick={primaryActionClickMock}>Explore</Button>
        <DropdownMenu
          trigger={({ triggerRef, ...triggerProps }) => (
            <IconButton
              ref={triggerRef as Ref<HTMLButtonElement>}
              {...triggerProps}
              icon={ChevronDownIcon}
              label="Open link issue options"
              onClick={secondaryActionClickMock}
            />
          )}
        >
          <DropdownItemGroup>
            <DropdownItem>Option one</DropdownItem>
            <DropdownItem>Option two</DropdownItem>
          </DropdownItemGroup>
        </DropdownMenu>
      </PrimarySplitButton>,
    );

    const actions = screen.getAllByRole('button');
    fireEvent.click(actions[0]);
    fireEvent.click(actions[1]);

    expect(primaryActionClickMock).toHaveBeenCalledTimes(1);
    expect(secondaryActionClickMock).toHaveBeenCalledTimes(1);
  });
});
