import React from 'react';
import { render, waitForElement } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Action from '../index';
import userEvent from '@testing-library/user-event';
import { SmartLinkSize } from '../../../../../../constants';
import TestIcon from '@atlaskit/icon/glyph/activity';

describe('Action', () => {
  const testId = 'smart-action';

  it('should render Action with some text', async () => {
    const text = 'spaghetti';
    const onClick = () => {};
    const { getByTestId } = render(<Action onClick={onClick} content={text} />);

    const element = await waitForElement(() => getByTestId(testId));

    expect(element).toBeTruthy();
    expect(element.textContent).toBe('spaghetti');
  });

  it('should render Action with some icons', async () => {
    const text = 'spaghetti';
    const onClick = () => {};
    const { getByTestId } = render(<Action onClick={onClick} content={text} />);

    const element = await waitForElement(() => getByTestId(testId));

    expect(element).toBeTruthy();
    expect(element.textContent).toBe('spaghetti');
  });

  it('should call the supplied onClick when button is clicked', async () => {
    const text = 'spaghetti';
    const mockOnClick = jest.fn();
    const { getByTestId } = render(
      <Action onClick={mockOnClick} content={text} />,
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
      'should render action in %s size',
      async (size: SmartLinkSize, expectedSize: string) => {
        const testIcon = <TestIcon label="test" />;
        const { getByTestId } = render(
          <Action
            onClick={() => {}}
            size={size}
            testId={testId}
            icon={testIcon}
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
