import React from 'react';
import { render, waitForElement } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ElementGroup from '../index';
import {
  SmartLinkAlignment,
  SmartLinkDirection,
  SmartLinkSize,
  SmartLinkWidth,
} from '../../../../../../constants';

describe('ElementGroup', () => {
  const testId = 'smart-element-group';

  it('renders element group', async () => {
    const { getByTestId } = render(
      <ElementGroup>I am an element group.</ElementGroup>,
    );

    const elementGroup = await waitForElement(() => getByTestId(testId));

    expect(elementGroup).toBeTruthy();
    expect(elementGroup.getAttribute('data-smart-element-group')).toBeTruthy();
    expect(elementGroup.textContent).toBe('I am an element group.');
  });

  describe('size', () => {
    it.each([
      [SmartLinkSize.XLarge, '1.25rem'],
      [SmartLinkSize.Large, '1rem'],
      [SmartLinkSize.Medium, '.5rem'],
      [SmartLinkSize.Small, '.25rem'],
      [undefined, '.5rem'],
    ])(
      'renders element group in %s size',
      async (size: SmartLinkSize | undefined, expected: string) => {
        const { getByTestId } = render(
          <ElementGroup size={size}>I am an element group.</ElementGroup>,
        );

        const elementGroup = await waitForElement(() => getByTestId(testId));

        expect(elementGroup).toHaveStyleDeclaration('gap', expected);
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
          <ElementGroup direction={direction}>
            I am an element group.
          </ElementGroup>,
        );

        const elementGroup = await waitForElement(() => getByTestId(testId));

        expect(elementGroup).toHaveStyleDeclaration('flex-direction', expected);
      },
    );
  });

  describe('align', () => {
    it.each([
      [SmartLinkAlignment.Left, 'flex-start'],
      [SmartLinkAlignment.Right, 'flex-end'],
      [undefined, 'flex-start'],
    ])(
      'aligns children %s',
      async (align: SmartLinkAlignment | undefined, expected: string) => {
        const { getByTestId } = render(
          <ElementGroup align={align}>I am an element group.</ElementGroup>,
        );

        const elementGroup = await waitForElement(() => getByTestId(testId));

        expect(elementGroup).toHaveStyleDeclaration(
          'justify-content',
          expected,
        );
      },
    );
  });

  describe('width', () => {
    it('sets flex for flexible width', async () => {
      const { getByTestId } = render(
        <ElementGroup width={SmartLinkWidth.Flexible}>
          I am an element group.
        </ElementGroup>,
      );

      const elementGroup = await waitForElement(() => getByTestId(testId));

      expect(elementGroup).toHaveStyleDeclaration('flex', '1 3');
    });
  });
});
