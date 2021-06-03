import React from 'react';

import { fireEvent, render } from '@testing-library/react';

import Radio from '../../Radio';

describe('Radio', () => {
  it('should render an input and the content', () => {
    const content = 'content';
    const { queryByDisplayValue, queryByLabelText } = render(
      <Radio name="name" value="value" label={content} />,
    );
    expect(queryByDisplayValue('value')).not.toBeNull();
    expect(queryByLabelText(content)).not.toBeNull();
  });

  describe('props', () => {
    it('should set disabled to be true if isDisabled is true', () => {
      const { getByDisplayValue } = render(
        <Radio value="test" isDisabled={true} />,
      );
      const radio = getByDisplayValue('test') as HTMLInputElement;
      expect(radio.disabled).toBe(true);
    });

    it('should set disabled to be false if isDisabled is false', () => {
      const { getByDisplayValue } = render(
        <Radio value="test" isDisabled={false} />,
      );
      const radio = getByDisplayValue('test') as HTMLInputElement;
      expect(radio.disabled).toBe(false);
    });

    it('should set required to be true if isRequired is true', () => {
      const { getByDisplayValue } = render(
        <Radio value="test" isRequired={true} />,
      );
      const radio = getByDisplayValue('test') as HTMLInputElement;
      expect(radio.required).toBe(true);
    });

    it('should set required to be false if isRequired is false', () => {
      const { getByDisplayValue } = render(
        <Radio value="test" isRequired={false} />,
      );
      const radio = getByDisplayValue('test') as HTMLInputElement;
      expect(radio.required).toBe(false);
    });

    it('should set checked to be true if isChecked is true', () => {
      const { getByDisplayValue } = render(
        <Radio value="test" isChecked={true} />,
      );
      const radio = getByDisplayValue('test') as HTMLInputElement;
      expect(radio.checked).toBe(true);
    });

    it('should set checked to be false if isChecked is false', () => {
      const { getByDisplayValue } = render(
        <Radio value="test" isChecked={false} />,
      );
      const radio = getByDisplayValue('test') as HTMLInputElement;
      expect(radio.checked).toBe(false);
    });

    it('should set name if name prop is set', () => {
      const { getByDisplayValue } = render(
        <Radio value="test" name="name-val" />,
      );
      const radio = getByDisplayValue('test') as HTMLInputElement;
      expect(radio.name).toBe('name-val');
    });

    it('should set value if value prop is set', () => {
      const { getByLabelText } = render(
        <Radio value="value-val" label="test" />,
      );
      const radio = getByLabelText('test') as HTMLInputElement;
      expect(radio.value).toBe('value-val');
    });

    it('should add extra props onto the input', () => {
      const { getByLabelText } = render(
        <Radio label="test" {...{ ['data-foo']: 'radio-bar' }} />,
      );
      const radio = getByLabelText('test') as HTMLInputElement;
      expect(radio.getAttribute('data-foo')).toBe('radio-bar');
    });

    it('should accept input props', () => {
      const spy = jest.fn();
      const { getByLabelText } = render(
        <Radio label="test" onMouseDown={spy} />,
      );
      const radio = getByLabelText('test') as HTMLInputElement;
      fireEvent.mouseDown(radio);

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should use the ref prop', () => {
      const ref = React.createRef<HTMLInputElement>();
      const { getByLabelText } = render(<Radio label="test" ref={ref} />);

      const input = getByLabelText('test');
      expect(input).toBe(ref.current);
    });
  });

  describe('onChange prop', () => {
    it('should be called once on change', () => {
      const spy = jest.fn();
      const { getByLabelText } = render(
        <Radio label="test" value="kachow" onChange={spy} />,
      );
      const radio = getByLabelText('test') as HTMLInputElement;
      fireEvent.click(radio);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should be reflected to the input', () => {
      let value = '';
      const { getByLabelText } = render(
        <Radio
          label="test"
          value="kachow"
          onChange={(e) => {
            value = e.currentTarget.value;
          }}
        />,
      );
      const radio = getByLabelText('test') as HTMLInputElement;
      fireEvent.click(radio);
      expect(value).toBe('kachow');
    });
  });
});
