import React from 'react';

import {
  ColorPickerWithoutAnalytics as ColorPicker,
  ColorPickerProps,
} from '../..';
import Trigger from '../../components/Trigger';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

jest.mock('@atlaskit/platform-feature-flags');
const mockGetBooleanFF = getBooleanFF as jest.MockedFunction<
  typeof getBooleanFF
>;

describe('ColorPicker', () => {
  const mockFn = jest.fn();

  const renderUI = () => {
    const palette = [
      { value: 'blue', label: 'Blue' },
      { value: 'red', label: 'Red' },
    ];
    const popperProps: ColorPickerProps['popperProps'] = {
      placement: 'bottom',
    };
    return render(
      <ColorPicker
        palette={palette}
        onChange={mockFn}
        popperProps={popperProps}
      />,
    );
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should render ColorPicker', () => {
    const { getByLabelText } = renderUI();
    const colorButton = getByLabelText('Color picker, Blue selected');

    expect(colorButton).toBeInTheDocument();
  });

  test('should render ColorPickerMenu on ColorPicker click', async () => {
    const { getByLabelText, getAllByRole } = renderUI();
    const colorButton = getByLabelText('Color picker, Blue selected');
    expect(colorButton).toHaveAttribute('aria-expanded', 'false');
    expect(colorButton).toBeInTheDocument();

    // click on trigger
    await userEvent.click(colorButton);
    expect(colorButton).toHaveAttribute('aria-expanded', 'true');

    // popup to have color options
    expect(getAllByRole('radio')).toHaveLength(2);
  });

  test('should not submit form when click on trigger', async () => {
    const mockSubmit = jest.fn();
    const { getByRole } = render(
      <form onSubmit={mockSubmit}>
        <Trigger value="blue" label="Blue" expanded={false} />
      </form>,
    );

    await userEvent.click(getByRole('button'));
    expect(mockSubmit.mock.calls.length).toBe(0);
  });

  describe('FFs enabled', () => {
    beforeEach(() => {
      mockGetBooleanFF.mockReturnValue(true);
    });

    test('should render ColorPicker', () => {
      const { getByLabelText } = renderUI();
      const colorButton = getByLabelText('Color picker, Blue selected');

      expect(colorButton).toBeInTheDocument();
    });

    test('should render ColorPickerMenu on ColorPicker click', async () => {
      const { getByLabelText, getAllByRole } = renderUI();
      const colorButton = getByLabelText('Color picker, Blue selected');
      expect(colorButton).toHaveAttribute('aria-expanded', 'false');
      expect(colorButton).toBeInTheDocument();

      // click on trigger
      await userEvent.click(colorButton);
      expect(colorButton).toHaveAttribute('aria-expanded', 'true');

      // popup to have color options
      expect(getAllByRole('radio')).toHaveLength(2);
    });

    test('should not submit form when click on trigger', async () => {
      const mockSubmit = jest.fn();
      const { getByRole } = render(
        <form onSubmit={mockSubmit}>
          <Trigger value="blue" label="Blue" expanded={false} />
        </form>,
      );

      await userEvent.click(getByRole('button'));
      expect(mockSubmit.mock.calls.length).toBe(0);
    });
  });
});
