import React from 'react';

import { fireEvent, render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

import { AnalyticsListener } from '@atlaskit/analytics-next';

import Toggle from '../../toggle';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

expect.extend(toHaveNoViolations);

describe('Toggle component', () => {
  it('should be able to switch', () => {
    const onChange = jest.fn();
    const { container } = render(
      <Toggle size="large" defaultChecked={false} onChange={onChange} />,
    );
    const label = container.querySelector('label');

    expect(label).toBeDefined();
    expect(label?.getAttribute('data-checked')).toBe(null);

    fireEvent.click(label!);
    expect(onChange).toHaveBeenCalled();

    expect(label?.getAttribute('data-checked')).toBe('true');
  });

  it('should be able to handle name/value', () => {
    const onChange = jest.fn();

    const { container } = render(
      <Toggle
        size="large"
        defaultChecked={false}
        onChange={onChange}
        name="notification"
        value="off"
      />,
    );

    const input = container.querySelector('input[type="checkbox"]');

    expect(input).toBeDefined();
    expect(input?.getAttribute('name')).toEqual('notification');
    expect(input?.getAttribute('value')).toEqual('off');
  });

  it('should not be able to switch when disabled', () => {
    const onChange = jest.fn();
    const { container } = render(
      <Toggle size="large" isDisabled defaultChecked={false} />,
    );
    const label = container.querySelector('label');

    expect(label).toBeDefined();
    expect(label?.getAttribute('data-checked')).toBe(null);

    fireEvent.click(label!);
    expect(onChange).not.toHaveBeenCalled();

    expect(label?.getAttribute('data-checked')).toBe(null);
  });

  it('should set received label to input', () => {
    const { container } = render(<Toggle label="Allow pull request" />);
    const input = container.querySelector('input[type="checkbox"]');

    expect(input).toBeDefined();
    expect(input?.getAttribute('aria-label')).toBe('Allow pull request');
  });

  it('due to check and cross icons are decorative they should not have a label', () => {
    const { getByTestId } = render(<Toggle testId="Test" />);

    const crossIcon = getByTestId('Test--toggle-check-icon');
    expect(crossIcon).toBeDefined();

    const checkIcon = getByTestId('Test--toggle-check-icon');
    expect(checkIcon).toBeDefined();

    expect(crossIcon.getAttribute('aria-label')).toBeNull();
    expect(crossIcon.getAttribute('aria-label')).toBeNull();
  });

  describe('axe violations', () => {
    it('should not have violations when have label', async () => {
      const { container } = render(<Toggle label="Toggle" />);
      const result = await axe(container);

      expect(result).toHaveNoViolations();
    });

    it('should not have violations when have paired label', async () => {
      const { container } = render(
        <>
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control,jsx-a11y/label-has-for */}
          <label htmlFor="toggle">Toggle</label>
          <Toggle id="toggle" />
        </>,
      );

      const result = await axe(container);
      expect(result).toHaveNoViolations();
    });

    it('should have axe violations when received empty label', async () => {
      const { container } = render(<Toggle label="" />);
      const result = await axe(container);

      // there is a only toHaveNoViolations provided by jest-axe, so double negation is used here
      expect(result).not.toHaveNoViolations();
    });
  });

  describe('analytics', () => {
    it('should send event to atlaskit/analytics', () => {
      const originOnChange = jest.fn();
      const onAnalyticsEvent = jest.fn();

      const { container } = render(
        <AnalyticsListener channel="atlaskit" onEvent={onAnalyticsEvent}>
          <Toggle
            size="large"
            defaultChecked={false}
            onChange={originOnChange}
          />
        </AnalyticsListener>,
      );

      const label = container.querySelector('label');
      fireEvent.click(label!);

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

      const { container } = render(
        <AnalyticsListener channel="atlaskit" onEvent={onAnalyticsEvent}>
          <Toggle
            size="large"
            defaultChecked={false}
            isDisabled
            onChange={originOnChange}
          />
        </AnalyticsListener>,
      );

      const label = container.querySelector('label');
      fireEvent.click(label!);

      expect(originOnChange).not.toHaveBeenCalled();
      expect(onAnalyticsEvent).not.toHaveBeenCalled();
    });
  });
});
