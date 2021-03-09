import React, { Component } from 'react';
import { mount, shallow } from 'enzyme';

import AkRadio from '../../Radio';
import Radio from '../../RadioBase';

describe('@atlaskit/field-radio-group', () => {
  describe('Radio', () => {
    describe('exports', () => {
      it('the Radio component', () => {
        expect(Radio).not.toBe(undefined);
        expect(new Radio()).toBeInstanceOf(Component);
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
        const wrapper = mount(<Radio onChange={() => {}}>{content}</Radio>);
        expect(wrapper.find('input').length).toBe(1);
        expect(wrapper.text()).toBe(content);
      });

      it('should render content with markup correctly', () => {
        const content = <div>content</div>;
        const wrapper = mount(<Radio onChange={() => {}}>{content}</Radio>);
        expect(wrapper.find('input').length).toBe(1);
        expect(wrapper.contains(content)).toBe(true);
      });
    });

    describe('props', () => {
      function expectPropReflectedToInput(prop, inputProp, val) {
        it('should be reflected to the input', () => {
          const props = { [prop]: val };
          const wrapper = mount(<AkRadio onChange={() => {}} {...props} />);
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

      describe('isSelected prop', () => {
        expectPropReflectedToInput('isSelected', 'checked', true);
        expectPropReflectedToInput('isSelected', 'checked', false);
      });

      describe('name prop', () => {
        expectPropReflectedToInput('name', 'name', 'name-val');
      });

      describe('onChange prop', () => {
        const func = () => {};
        expectPropReflectedToInput('onChange', 'onChange', func);

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
    });
  });
});
