import React from 'react';
import { render, waitForElement } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Block from '../index';
import { SmartLinkDirection, SmartLinkSize } from '../../../../../../constants';

describe('Block', () => {
  const testId = 'smart-block';

  it('renders block', async () => {
    const { getByTestId } = render(<Block>I am a block.</Block>);

    const block = await waitForElement(() => getByTestId(testId));

    expect(block).toBeTruthy();
    expect(block.getAttribute('data-smart-block')).toBeTruthy();
    expect(block.textContent).toBe('I am a block.');
  });

  describe('size', () => {
    it.each([
      [SmartLinkSize.XLarge, '1.25rem'],
      [SmartLinkSize.Large, '1rem'],
      [SmartLinkSize.Medium, '.5rem'],
      [SmartLinkSize.Small, '.25rem'],
      [undefined, '.5rem'],
    ])(
      'renders element in %s size',
      async (size: SmartLinkSize | undefined, expected: string) => {
        const { getByTestId } = render(
          <Block size={size}>I am a block.</Block>,
        );

        const block = await waitForElement(() => getByTestId(testId));

        expect(block).toHaveStyleDeclaration('gap', expected);
      },
    );
  });

  describe('direction', () => {
    it.each([
      [SmartLinkDirection.Horizontal, 'row'],
      [SmartLinkDirection.Vertical, 'column'],
      [undefined, 'row'],
    ])(
      'renders children in %s',
      async (direction: SmartLinkDirection | undefined, expected: string) => {
        const { getByTestId } = render(
          <Block direction={direction}>I am a block.</Block>,
        );

        const block = await waitForElement(() => getByTestId(testId));

        expect(block).toHaveStyleDeclaration('flex-direction', expected);
      },
    );
  });
});
