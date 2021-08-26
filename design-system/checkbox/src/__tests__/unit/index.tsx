import React, { ChangeEvent, createRef } from 'react';

import { render } from '@testing-library/react';

import Checkbox from '../../checkbox';

declare var global: any;

describe('@atlaskit/checkbox', () => {
  const renderCheckbox = (overridingProps: any) =>
    render(
      <Checkbox
        label="stub"
        onChange={() => {}}
        name="stub"
        value="stub value"
        {...overridingProps}
      />,
    );
  describe('console errors', () => {
    it('should not log console error on mount', () => {
      jest.spyOn(global.console, 'error');
      renderCheckbox({});
      expect(global.console.error).not.toHaveBeenCalled();
      // @ts-ignore - Property 'mockRestore' does not exist
      global.console.error.mockRestore();
    });
  });
  describe('<Checkbox />', () => {
    describe('<Checkbox /> stateless: should not use state isChecked property when passing it as props', () => {
      it('keeps isChecked as false when passing it as prop and clicking', () => {
        const { getByLabelText } = renderCheckbox({ isChecked: false });
        const checkbox = getByLabelText('stub') as HTMLInputElement;

        checkbox.click();

        expect(checkbox.checked).toBe(false);
      });

      it('keeps isChecked as true when passing it as prop and calling onChange', () => {
        const { getByLabelText } = renderCheckbox({ isChecked: true });
        const checkbox = getByLabelText('stub') as HTMLInputElement;

        checkbox.click();

        expect(checkbox.checked).toBe(true);
      });
    });
    it('should be unchecked by default', () => {
      const { getByLabelText } = renderCheckbox({});
      const checkbox = getByLabelText('stub') as HTMLInputElement;

      expect(checkbox.checked).toBe(false);
    });
    it('should call onchange on change', () => {
      const onChange = jest.fn();
      const { getByLabelText } = renderCheckbox({ onChange: onChange });
      const checkbox = getByLabelText('stub') as HTMLInputElement;

      checkbox.click();

      expect(onChange).toBeCalledTimes(1);
    });
    it('should call onChange and change variable', () => {
      let value = '';
      let checked = false;
      const { getByLabelText } = renderCheckbox({
        onChange: (e: ChangeEvent<HTMLInputElement>) => {
          value = e.currentTarget.value;
          checked = e.currentTarget.checked;
        },
      });
      const checkbox = getByLabelText('stub') as HTMLInputElement;

      checkbox.click();

      expect(value).toBe('stub value');
      expect(checked).toBe(true);
    });
    it('should set the checked state when checked', () => {
      const { getByLabelText } = renderCheckbox({});
      const checkbox = getByLabelText('stub') as HTMLInputElement;

      checkbox.click();

      expect(checkbox.checked).toBe(true);
    });
    it('should set the indeterminate state', () => {
      const { getByLabelText } = renderCheckbox({
        isIndeterminate: true,
        isChecked: true,
      });
      const checkbox = getByLabelText('stub') as HTMLInputElement;

      expect(checkbox.getAttribute('aria-checked')).toBe('mixed');
    });
    it('should set the indeterminate state on the checkbox on update', () => {
      const { getByLabelText, rerender } = renderCheckbox({
        isChecked: false,
        isIndeterminate: false,
      });
      const checkbox = getByLabelText('stub') as HTMLInputElement;

      expect(checkbox.getAttribute('aria-checked')).toBe('false');

      rerender(
        <Checkbox
          label="stub"
          onChange={() => {}}
          name="stub"
          value="stub value"
          isChecked={false}
          isIndeterminate={true}
        />,
      );

      expect(checkbox.getAttribute('aria-checked')).toBe('mixed');
    });
    it('should set aria-invalid attr to input when isInvalid is true', () => {
      const { getByLabelText } = renderCheckbox({ isInvalid: true });

      const checkbox = getByLabelText('stub');
      expect(checkbox.getAttribute('aria-invalid')).toBe('true');
    });
    it('should pass input props as attributes on the checkbox', () => {
      const onFocus = jest.fn();
      const { getByLabelText } = renderCheckbox({
        onFocus: onFocus,
      });
      const checkbox = getByLabelText('stub') as HTMLInputElement;

      checkbox.focus();

      expect(onFocus).toBeCalled();
    });
    it('should set the reference on the checkbox', () => {
      const ref = createRef<HTMLInputElement>();
      const { getByLabelText } = renderCheckbox({
        ref: ref,
      });

      const input = getByLabelText('stub');
      expect(input).toBe(ref.current);
    });
    it('should accept a function as a reference', () => {
      let ourNode: HTMLInputElement | undefined;
      const { getByLabelText } = renderCheckbox({
        ref: (node: HTMLInputElement) => {
          ourNode = node;
        },
      });

      const input = getByLabelText('stub');
      expect(input).toBe(ourNode);
    });
  });
  describe('<Checkbox defaultChecked/>', () => {
    it('should be checked when defaultChecked is set to checked', () => {
      const { getByLabelText } = renderCheckbox({ defaultChecked: true });
      const checkbox = getByLabelText('stub') as HTMLInputElement;

      expect(checkbox.checked).toBe(true);
    });
    it('should change checked after defaultChecked is set to true', () => {
      const { getByLabelText } = renderCheckbox({ defaultChecked: true });
      const checkbox = getByLabelText('stub') as HTMLInputElement;

      expect(checkbox.checked).toBe(true);

      checkbox.click();

      expect(checkbox.checked).toBe(false);
    });
  });

  describe('<Checkbox /> label text should be present conditionally', () => {
    it('should be checked when defaultChecked is set to checked', () => {
      const { getByTestId } = renderCheckbox({
        label: undefined,
        testId: 'test',
      });
      const checkbox = getByTestId('test--checkbox-label') as HTMLInputElement;

      expect(checkbox.querySelector('span')).toBe(null);
    });
    it('should change checked after defaultChecked is set to true', () => {
      const { getByTestId } = renderCheckbox({ testId: 'test' });
      const checkbox = getByTestId('test--checkbox-label') as HTMLInputElement;

      expect(checkbox.querySelector('span')).toBeDefined();
    });
  });
});
