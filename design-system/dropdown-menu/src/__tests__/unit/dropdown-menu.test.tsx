import React, { useState } from 'react';

import { act, fireEvent, render, screen } from '@testing-library/react';

import Button from '@atlaskit/button/standard-button';
import { ffTest } from '@atlassian/feature-flags-test-utils';

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
    const NestedDropdown = ({ level = 0 }) => {
      return (
        <DropdownMenu
          placement="right-start"
          trigger="nested"
          testId={`nested-${level}`}
        >
          <DropdownItemGroup>
            <NestedDropdown level={level + 1} />
            <DropdownItem testId={`nested-item1-${level}`}>
              One of many items
            </DropdownItem>
            <DropdownItem testId={`nested-item2-${level}`}>
              One of many items
            </DropdownItem>
          </DropdownItemGroup>
        </DropdownMenu>
      );
    };
    // should render nested dropdown on the page
    ffTest(
      'platform.design-system-team.layering_qmiw3',
      // Test when true
      () => {
        render(<NestedDropdown />);
        let level = 0;
        while (level < 5) {
          // test nested dropdown can be opened correctly
          const nestedTrigger = screen.getByTestId(`nested-${level}--trigger`);
          expect(nestedTrigger).toBeInTheDocument();
          fireEvent.click(nestedTrigger);
          level += 1;
        }
        while (level > 0) {
          // close the dropdown by pressing Escape
          fireEvent.keyDown(document, { key: 'Escape', code: 27 });
          // 0 timeout is needed to meet the same flow in layering
          // avoid immediate cleanup using setTimeout when component unmount
          // this will make sure non-top layer components can get the correct top level value
          // when multiple layers trigger onClose in sequence.
          setTimeout(() => {
            // test if top level of nested dropdown is closed
            expect(
              screen.queryByTestId(`nested-${level}--trigger`),
            ).not.toBeInTheDocument();
          }, 0);
          level -= 1;
          expect(
            screen.getByTestId(`nested-${level}--trigger`),
          ).toBeInTheDocument();
        }
      },
      () => {
        render(<NestedDropdown />);
        // test nested dropdown can be opened correctly
        const nestedTrigger = screen.getByTestId('nested-0--trigger');
        expect(nestedTrigger).toBeInTheDocument();
        fireEvent.click(nestedTrigger);
        const nestedItem1 = screen.getByTestId('nested-1--trigger');
        expect(nestedItem1).not.toHaveFocus();
      },
    );
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
    const testId = 'test';

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
      const defaultLoadingText = 'Loading';

      render(
        <DropdownMenu trigger={triggerText} isLoading testId={testId}>
          <DropdownItemGroup>
            <DropdownItem>Loaded action</DropdownItem>
          </DropdownItemGroup>
        </DropdownMenu>,
      );

      fireEvent.click(screen.getByText(triggerText));

      const loadingIndicator = await screen.findByTestId(/loading-indicator$/);
      expect(loadingIndicator).toHaveAccessibleName(defaultLoadingText);
    });

    it('display label to indicate in loading status', async () => {
      const triggerText = 'click me to open';
      const statusLabel = 'the content is loading';

      render(
        <DropdownMenu
          trigger={triggerText}
          isLoading
          statusLabel={statusLabel}
          testId={testId}
        >
          <DropdownItemGroup>
            <DropdownItem>Loaded action</DropdownItem>
          </DropdownItemGroup>
        </DropdownMenu>,
      );

      fireEvent.click(screen.getByText(triggerText));

      const loadingIndicator = await screen.findByTestId(/loading-indicator$/);
      expect(loadingIndicator).toHaveAccessibleName(statusLabel);
    });

    it('should close the dropdown menu on outside click', () => {
      const { getByTestId, queryByTestId } = render(
        <>
          <button data-testid="outside" type="button" />
          <DropdownMenu testId={testId} trigger="click to open" />
        </>,
      );

      act(() => {
        fireEvent.click(getByTestId(`${testId}--trigger`));
      });

      expect(getByTestId(`${testId}--content`)).toBeInTheDocument();

      act(() => {
        fireEvent.click(getByTestId('outside'));
      });

      expect(queryByTestId(`${testId}--content`)).not.toBeInTheDocument();
    });

    it('should close the dropdown menu on outside click which has stopPropagation', () => {
      const { getByTestId, queryByTestId } = render(
        <>
          <button
            data-testid="outside"
            type="button"
            onClick={(e) => e.stopPropagation()}
          />
          <DropdownMenu testId={testId} trigger="click to open" />
        </>,
      );

      act(() => {
        fireEvent.click(getByTestId(`${testId}--trigger`));
      });

      expect(getByTestId(`${testId}--content`)).toBeInTheDocument();

      act(() => {
        fireEvent.click(getByTestId('outside'));
      });

      expect(queryByTestId(`${testId}--content`)).not.toBeInTheDocument();
    });

    it('should generate a psuedorandom id to link the trigger and the popup if none was passed to it', () => {
      const { getByTestId } = render(
        <DropdownMenu trigger={'click to open'} isOpen testId={testId}>
          <DropdownItemGroup>
            <DropdownItem>Move</DropdownItem>
            <DropdownItem>Clone</DropdownItem>
            <DropdownItem>Delete</DropdownItem>
          </DropdownItemGroup>
        </DropdownMenu>,
      );
      const ariaControls = getByTestId(`${testId}--trigger`).getAttribute(
        'aria-controls',
      );
      const popupId = getByTestId(`${testId}--content`).getAttribute('id');

      expect(ariaControls).toBe(popupId);
    });

    it('should generate a psuedorandom id to link the custom trigger and the popup if none was passed to it', () => {
      const { getByTestId } = render(
        <DropdownMenu
          trigger={({ triggerRef, ...props }) => (
            <Button ref={triggerRef} {...props} type="button" />
          )}
          isOpen
          testId={testId}
        >
          <DropdownItemGroup>
            <DropdownItem>Move</DropdownItem>
            <DropdownItem>Clone</DropdownItem>
            <DropdownItem>Delete</DropdownItem>
          </DropdownItemGroup>
        </DropdownMenu>,
      );
      const ariaControls = getByTestId(`${testId}--trigger`).getAttribute(
        'aria-controls',
      );
      const popupId = getByTestId(`${testId}--content`).getAttribute('id');

      expect(ariaControls).toBe(popupId);
    });
  });
});
