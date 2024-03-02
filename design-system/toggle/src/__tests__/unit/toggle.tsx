import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import { AnalyticsListener } from '@atlaskit/analytics-next';

import Toggle from '../../toggle';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

describe('Toggle component', () => {
  const label = 'label';

  it('should be able to switch', () => {
    const onChange = jest.fn();
    render(
      <Toggle
        size="large"
        label={label}
        defaultChecked={false}
        onChange={onChange}
      />,
    );
    const labelElement = screen.getByLabelText(label).parentElement;

    expect(labelElement).not.toHaveAttribute('data-checked');

    fireEvent.click(labelElement!);
    expect(onChange).toHaveBeenCalled();

    expect(labelElement).toHaveAttribute('data-checked', 'true');
  });

  it('should be able to handle name/value', () => {
    const onChange = jest.fn();

    render(
      <Toggle
        size="large"
        defaultChecked={false}
        onChange={onChange}
        name="notification"
        value="off"
        label={label}
      />,
    );

    const input = screen.getByRole('checkbox');

    expect(input).toHaveAttribute('name', 'notification');
    expect(input).not.toBeChecked();
  });

  it('should not be able to switch when disabled', () => {
    const onChange = jest.fn();
    render(
      <Toggle size="large" isDisabled label={label} defaultChecked={false} />,
    );

    const labelElement = screen.getByLabelText(label);

    expect(labelElement).not.toHaveAttribute('data-checked');

    fireEvent.click(labelElement);
    expect(onChange).not.toHaveBeenCalled();

    expect(labelElement).not.toHaveAttribute('data-checked');
  });

  it('should set received label to input', () => {
    render(<Toggle label={label} />);
    const input = screen.getByRole('checkbox');

    expect(input).toHaveAttribute('aria-labelledby');
    expect(input).toHaveAccessibleName(label);
  });

  it('should set received aria-describedby to input', () => {
    render(
      <>
        <p id="toggle-desc">Allow pull request</p>
        <Toggle descriptionId="toggle-desc" label={label} />
      </>,
    );
    const input = screen.getByRole('checkbox');
    expect(input).toHaveAttribute('aria-describedby', 'toggle-desc');
  });

  it('due to check and cross icons are decorative they should not have a label', () => {
    render(<Toggle testId="Test" label={label} />);

    const crossIcon = screen.getByTestId('Test--toggle-check-icon');
    expect(crossIcon).toBeInTheDocument();

    const checkIcon = screen.getByTestId('Test--toggle-check-icon');
    expect(checkIcon).toBeInTheDocument();

    expect(crossIcon).not.toHaveAttribute('aria-label');
    expect(crossIcon).not.toHaveAttribute('aria-label');
  });

  describe('analytics', () => {
    it('should send event to atlaskit/analytics', () => {
      const originOnChange = jest.fn();
      const onAnalyticsEvent = jest.fn();

      render(
        <AnalyticsListener channel="atlaskit" onEvent={onAnalyticsEvent}>
          <Toggle
            size="large"
            defaultChecked={false}
            label={label}
            onChange={originOnChange}
          />
        </AnalyticsListener>,
      );

      const labelElement = screen.getByLabelText(label);
      fireEvent.click(labelElement);

      expect(originOnChange).toHaveBeenCalled();
      expect(onAnalyticsEvent).toHaveBeenCalledTimes(1);
      expect(onAnalyticsEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: {
            action: 'change',
            actionSubject: 'toggle',
            attributes: {
              componentName: 'toggle',
              packageName,
              packageVersion,
            },
          },
        }),
        'atlaskit',
      );
    });

    it('should not fire anything when disabled', () => {
      const originOnChange = jest.fn();
      const onAnalyticsEvent = jest.fn();

      render(
        <AnalyticsListener channel="atlaskit" onEvent={onAnalyticsEvent}>
          <Toggle
            size="large"
            defaultChecked={false}
            isDisabled
            label={label}
            onChange={originOnChange}
          />
        </AnalyticsListener>,
      );

      const labelElement = screen.getByLabelText(label).parentElement;
      fireEvent.click(labelElement!);

      expect(originOnChange).not.toHaveBeenCalled();
      expect(onAnalyticsEvent).not.toHaveBeenCalled();
    });
  });
});
