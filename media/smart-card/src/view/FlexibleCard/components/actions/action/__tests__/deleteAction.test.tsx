import React from 'react';
import { render, waitForElement } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DeleteAction from '../index';
import userEvent from '@testing-library/user-event';
import { SmartLinkSize } from '../../../../../../constants';
import CrossIcon from '@atlaskit/icon/glyph/cross';

describe('Action: Delete', () => {
  const testId = 'smart-action-delete-action';

  describe.each([
    ['as dropdown item', true],
    ['as button', false],
  ])('%s', (_: string, asDropdownItem: boolean) => {
    it('should render DeleteAction with some text', async () => {
      const text = 'spaghetti';
      const onClick = () => {};
      const { getByTestId } = render(
        <DeleteAction
          asDropDownItem={asDropdownItem}
          onClick={onClick}
          content={text}
          testId={testId}
        />,
      );

      const element = await waitForElement(() => getByTestId(testId));

      expect(element).toBeTruthy();
      expect(element.textContent).toBe('spaghetti');
    });

    it('should call the supplied onClick when button is clicked', async () => {
      const text = 'spaghetti';
      const mockOnClick = jest.fn();
      const { getByTestId } = render(
        <DeleteAction
          asDropDownItem={asDropdownItem}
          onClick={mockOnClick}
          content={text}
          testId={testId}
        />,
      );

      const element = await waitForElement(() => getByTestId(testId));

      expect(element).toBeTruthy();
      expect(element.textContent).toBe('spaghetti');

      userEvent.click(element);
      expect(mockOnClick).toHaveBeenCalled();
    });
  });

  describe('size', () => {
    it.each([
      [SmartLinkSize.XLarge, '1.5rem'],
      [SmartLinkSize.Large, '1.5rem'],
      [SmartLinkSize.Medium, '1rem'],
      [SmartLinkSize.Small, '1rem'],
    ])(
      'should render deleteAction in %s size',
      async (size: SmartLinkSize, expectedSize: string) => {
        const { getByTestId } = render(
          <DeleteAction
            onClick={() => {}}
            size={size}
            testId={testId}
            icon={<CrossIcon label="test" />}
          />,
        );

        const element = await waitForElement(() =>
          getByTestId(`${testId}-icon`),
        );

        expect(element).toHaveStyleDeclaration('height', expectedSize);
        expect(element).toHaveStyleDeclaration('width', expectedSize);
      },
    );
  });
});
