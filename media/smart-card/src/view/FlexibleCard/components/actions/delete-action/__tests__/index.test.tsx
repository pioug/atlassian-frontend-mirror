import React from 'react';
import { render, waitForElement } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DeleteAction from '../index';
import userEvent from '@testing-library/user-event';
import { SmartLinkSize } from '../../../../../../constants';

describe('Action: Delete', () => {
  const testId = 'smart-action-delete-action';

  it('renders DeleteAction with a delete icon by default', async () => {
    const onClick = () => {};
    const { getByTestId } = render(<DeleteAction onClick={onClick} />);

    const element = await waitForElement(() => getByTestId(testId));

    expect(element).toBeTruthy();
  });

  it('renders DeleteAction with some text', async () => {
    const text = 'spaghetti';
    const onClick = () => {};
    const { getByTestId } = render(
      <DeleteAction onClick={onClick} content={text} />,
    );

    const element = await waitForElement(() => getByTestId(testId));

    expect(element).toBeTruthy();
    expect(element.textContent).toBe('spaghetti');
  });

  it('DeleteAction onClick works as intended', async () => {
    const text = 'spaghetti';
    const mockOnClick = jest.fn();
    const { getByTestId } = render(
      <DeleteAction onClick={mockOnClick} content={text} />,
    );

    const element = await waitForElement(() => getByTestId(testId));

    expect(element).toBeTruthy();
    expect(element.textContent).toBe('spaghetti');

    userEvent.click(element);
    expect(mockOnClick).toHaveBeenCalled();
  });

  describe('size', () => {
    it.each([
      [SmartLinkSize.XLarge, '1.5rem'],
      [SmartLinkSize.Large, '1.5rem'],
      [SmartLinkSize.Medium, '1rem'],
      [SmartLinkSize.Small, '1rem'],
    ])(
      'renders element in %s size',
      async (size: SmartLinkSize, expectedSize: string) => {
        const { getByTestId } = render(
          <DeleteAction onClick={() => {}} size={size} testId={testId} />,
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
