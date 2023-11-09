import React from 'react';

import { render } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import InlineCardOverlay from '../InlineCardOverlay';

describe('InlineCardOverlay', () => {
  const testId = 'overlay-test';

  const setup = (
    props: Partial<React.ComponentProps<typeof InlineCardOverlay>> = {},
  ) =>
    render(
      <IntlProvider locale="en">
        <InlineCardOverlay testId={testId} url="http://some-url" {...props}>
          <span>I am inline card.</span>
        </InlineCardOverlay>
      </IntlProvider>,
    );

  it('renders an overlay when isVisible is true', () => {
    const { queryByTestId } = setup({ isVisible: true });
    const overlay = queryByTestId(testId);

    expect(overlay).toBeInTheDocument();
  });

  describe('isVisible', () => {
    it('does not render an overlay by default', () => {
      const { queryByTestId } = setup();
      const overlay = queryByTestId(testId);
      expect(overlay).not.toBeInTheDocument();
    });

    it('renders an overlay when isVisible is true', () => {
      const { queryByTestId } = setup({ isVisible: true });
      const overlay = queryByTestId(testId);
      expect(overlay).toBeInTheDocument();
    });

    it('does not render an overlay when isVisible is false', () => {
      const { queryByTestId } = setup({ isVisible: false });
      const overlay = queryByTestId(testId);
      expect(overlay).not.toBeInTheDocument();
    });
  });

  describe('isToolbarOpen', () => {
    it('renders an overlay on toolbar close state by default', () => {
      const { queryByTestId } = setup({ isVisible: true });
      expect(queryByTestId(`${testId}-close`)).toBeInTheDocument();
      expect(queryByTestId(`${testId}-open`)).not.toBeInTheDocument();
    });

    it('renders an overlay on toolbar open state', () => {
      const { queryByTestId } = setup({ isVisible: true, isToolbarOpen: true });
      expect(queryByTestId(`${testId}-close`)).not.toBeInTheDocument();
      expect(queryByTestId(`${testId}-open`)).toBeInTheDocument();
    });

    it('renders an overlay on toolbar close state', () => {
      const { queryByTestId } = setup({
        isVisible: true,
        isToolbarOpen: false,
      });
      expect(queryByTestId(`${testId}-close`)).toBeInTheDocument();
      expect(queryByTestId(`${testId}-open`)).not.toBeInTheDocument();
    });
  });
});
