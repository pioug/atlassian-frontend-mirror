import React, { Component } from 'react';
import { mount, shallow } from 'enzyme';
import { RadioWithoutAnalytics as Radio } from '../../Radio';
import { name } from '../../version.json';

describe(name, () => {
  describe('Radio', () => {
    describe('exports', () => {
      it('the Radio component', () => {
        expect(Radio).not.toBe(undefined);
        expect(new Radio({ onChange: () => {} })).toBeInstanceOf(Component);
      });
    });

    describe('construction', () => {
      it('should be able to create a component', () => {
        const wrapper = shallow(<Radio onChange={() => {}} />);
        expect(wrapper).not.toBe(undefined);
        expect(wrapper.instance()).toBeInstanceOf(Component);
      });

      it('should render an input and the content', () => {
        const content = 'content';
        const wrapper = mount(<Radio onChange={() => {}} label={content} />);
        expect(wrapper.find('input').length).toBe(1);
        expect(wrapper.text()).toBe(content);
      });

      it('should render content with markup correctly', () => {
        const content = <div>content</div>;
        const wrapper = mount(<Radio onChange={() => {}} label={content} />);
        expect(wrapper.find('input').length).toBe(1);
        expect(wrapper.contains(content)).toBe(true);
      });
    });

    describe('props', () => {
      function expectPropReflectedToInput(
        prop: string,
        inputProp: string,
        val: any,
      ) {
        it('should be reflected to the input', () => {
          const props = { [prop]: val };
          const wrapper = mount(<Radio onChange={() => {}} {...props} />);
          expect(wrapper.find('input').prop(inputProp)).toBe(val);
        });
      }

      describe('isDisabled prop', () => {
        expectPropReflectedToInput('isDisabled', 'disabled', true);
        expectPropReflectedToInput('isDisabled', 'disabled', false);
      });

      describe('isRequired prop', () => {
        expectPropReflectedToInput('isRequired', 'required', true);
        expectPropReflectedToInput('isRequired', 'required', false);
      });

      describe('isChecked prop', () => {
        expectPropReflectedToInput('isChecked', 'checked', true);
        expectPropReflectedToInput('isChecked', 'checked', false);
      });

      describe('name prop', () => {
        expectPropReflectedToInput('name', 'name', 'name-val');
      });

      describe('onChange prop', () => {
        it('should be reflected to the input', () => {
          const spy = jest.fn();
          const wrapper = mount(<Radio onChange={spy} />);
          wrapper.find('input').simulate('change');
          expect(spy).toHaveBeenCalledTimes(1);
        });
      });

      describe('value prop', () => {
        expectPropReflectedToInput('value', 'value', 'value-val');
      });

      describe('passing all the extra props passed down to hidden radio input', () => {
        expectPropReflectedToInput('data-foo', 'data-foo', 'radio-bar');
      });
    });
  });
});
