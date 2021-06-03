import React, { Component } from 'react';
import { mount, shallow } from 'enzyme';

import FieldRadioGroup, { AkFieldRadioGroup } from '../..';
import Radio from '../../RadioBase';

describe('@atlaskit/field-radio-group', () => {
  describe('FieldRadioGroup (smart)', () => {
    const sampleItems = [
      { name: 'test', value: '1', label: 'one' },
      { name: 'test', value: '2', label: 'two' },
      { name: 'test', value: '3', label: <i>three</i>, isDisabled: true },
    ];

    describe('exports', () => {
      it('the FieldRadioGroup component', () => {
        expect(FieldRadioGroup).not.toBe(undefined);
        expect(new FieldRadioGroup()).toBeInstanceOf(Component);
      });
    });

    describe('construction', () => {
      let wrapper;

      beforeEach(() => {
        wrapper = shallow(<FieldRadioGroup />);
      });

      it('should be able to create a component', () => {
        expect(wrapper).not.toBe(undefined);
        expect(wrapper.instance()).toBeInstanceOf(Component);
      });

      it('should render a FieldRadioGroup component', () => {
        expect(wrapper.find(AkFieldRadioGroup).length).toBe(1);
      });

      it('should set up the onRadioChange prop for the AkFieldRadioGroup', () => {
        expect(
          typeof wrapper.find(AkFieldRadioGroup).prop('onRadioChange'),
        ).toBe('function');
      });

      it('should set up the initial state', () => {
        expect(wrapper.state('selectedValue')).toBe(null);
      });
    });

    describe('props', () => {
      describe('defaultValue prop', () => {
        it('renders an Radio with correct props for each item in the array', () => {
          const wrapper = mount(<FieldRadioGroup items={sampleItems} />);
          expect(wrapper.find(Radio).length).toBe(sampleItems.length);

          const radios = wrapper.find(Radio);
          for (let i = 0; i < sampleItems.length; i++) {
            const radio = radios.at(i);
            const item = sampleItems[i];
            expect(radio.prop('name')).toBe(item.name);
            expect(radio.prop('value')).toBe(item.value);
            expect(radio.prop('children')).toBe(item.label);
            expect(radio.prop('isDisabled')).toBe(!!item.isDisabled);
            expect(radio.prop('isSelected')).toBe(false);
          }
        });
      });

      describe('items prop with defaultValue', () => {
        const sampleItemsWithDefault = sampleItems.map((item) => ({ ...item }));
        sampleItemsWithDefault[2].defaultSelected = true;

        it('selects the item by default', () => {
          const wrapper = mount(
            <FieldRadioGroup items={sampleItemsWithDefault} />,
          );
          expect(wrapper.find(Radio).at(2).prop('isSelected')).toBe(true);
        });

        it('is overridden when an item is selected', () => {
          const wrapper = mount(
            <FieldRadioGroup items={sampleItemsWithDefault} />,
          );

          const radios = () => wrapper.find(Radio);
          radios().at(0).find('input').simulate('change');

          expect(wrapper.state('selectedValue')).toBe(
            sampleItemsWithDefault[0].value,
          );
          const r = radios();
          expect(r.at(0).prop('isSelected')).toBe(true);
          expect(r.at(1).prop('isSelected')).toBe(false);
          expect(r.at(2).prop('isSelected')).toBe(false);
        });
      });

      describe('onRadio changed prop', () => {
        it('should be called when a value is selected', () => {
          const spy = jest.fn();
          const wrapper = mount(
            <FieldRadioGroup items={sampleItems} onRadioChange={spy} />,
          );
          wrapper.find(Radio).first().find('input').simulate('change');
          expect(spy).toHaveBeenCalledTimes(1);
        });

        it('updates the selectedValue state when a radio is changed', () => {
          const wrapper = mount(<FieldRadioGroup items={sampleItems} />);
          expect(wrapper.state('selectedValue')).toBe(null);
          wrapper.find(Radio).first().find('input').simulate('change');
          expect(wrapper.state('selectedValue')).toBe(sampleItems[0].value);
        });
      });
    });
  });
});
