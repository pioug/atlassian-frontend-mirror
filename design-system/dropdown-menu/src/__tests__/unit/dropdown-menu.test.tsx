import React, { useState } from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import Button from '@atlaskit/button/standard-button';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '../../index';

describe('dropdown menu', () => {
  const items = ['Move', 'Clone', 'Delete'];
  const testId = 'testId';
  const triggerText = 'Click me to open';

  describe('trigger', () => {
    it('there should be a trigger button by default', () => {
      render(<DropdownMenu />);

      const trigger = screen.getByRole('button');

      expect(trigger).toBeInTheDocument();
    });

    it('trigger button with text', () => {
      render(<DropdownMenu trigger={triggerText} />);

      const trigger = screen.getByRole('button');

      expect(trigger).toBeInTheDocument();
    });

    it('should callback with flipped state when closed and controlled', () => {
      const callback = jest.fn();
      render(
        <DropdownMenu onOpenChange={callback} testId={testId} isOpen={false} />,
      );

      fireEvent.click(screen.getByTestId(`${testId}--trigger`));

      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({ isOpen: true }),
      );
    });

    it('should callback with flipped state when opened and controlled', () => {
      const callback = jest.fn();
      render(<DropdownMenu onOpenChange={callback} testId={testId} isOpen />);

      fireEvent.click(screen.getByTestId(`${testId}--trigger`));

      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({ isOpen: false }),
      );
    });

    it('should callback with false when opened', () => {
      const callback = jest.fn();
      render(<DropdownMenu onOpenChange={callback} testId={testId} isOpen />);

      fireEvent.click(document.body);

      expect(callback).toHaveBeenCalledWith({
        isOpen: false,
        event: new MouseEvent('click'),
      });
    });

    it('should open the menu list when button is clicked', () => {
      render(
        <DropdownMenu trigger={triggerText}>
          <DropdownItemGroup>
            {items.map((text) => (
              <DropdownItem>{text}</DropdownItem>
            ))}
          </DropdownItemGroup>
        </DropdownMenu>,
      );

      expect(screen.queryAllByRole('menuitem')).toHaveLength(0);

      fireEvent.click(screen.getByRole('button'));

      expect(screen.queryAllByRole('menuitem')).toHaveLength(items.length);
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
      'platform.design-system-team.layering_popup_1cnzt',
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
      render(
        <DropdownMenu
          trigger={(triggerProps) => (
            <Button {...triggerProps} data-test-id="native-button">
              {triggerText}
            </Button>
          )}
        />,
      );

      const trigger = screen.getByRole('button');

      expect(trigger).toBeInTheDocument();
    });

    it('custom trigger to open popup', () => {
      const triggerTestId = 'triggerTestId';

      const DDMWithCustomTrigger = () => {
        const [isOpen, setOpen] = useState(false);
        return (
          <DropdownMenu
            isOpen={isOpen}
            trigger={(triggerProps) => (
              <Button
                {...triggerProps}
                onClick={() => setOpen(!isOpen)}
                testId={triggerTestId}
              >
                {triggerText}
              </Button>
            )}
          >
            <DropdownItemGroup>
              {items.map((text) => (
                <DropdownItem>{text}</DropdownItem>
              ))}
            </DropdownItemGroup>
          </DropdownMenu>
        );
      };

      render(<DDMWithCustomTrigger />);

      const trigger = screen.getByTestId(triggerTestId);

      fireEvent.click(trigger);

      expect(screen.getAllByRole('menuitem')).toHaveLength(items.length);
    });

    it('should open the menu and call onClick on the trigger when Enter or Space is pressed while the trigger is focused', () => {
      const triggerTestId = 'triggerTestId';
      const onClick = jest.fn((callback) => callback());

      const DDMWithCustomTrigger = ({ onClick }: { onClick: any }) => {
        const [isOpen, setIsOpen] = useState(false);
        return (
          <DropdownMenu
            isOpen={isOpen}
            trigger={(triggerProps) => (
              <Button
                {...triggerProps}
                onClick={() => onClick(() => setIsOpen(!isOpen))}
                testId={triggerTestId}
              >
                {triggerText}
              </Button>
            )}
          >
            <DropdownItemGroup>
              {items.map((text) => (
                <DropdownItem>{text}</DropdownItem>
              ))}
            </DropdownItemGroup>
          </DropdownMenu>
        );
      };

      render(<DDMWithCustomTrigger onClick={onClick} />);

      const trigger = screen.getByTestId(triggerTestId);

      fireEvent.click(trigger, {
        clientX: 0,
        clientY: 0,
        detail: 0,
      });

      expect(screen.getAllByRole('menuitem')).toHaveLength(items.length);
      expect(onClick).toHaveBeenCalled();
    });
  });

  describe('isLoading status', () => {
    const testId = 'test';

    it('does not display the dropdown item when loading', async () => {
      render(
        <DropdownMenu trigger={triggerText} isLoading>
          <DropdownItemGroup>
            <DropdownItem>Loaded action</DropdownItem>
          </DropdownItemGroup>
        </DropdownMenu>,
      );

      fireEvent.click(screen.getByRole('button'));

      expect(screen.queryAllByRole('menuitem')).toHaveLength(0);
    });

    it('display default label to indicate in loading status', async () => {
      const defaultLoadingText = 'Loading';

      render(
        <DropdownMenu trigger={triggerText} isLoading testId={testId}>
          <DropdownItemGroup>
            <DropdownItem>Loaded action</DropdownItem>
          </DropdownItemGroup>
        </DropdownMenu>,
      );

      fireEvent.click(screen.getByRole('button'));

      const loadingIndicator = await screen.findByTestId(/loading-indicator$/);
      expect(loadingIndicator).toHaveAccessibleName(defaultLoadingText);
    });

    it('display label to indicate in loading status', async () => {
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

      fireEvent.click(screen.getByRole('button'));

      const loadingIndicator = await screen.findByTestId(/loading-indicator$/);
      expect(loadingIndicator).toHaveAccessibleName(statusLabel);
    });

    it('should close the dropdown menu on outside click', () => {
      render(
        <>
          <button data-testid="outside" type="button" />
          <DropdownMenu testId={testId} trigger="click to open" />
        </>,
      );

      fireEvent.click(screen.getByTestId(`${testId}--trigger`));

      expect(screen.getByTestId(`${testId}--content`)).toBeInTheDocument();

      fireEvent.click(screen.getByTestId('outside'));

      expect(
        screen.queryByTestId(`${testId}--content`),
      ).not.toBeInTheDocument();
    });

    it('should close the dropdown menu on outside click which has stopPropagation', () => {
      render(
        <>
          <button
            data-testid="outside"
            type="button"
            onClick={(e) => e.stopPropagation()}
          />
          <DropdownMenu testId={testId} trigger="click to open" />
        </>,
      );

      fireEvent.click(screen.getByTestId(`${testId}--trigger`));

      expect(screen.getByTestId(`${testId}--content`)).toBeInTheDocument();

      fireEvent.click(screen.getByTestId('outside'));

      expect(
        screen.queryByTestId(`${testId}--content`),
      ).not.toBeInTheDocument();
    });

    it('should generate a psuedorandom id to link the trigger and the popup if none was passed to it', () => {
      render(
        <DropdownMenu trigger={'click to open'} isOpen testId={testId}>
          <DropdownItemGroup>
            {items.map((text) => (
              <DropdownItem>{text}</DropdownItem>
            ))}
          </DropdownItemGroup>
        </DropdownMenu>,
      );

      const popupId = screen
        .getByTestId(`${testId}--content`)
        .getAttribute('id');

      expect(screen.getByTestId(`${testId}--trigger`)).toHaveAttribute(
        'aria-controls',
        popupId,
      );
    });

    it('should generate a psuedorandom id to link the custom trigger and the popup if none was passed to it', () => {
      render(
        <DropdownMenu
          trigger={({ triggerRef, ...props }) => (
            <Button ref={triggerRef} {...props} type="button" />
          )}
          isOpen
          testId={testId}
        >
          <DropdownItemGroup>
            {items.map((text) => (
              <DropdownItem>{text}</DropdownItem>
            ))}
          </DropdownItemGroup>
        </DropdownMenu>,
      );

      const popupId = screen
        .getByTestId(`${testId}--content`)
        .getAttribute('id');

      expect(screen.getByTestId(`${testId}--trigger`)).toHaveAttribute(
        'aria-controls',
        popupId,
      );
    });
  });
});
