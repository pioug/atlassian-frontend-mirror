import React from 'react';

import { fireEvent, render } from '@testing-library/react';

import Toggle from '../../toggle';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

describe('Toggle component', () => {
  describe('defaultChecked is absent', () => {
    it('should be stateless when defaultChecked is absent - is not checked', () => {
      const onChange = jest.fn();
      const { container } = render(
        <Toggle size="large" isChecked={false} onChange={onChange} />,
      );

      const label = container.querySelector('label');

      expect(label).toBeDefined();
      expect(label?.getAttribute('data-checked')).toBe(null);

      fireEvent.click(label!);
      expect(onChange).toHaveBeenCalled();
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          nativeEvent: null,
          target: null,
        }),
        expect.objectContaining({
          context: [
            {
              componentName: 'toggle',
              packageName,
              packageVersion,
            },
          ],
        }),
      );

      expect(label?.getAttribute('data-checked')).toBe(null);
    });

    it('should be stateless when defaultChecked is absent - is checked', () => {
      const onChange = jest.fn();
      const { container } = render(
        <Toggle size="large" isChecked onChange={onChange} />,
      );

      const label = container.querySelector('label');

      expect(label).toBeDefined();
      expect(label?.getAttribute('data-checked')).toBe('true');

      fireEvent.click(label!);
      expect(onChange).toHaveBeenCalled();

      expect(label?.getAttribute('data-checked')).toBe('true');
    });
  });

  describe('defaultChecked is present', () => {
    it('should be stateless when isChecked absent - toggle off', () => {
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

    it('should be stateless when isChecked absent - toggle on', () => {
      const onChange = jest.fn();
      const { container } = render(
        <Toggle size="large" defaultChecked onChange={onChange} />,
      );

      const label = container.querySelector('label');

      expect(label).toBeDefined();
      expect(label?.getAttribute('data-checked')).toBe('true');

      fireEvent.click(label!);
      expect(onChange).toHaveBeenCalled();

      expect(label?.getAttribute('data-checked')).toBe(null);
    });
  });

  describe('using isChecked and defaultChecked together', () => {
    it('should be use isChecked', () => {
      const onChange = jest.fn();
      const { container } = render(
        <Toggle
          size="large"
          defaultChecked
          isChecked={false}
          onChange={onChange}
        />,
      );

      const label = container.querySelector('label');

      expect(label).toBeDefined();
      expect(label?.getAttribute('data-checked')).toBe(null);

      fireEvent.click(label!);
      expect(onChange).toHaveBeenCalled();

      expect(label?.getAttribute('data-checked')).toBe(null);
    });
  });
});
