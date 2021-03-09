import React from 'react';

import { fireEvent, render } from '@testing-library/react';

import { AnalyticsListener } from '@atlaskit/analytics-next';

import Toggle from '../../toggle';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

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
