import React from 'react';
import { css } from '@emotion/core';
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

  it('renders element group with custom css', async () => {
    const customStyles = css`
      line-height: 20rem;
    `;
    const { getByTestId } = render(
      <ElementGroup overrideCss={customStyles}>
        I am an element group.
      </ElementGroup>,
    );

    const elementGroup = await waitForElement(() => getByTestId(testId));

    expect(elementGroup).toHaveStyleDeclaration('line-height', '20rem');
    expect(elementGroup).toHaveStyleDeclaration(
      'justify-content',
      'flex-start',
    );
  });

  describe('size', () => {
    it.each([
      [SmartLinkSize.XLarge, '1.25rem'],
      [SmartLinkSize.Large, '1rem'],
      [SmartLinkSize.Medium, '0.5rem'],
      [SmartLinkSize.Small, '0.25rem'],
      [undefined, '0.5rem'],
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
      [SmartLinkAlignment.Left, 'flex-start', 'left'],
      [SmartLinkAlignment.Right, 'flex-end', 'right'],
      [undefined, 'flex-start', 'left'],
    ])(
      'aligns children %s',
      async (
        align: SmartLinkAlignment | undefined,
        expectedJustifyContent: string,
        expectedTextAlign: string,
      ) => {
        const { getByTestId } = render(
          <ElementGroup align={align}>I am an element group.</ElementGroup>,
        );

        const elementGroup = await waitForElement(() => getByTestId(testId));

        expect(elementGroup).toHaveStyleDeclaration(
          'justify-content',
          expectedJustifyContent,
        );
        expect(elementGroup).toHaveStyleDeclaration(
          'text-align',
          expectedTextAlign,
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
