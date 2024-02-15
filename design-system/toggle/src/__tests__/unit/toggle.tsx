import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import { AnalyticsListener } from '@atlaskit/analytics-next';

import Toggle from '../../toggle';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

describe('Toggle component', () => {
  it('should be able to switch', () => {
    const onChange = jest.fn();
    render(
      <Toggle
        size="large"
        label="switch"
        defaultChecked={false}
        onChange={onChange}
      />,
    );
    const label = screen.getByLabelText('switch').parentElement as HTMLElement;

    expect(label).not.toHaveAttribute('data-checked');

    fireEvent.click(label);
    expect(onChange).toHaveBeenCalled();

    expect(label).toHaveAttribute('data-checked', 'true');
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
      />,
    );

    const input = screen.getByRole('checkbox');

    expect(input).toHaveAttribute('name', 'notification');
    expect(input).not.toBeChecked();
  });

  it('should not be able to switch when disabled', () => {
    const onChange = jest.fn();
    render(
      <Toggle size="large" isDisabled label="toggle" defaultChecked={false} />,
    );
    const label = screen.getByLabelText('toggle');

    expect(label).not.toHaveAttribute('data-checked');

    fireEvent.click(label);
    expect(onChange).not.toHaveBeenCalled();

    expect(label).not.toHaveAttribute('data-checked');
  });

  it('should set received label to input', () => {
    render(<Toggle label="Allow pull request" />);
    const input = screen.getByRole('checkbox');

    expect(input).toHaveAttribute('aria-label', 'Allow pull request');
  });

  it('should set received aria-describedby to input', () => {
    render(
      <>
        <p id="toggle-desc">Allow pull request</p>
        <Toggle descriptionId="toggle-desc" />
      </>,
    );
    const input = screen.getByRole('checkbox');
    expect(input).toHaveAttribute('aria-describedby', 'toggle-desc');
  });

  it('due to check and cross icons are decorative they should not have a label', () => {
    render(<Toggle testId="Test" />);

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
            label="analytics"
            onChange={originOnChange}
          />
        </AnalyticsListener>,
      );

      const label = screen.getByLabelText('analytics');
      fireEvent.click(label);

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
            label="disabled toggle"
            onChange={originOnChange}
          />
        </AnalyticsListener>,
      );

      const label = screen.getByLabelText('disabled toggle')
        .parentElement as HTMLElement;
      fireEvent.click(label);

      expect(originOnChange).not.toHaveBeenCalled();
      expect(onAnalyticsEvent).not.toHaveBeenCalled();
    });
  });
});
