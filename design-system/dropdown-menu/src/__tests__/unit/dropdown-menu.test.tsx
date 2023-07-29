import React, { useState } from 'react';

import { act, fireEvent, render } from '@testing-library/react';

import Button from '@atlaskit/button/standard-button';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '../../index';

const getAllMenuItems = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('button[role="menuitem"]'));

describe('dropdown menu', () => {
  describe('trigger', () => {
    it('there should be a trigger button by default', () => {
      const { container } = render(<DropdownMenu />);

      const trigger = container.querySelector('button');

      expect(trigger).toBeInTheDocument();
    });

    it('trigger button with text', () => {
      const triggerText = 'click me to open';
      const { getByText } = render(<DropdownMenu trigger={triggerText} />);

      const trigger = getByText(triggerText);

      expect(trigger).toBeInTheDocument();
    });

    it('should callback with flipped state when closed and controlled', () => {
      const callback = jest.fn();
      const { getByTestId } = render(
        <DropdownMenu onOpenChange={callback} testId="ddm" isOpen={false} />,
      );

      act(() => {
        fireEvent.click(getByTestId('ddm--trigger'));
      });

      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({ isOpen: true }),
      );
    });

    it('should callback with flipped state when opened and controlled', () => {
      const callback = jest.fn();
      const { getByTestId } = render(
        <DropdownMenu onOpenChange={callback} testId="ddm" isOpen />,
      );
      act(() => {
        fireEvent.click(getByTestId('ddm--trigger'));
      });

      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({ isOpen: false }),
      );
    });

    it('should callback with false when opened', () => {
      const callback = jest.fn();
      render(<DropdownMenu onOpenChange={callback} testId="ddm" isOpen />);
      act(() => {
        fireEvent.click(document.body);
      });
      expect(callback).toHaveBeenCalledWith({
        isOpen: false,
        event: new MouseEvent('click'),
      });
    });

    it('should open the menu list when button is clicked', () => {
      const triggerText = 'click me to open';

      const { getByText, container } = render(
        <DropdownMenu trigger={triggerText}>
          <DropdownItemGroup>
            <DropdownItem>Move</DropdownItem>
            <DropdownItem>Clone</DropdownItem>
            <DropdownItem>Delete</DropdownItem>
          </DropdownItemGroup>
        </DropdownMenu>,
      );

      expect(getAllMenuItems(container).length).toEqual(0);

      act(() => {
        fireEvent.click(getByText(triggerText));
      });

      expect(getByText('Move')).toBeInTheDocument();
      expect(getByText('Clone')).toBeInTheDocument();
      expect(getByText('Delete')).toBeInTheDocument();
    });
  });

  describe('nested dropdown', () => {
    const NestedDropdownItem = ({ level = 1 }) => {
      return (
        <DropdownItem
          component={({ children }) => {
            return (
              <DropdownMenu
                placement="right-start"
                trigger="nested"
                testId={`nested-${level}`}
              >
                {children}
              </DropdownMenu>
            );
          }}
        >
          <DropdownItemGroup>
            <NestedDropdownItem level={level + 1} />
            <DropdownItem>One of many items</DropdownItem>
          </DropdownItemGroup>
        </DropdownItem>
      );
    };
    it('should render nested dropdown on the page', async () => {
      const { getByTestId, queryByTestId } = render(
        <DropdownMenu trigger="nested" testId="nested-0">
          <DropdownItemGroup>
            <NestedDropdownItem />
            <DropdownItem>One of many items</DropdownItem>
            <DropdownItem>One of many items</DropdownItem>
          </DropdownItemGroup>
        </DropdownMenu>,
      );
      let level = 0;
      while (level < 5) {
        // test nested dropdown can be opened correctly
        const nestedTrigger = getByTestId(`nested-${level}--trigger`);
        expect(nestedTrigger).toBeInTheDocument();
        act(() => {
          nestedTrigger.focus();
          fireEvent.click(nestedTrigger);
        });
        level += 1;
      }
      act(() => {
        // close the dropdown by pressing Escape
        fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
      });
      while (level > 0) {
        // test if all nested dropdown are closed
        const nestedTrigger = queryByTestId(`nested-${level}--trigger`);
        expect(nestedTrigger).not.toBeInTheDocument();
        level -= 1;
      }
    });
  });

  describe('customised trigger', () => {
    it('render custom button on the page', () => {
      const triggerText = 'click me to open';
      const { getByText } = render(
        <DropdownMenu
          trigger={(triggerProps) => (
            <Button {...triggerProps} data-test-id="native-button">
              {triggerText}
            </Button>
          )}
        />,
      );

      const trigger = getByText(triggerText);

      expect(trigger).toBeInTheDocument();
    });

    it('custom trigger to open popup', () => {
      const triggerText = 'click me to open';

      const DDMWithCustomTrigger = () => {
        const [isOpen, setOpen] = useState(false);
        return (
          <DropdownMenu
            isOpen={isOpen}
            trigger={(triggerProps) => (
              <Button
                {...triggerProps}
                onClick={() => setOpen(!isOpen)}
                data-test-id="native-button"
              >
                {triggerText}
              </Button>
            )}
          >
            <DropdownItemGroup>
              <DropdownItem>Move</DropdownItem>
              <DropdownItem>Clone</DropdownItem>
              <DropdownItem>Delete</DropdownItem>
            </DropdownItemGroup>
          </DropdownMenu>
        );
      };

      const { getByText } = render(<DDMWithCustomTrigger />);

      const trigger = getByText(triggerText);

      act(() => {
        fireEvent.click(trigger);
      });

      expect(getByText('Move')).toBeInTheDocument();
      expect(getByText('Clone')).toBeInTheDocument();
      expect(getByText('Delete')).toBeInTheDocument();
    });
  });

  describe('isLoading status', () => {
    it('does not display the dropdown item when loading', async () => {
      const triggerText = 'click me to open';

      const { getByText, queryAllByRole } = render(
        <DropdownMenu trigger={triggerText} isLoading>
          <DropdownItemGroup>
            <DropdownItem>Loaded action</DropdownItem>
          </DropdownItemGroup>
        </DropdownMenu>,
      );

      act(() => {
        fireEvent.click(getByText(triggerText));
      });

      let menuItems = (queryAllByRole('menuitem') || []).map(
        (x) => x.innerText,
      );

      expect(menuItems.length).toBe(0);
    });

    it('display default label to indicate in loading status', async () => {
      const triggerText = 'click me to open';
      const statusLabel = 'Loading';

      const { getByText, findByRole } = render(
        <DropdownMenu trigger={triggerText} isLoading>
          <DropdownItemGroup>
            <DropdownItem>Loaded action</DropdownItem>
          </DropdownItemGroup>
        </DropdownMenu>,
      );

      act(() => {
        fireEvent.click(getByText(triggerText));
      });

      const status = await findByRole('status');
      expect(status.innerText).toEqual(statusLabel);
    });

    it('display label to indicate in loading status', async () => {
      const triggerText = 'click me to open';
      const statusLabel = 'the content is loading';

      const { getByText, findByRole } = render(
        <DropdownMenu trigger={triggerText} isLoading statusLabel={statusLabel}>
          <DropdownItemGroup>
            <DropdownItem>Loaded action</DropdownItem>
          </DropdownItemGroup>
        </DropdownMenu>,
      );

      act(() => {
        fireEvent.click(getByText(triggerText));
      });

      const status = await findByRole('status');
      expect(status.innerText).toEqual(statusLabel);
    });

    it('should close the dropdown menu on outside click', () => {
      const { getByTestId, queryByTestId } = render(
        <>
          <button data-testid="outside" type="button" />
          <DropdownMenu testId="ddm" trigger="click to open" />
        </>,
      );

      act(() => {
        fireEvent.click(getByTestId('ddm--trigger'));
      });

      expect(getByTestId('ddm--content')).toBeInTheDocument();

      act(() => {
        fireEvent.click(getByTestId('outside'));
      });

      expect(queryByTestId('ddm--content')).not.toBeInTheDocument();
    });

    it('should close the dropdown menu on outside click which has stopPropagation', () => {
      const { getByTestId, queryByTestId } = render(
        <>
          <button
            data-testid="outside"
            type="button"
            onClick={(e) => e.stopPropagation()}
          />
          <DropdownMenu testId="ddm" trigger="click to open" />
        </>,
      );

      act(() => {
        fireEvent.click(getByTestId('ddm--trigger'));
      });

      expect(getByTestId('ddm--content')).toBeInTheDocument();

      act(() => {
        fireEvent.click(getByTestId('outside'));
      });

      expect(queryByTestId('ddm--content')).not.toBeInTheDocument();
    });

    it('should generate a psuedorandom id to link the trigger and the popup if none was passed to it', () => {
      const { getByTestId } = render(
        <DropdownMenu trigger={'click to open'} isOpen testId="dropdown">
          <DropdownItemGroup>
            <DropdownItem>Move</DropdownItem>
            <DropdownItem>Clone</DropdownItem>
            <DropdownItem>Delete</DropdownItem>
          </DropdownItemGroup>
        </DropdownMenu>,
      );
      const ariaControls =
        getByTestId('dropdown--trigger').getAttribute('aria-controls');
      const popupId = getByTestId('dropdown--content').getAttribute('id');

      expect(ariaControls).toBe(popupId);
    });

    it('should generate a psuedorandom id to link the custom trigger and the popup if none was passed to it', () => {
      const { getByTestId } = render(
        <DropdownMenu
          trigger={({ triggerRef, ...props }) => (
            <Button ref={triggerRef} {...props} type="button" />
          )}
          isOpen
          testId="dropdown"
        >
          <DropdownItemGroup>
            <DropdownItem>Move</DropdownItem>
            <DropdownItem>Clone</DropdownItem>
            <DropdownItem>Delete</DropdownItem>
          </DropdownItemGroup>
        </DropdownMenu>,
      );
      const ariaControls =
        getByTestId('dropdown--trigger').getAttribute('aria-controls');
      const popupId = getByTestId('dropdown--content').getAttribute('id');

      expect(ariaControls).toBe(popupId);
    });
  });
});
