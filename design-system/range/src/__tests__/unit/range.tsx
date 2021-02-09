import React from 'react';

import { fireEvent, render } from '@testing-library/react';

import Range from '../../index';

describe('Range', () => {
  describe('with default props', () => {
    const baseProps = {
      value: 20.12,
      testId: 'range',
    };

    it('should have input with interface "range"', () => {
      const { getByTestId } = render(<Range {...baseProps} />);
      const input = getByTestId('range') as HTMLInputElement;
      expect(input.type).toBe('range');
    });

    it('should have percent value on styled component', () => {
      const { getByTestId } = render(<Range {...baseProps} />);
      const input = getByTestId('range');
      const cssVar = input.style.getPropertyValue('--range-inline-width');
      // Will get snapped to the nearest step
      expect(cssVar).toBe('20.00%');
    });

    it('should have min, max, step and valuePercent set to default values', () => {
      const { getByTestId } = render(<Range {...baseProps} />);
      const input = getByTestId('range') as HTMLInputElement;
      expect(input.min).toBe('0');
      expect(input.max).toBe('100');
      expect(input.step).toBe('1');
    });

    it('should input with defined value', () => {
      const { getByTestId } = render(<Range {...baseProps} />);
      const input = getByTestId('range') as HTMLInputElement;
      expect(input.value).toBe('20.12');
    });

    it('should not be disabled by default', () => {
      const { getByTestId } = render(<Range {...baseProps} />);
      const input = getByTestId('range') as HTMLInputElement;
      expect(input).not.toBeDisabled();
    });
  });

  describe('with defined props', () => {
    let onChangeSpy: any;
    let baseProps: any;

    beforeEach(() => {
      onChangeSpy = jest.fn();
      baseProps = {
        value: 25,
        min: 10,
        max: 20,
        onChange: onChangeSpy,
        testId: 'range',
      };
    });

    it('should have defined min and max values', () => {
      const { getByTestId } = render(<Range {...baseProps} />);
      const input = getByTestId('range') as HTMLInputElement;
      expect(input.min).toBe('10');
      expect(input.max).toBe('20');
    });

    it('should call spy when value is changed', () => {
      const { getByTestId } = render(<Range {...baseProps} />);
      const input = getByTestId('range') as HTMLInputElement;
      fireEvent.change(input);
      expect(onChangeSpy).toHaveBeenCalledTimes(1);
    });

    it('should change input value when prop is changed', () => {
      const { getByTestId, rerender } = render(<Range {...baseProps} />);
      rerender(<Range {...baseProps} value={15} />);
      const input = getByTestId('range') as HTMLInputElement;
      expect(input.value).toBe('15');
    });

    it('should be disabled if isDisabled prop is truthy', () => {
      const { getByTestId } = render(
        <Range {...baseProps} isDisabled={true} />,
      );
      const input = getByTestId('range');
      expect(input).toBeDisabled();
    });

    it('should not be disabled if isDisabled prop is falsy', () => {
      const { getByTestId } = render(
        <Range {...baseProps} isDisabled={false} />,
      );
      const input = getByTestId('range');
      expect(input).not.toBeDisabled();
    });

    it('should use the ref prop', () => {
      const ref = React.createRef<HTMLInputElement>();
      const { getByTestId } = render(<Range {...baseProps} ref={ref} />);
      const input = getByTestId('range');
      expect(input).toBe(ref.current);
    });

    it('should pass all the extra props passed down to hidden input', () => {
      const { getByTestId } = render(
        <Range {...baseProps} data-foo="range-bar" />,
      );
      const input = getByTestId('range');
      expect(input).toHaveAttribute('data-foo', 'range-bar');
    });
  });
});
