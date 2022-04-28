import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { css } from '@emotion/core';
import Lozenge from '../index';
import { LozengeProps } from '../types';

describe('Element: Lozenge', () => {
  const testId = 'smart-element-lozenge';
  const text = 'Some status';
  const appearance = 'inprogress';

  it('renders element', async () => {
    const { findByTestId } = render(
      <Lozenge text={text} appearance={appearance} />,
    );

    const element = await findByTestId(testId);

    expect(element).toBeTruthy();
    expect(element.textContent).toBe(text);
  });

  it('does not render when no text in element', async () => {
    const { queryByTestId } = render(
      <Lozenge text={''} appearance={appearance} />,
    );
    expect(queryByTestId(testId)).toBeNull();
  });

  describe('renders element with different appearances', () => {
    const appearances: Array<LozengeProps['appearance']> = [
      'default',
      'inprogress',
      'moved',
      'new',
      'removed',
      'success',
    ];
    for (const appearance of appearances) {
      it(`renders with ${appearance} appearance`, async () => {
        const { findByTestId } = render(
          <Lozenge text={text} appearance={appearance} />,
        );

        const element = await findByTestId(testId);

        expect(element).toBeTruthy();
        expect(element.textContent).toBe(text);
      });
    }
  });

  it('renders with default appearance when given an unexpected appearance', async () => {
    const { findByTestId } = render(
      <Lozenge text={text} appearance={'spaghetti' as any} />,
    );
    const element = await findByTestId(testId);
    expect(element).toBeTruthy();
    expect(element.textContent).toBe(text);
  });

  it('renders with override css', async () => {
    const overrideCss = css`
      font-style: italic;
    `;
    const { findByTestId } = render(
      <Lozenge appearance={appearance} overrideCss={overrideCss} text={text} />,
    );

    const element = await findByTestId(testId);

    expect(element).toHaveStyleDeclaration('font-style', 'italic');
  });
});
