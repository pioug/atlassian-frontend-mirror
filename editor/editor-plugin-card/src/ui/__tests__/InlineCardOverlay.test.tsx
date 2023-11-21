import React from 'react';

import { render } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import InlineCardOverlay from '../InlineCardOverlay';
import * as utils from '../InlineCardOverlay/utils';

describe('InlineCardOverlay', () => {
  const testId = 'overlay-test';
  const mockMaxOverlayWidth = 120;
  const mockMinOverlayWidth = 16;
  const mockAvailableWidth = 200;

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

  beforeEach(() => {
    jest
      .spyOn(utils, 'getOverlayWidths')
      .mockReturnValue({ max: mockMaxOverlayWidth, min: mockMinOverlayWidth });
    jest
      .spyOn(utils, 'getInlineCardAvailableWidth')
      .mockReturnValue(mockAvailableWidth);
  });

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

    it('renders an overlay label and icon', () => {
      const { queryByTestId } = setup({ isVisible: true });
      expect(queryByTestId(`${testId}-label`)).toBeInTheDocument();
      expect(queryByTestId(`${testId}-close`)).toBeInTheDocument();
    });

    it('renders only an overlay icon', () => {
      jest.spyOn(utils, 'getInlineCardAvailableWidth').mockReturnValue(50);

      const { queryByTestId } = setup({ isVisible: true });
      expect(queryByTestId(`${testId}-label`)).not.toBeInTheDocument();
      expect(queryByTestId(`${testId}-close`)).toBeInTheDocument();
    });
  });

  describe('isSelected', () => {
    it('renders an overlay on toolbar close state by default', () => {
      const { queryByTestId } = setup({ isVisible: true });
      expect(queryByTestId(`${testId}-close`)).toBeInTheDocument();
      expect(queryByTestId(`${testId}-open`)).not.toBeInTheDocument();
    });

    it('renders an overlay on toolbar open state', () => {
      const { queryByTestId } = setup({ isVisible: true, isSelected: true });
      expect(queryByTestId(`${testId}-close`)).not.toBeInTheDocument();
      expect(queryByTestId(`${testId}-open`)).toBeInTheDocument();
    });

    it('renders an overlay on toolbar close state', () => {
      const { queryByTestId } = setup({
        isVisible: true,
        isSelected: false,
      });
      expect(queryByTestId(`${testId}-close`)).toBeInTheDocument();
      expect(queryByTestId(`${testId}-open`)).not.toBeInTheDocument();
    });
  });
});
