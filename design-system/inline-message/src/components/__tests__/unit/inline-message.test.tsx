import React from 'react';

import { cleanup, fireEvent, render } from '@testing-library/react';

import * as colors from '@atlaskit/theme/colors';

import InlineMessage from '../../../index';

const testId = 'test';

const appearances = {
  connectivity: { light: colors.B400, dark: colors.B100 },
  confirmation: { light: colors.G300, dark: colors.G300 },
  info: { light: colors.P300, dark: colors.P300 },
  warning: { light: colors.Y300, dark: colors.Y300 },
  error: { light: colors.R400, dark: colors.R400 },
} as const;

describe('Inline Message', () => {
  afterEach(cleanup);

  it('basic sanity check', () => {
    const { getByTestId } = render(<InlineMessage testId={testId} />);
    expect(getByTestId(testId)).not.toBe(undefined);
  });

  describe('dialog state', () => {
    it('should start closed, no content on showing', () => {
      const { queryByTestId } = render(
        <InlineMessage>
          <div data-testid={testId} />
        </InlineMessage>,
      );
      expect(queryByTestId(testId)).toBeNull();
    });
    it('should toggle when the button is clicked', () => {
      const { getByTestId, getByText } = render(
        <InlineMessage testId={testId}>
          <div>Hello</div>
        </InlineMessage>,
      );
      const button = getByTestId(`${testId}--button`);
      fireEvent.click(button);
      expect(getByText('Hello')).toBeInTheDocument();
    });

    it('should hide when the button is clicked twice', () => {
      const { getByTestId, getByText, queryByText } = render(
        <InlineMessage testId={testId}>
          <div>Hello</div>
        </InlineMessage>,
      );
      const button = getByTestId(`${testId}--button`);
      fireEvent.click(button);
      expect(getByText('Hello')).toBeInTheDocument();
      fireEvent.click(button);
      expect(queryByText('Hello')).toBeNull();
    });
  });

  describe('renders with different appearances', () => {
    Object.entries(appearances).forEach(([appearance, colorTypes]) => {
      it(`correctly renders "${appearance}" appearance with light theme`, () => {
        const { container } = render(
          <InlineMessage type={appearance as keyof typeof appearances} />,
        );

        const element = container.querySelector(
          '[data-ds--inline-message--icon]',
        ) as HTMLElement;
        const cssVar = element.style.getPropertyValue('--icon-color');
        expect(element).toHaveStyleDeclaration('color', 'var(--icon-color)');
        expect(cssVar).toEqual(colorTypes.light);
      });
    });
  });
});
