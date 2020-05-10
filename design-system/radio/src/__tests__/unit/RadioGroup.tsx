import React, { Component } from 'react';

import { mount, shallow, ShallowWrapper } from 'enzyme';

import { RadioWithoutAnalytics as Radio } from '../../Radio';
import RadioGroup from '../../RadioGroup';
import { OptionPropType } from '../../types';
import { name } from '../../version.json';

describe(name, () => {
  describe('RadioGroup', () => {
    const sampleOptions = [
      { name: 'test', value: '1', label: 'one' },
      { name: 'test', value: '2', label: 'two' },
      { name: 'test', value: '3', label: <i>three</i>, isDisabled: true },
    ];

    describe('exports', () => {
      it('the RadioGroup component', () => {
        expect(RadioGroup).not.toBe(undefined);
        expect(
          new RadioGroup({
            value: null,
            defaultValue: null,
            options: [],
            onChange: () => {},
          }),
        ).toBeInstanceOf(Component);
      });
    });

    describe('construction', () => {
      it('should be able to create a component', () => {
        const wrapper = shallow(
          <RadioGroup options={sampleOptions} onChange={() => {}} />,
        );
        expect(wrapper).not.toBe(undefined);
        expect(wrapper.instance()).toBeInstanceOf(Component);
      });

      it('should render a Radio for each option', () => {
        const wrapper = mount(
          <RadioGroup onChange={() => {}} options={sampleOptions} />,
        );
        expect(wrapper.find(Radio).length).toBe(3);
      });
    });

    describe('props', () => {
      describe('options prop', () => {
        it('renders a Radio with correct props for each option in the array', () => {
          const wrapper = mount(
            <RadioGroup onChange={() => {}} options={sampleOptions} />,
          );
          expect(wrapper.find(Radio).length).toBe(sampleOptions.length);

          const radios = wrapper.find(Radio);
          for (let i = 0; i < sampleOptions.length; i++) {
            const radio = radios.at(i);
            const option: OptionPropType = sampleOptions[i];
            expect(radio.prop('name')).toBe(option.name);
            expect(radio.prop('value')).toBe(option.value);
            expect(radio.prop('label')).toBe(option.label);
            expect(radio.prop('isDisabled')).toBe(!!option.isDisabled);
            expect(radio.prop('isChecked')).toBe(!!option.isChecked);
          }
        });
      });
      describe('isDisabled prop', () => {
        it('is reflected to each Radio option', () => {
          const isDisabled = true;
          const wrapper = mount(
            <RadioGroup
              onChange={() => {}}
              isDisabled={isDisabled}
              options={sampleOptions}
            />,
          );
          expect(wrapper.find(Radio).length).toBeGreaterThan(0);
          wrapper
            .find(Radio)
            .forEach(radio => expect(radio.prop('isDisabled')).toBe(true));
        });
        it('if set, overrides isDisabled values set on each option', () => {
          const isDisabled = true;
          const wrapper = mount(
            <RadioGroup
              onChange={() => {}}
              isDisabled={isDisabled}
              options={[
                ...sampleOptions,
                {
                  name: 'color',
                  value: 'red',
                  label: 'Red',
                  isDisabled: false,
                },
              ]}
            />,
          );
          expect(wrapper.find(Radio).length).toBeGreaterThan(0);
          wrapper.find(Radio).forEach(radio => {
            expect(radio.prop('isDisabled')).toBe(true);
          });
        });
      });
      describe('isRequired prop', () => {
        it('is reflected to each Radio option', () => {
          const isRequired = true;
          const wrapper = mount(
            <RadioGroup
              onChange={() => {}}
              isRequired={isRequired}
              options={sampleOptions}
            />,
          );
          expect(wrapper.find(Radio).length).toBeGreaterThan(0);
          wrapper.find(Radio).forEach(radio => {
            expect(radio.prop('isRequired')).toBe(true);
          });
        });
      });

      describe('name prop', () => {
        it('is reflected to each Radio option and takes precedence over the name property in options', () => {
          const testName = 'test-name';
          const wrapper = mount(
            <RadioGroup
              onChange={() => {}}
              name={testName}
              options={sampleOptions}
            />,
          );
          expect(wrapper.find(Radio).length).toBeGreaterThan(0);
          wrapper.find(Radio).forEach(radio => {
            expect(radio.prop('name')).toBe(testName);
          });
        });

        it('name property in options is used if there is no name passed into RadioGroup', () => {
          const wrapper = mount(
            <RadioGroup onChange={() => {}} options={sampleOptions} />,
          );
          expect(wrapper.find(Radio).length).toBeGreaterThan(0);
          wrapper.find(Radio).forEach((radio, i) => {
            expect(radio.prop('name')).toBe(sampleOptions[i].name);
          });
        });
      });

      describe('value prop', () => {
        it('sets the corresponding Radio instance isChecked prop to true', () => {
          const wrapper = mount(
            <RadioGroup
              value={sampleOptions[0].value}
              options={sampleOptions}
              onChange={() => {}}
            />,
          );
          const radio = () => wrapper.find(Radio);

          const rUncontrolled = radio();
          expect(rUncontrolled.at(0).prop('isChecked')).toBe(true);
          expect(rUncontrolled.at(1).prop('isChecked')).toBe(false);
          expect(rUncontrolled.at(2).prop('isChecked')).toBe(false);
        });
        it('Ignores internal state values, if a value prop is specified', () => {
          const wrapper = mount(
            <RadioGroup
              value={sampleOptions[0].value}
              options={sampleOptions}
              onChange={() => {}}
            />,
          );

          const radio = () => wrapper.find(Radio);
          const rUncontrolled = radio();
          expect(rUncontrolled.at(0).prop('isChecked')).toBe(true);
          expect(rUncontrolled.at(1).prop('isChecked')).toBe(false);
          expect(rUncontrolled.at(2).prop('isChecked')).toBe(false);

          radio()
            .at(2)
            .find('input')
            .simulate('change');
          expect(wrapper.state('value')).toBe(sampleOptions[2].value);

          const rUncontrolledClicked = radio();
          expect(rUncontrolledClicked.at(0).prop('isChecked')).toBe(true);
          expect(rUncontrolledClicked.at(1).prop('isChecked')).toBe(false);
          expect(rUncontrolledClicked.at(2).prop('isChecked')).toBe(false);
        });
        it('If set to undefined, it will revert to the value set in state', () => {
          const wrapper = mount(
            <RadioGroup
              value={sampleOptions[0].value}
              options={sampleOptions}
              onChange={() => {}}
            />,
          );
          const radio = () => wrapper.find(Radio);

          const rUncontrolled = radio();
          expect(rUncontrolled.at(0).prop('isChecked')).toBe(true);
          expect(rUncontrolled.at(1).prop('isChecked')).toBe(false);
          expect(rUncontrolled.at(2).prop('isChecked')).toBe(false);

          radio()
            .at(1)
            .find('input')
            .simulate('change');

          const rUncontrolledClicked = radio();
          expect(rUncontrolledClicked.at(0).prop('isChecked')).toBe(true);
          expect(rUncontrolledClicked.at(1).prop('isChecked')).toBe(false);
          expect(rUncontrolledClicked.at(2).prop('isChecked')).toBe(false);

          wrapper.setProps({ value: undefined });
          const rControlled = radio();
          expect(rControlled.at(0).prop('isChecked')).toBe(false);
          expect(rControlled.at(1).prop('isChecked')).toBe(true);
          expect(rControlled.at(2).prop('isChecked')).toBe(false);
        });
      });

      describe('defaultValue prop', () => {
        it('initially sets the corresponding Radio instance isChecked prop to true', () => {
          const wrapper = mount(
            <RadioGroup
              defaultValue={sampleOptions[0].value}
              options={sampleOptions}
              onChange={() => {}}
            />,
          );

          const radio = () => wrapper.find(Radio);
          const r = radio();

          expect(r.at(0).prop('isChecked')).toBe(true);
          expect(r.at(1).prop('isChecked')).toBe(false);
          expect(r.at(2).prop('isChecked')).toBe(false);
        });
        it('overrides the checked Radio instance once a subsequent Radio has been triggered', () => {
          const wrapper = mount(
            <RadioGroup
              defaultValue={sampleOptions[0].value}
              options={sampleOptions}
              onChange={() => {}}
            />,
          );
          const radio = () => wrapper.find(Radio);
          const rNeutral = radio();

          expect(rNeutral.at(0).prop('isChecked')).toBe(true);
          expect(rNeutral.at(1).prop('isChecked')).toBe(false);
          expect(rNeutral.at(2).prop('isChecked')).toBe(false);

          radio()
            .at(2)
            .find('input')
            .simulate('change');

          expect(wrapper.state('value')).toBe(sampleOptions[2].value);
          const rNew = radio();
          expect(rNew.at(0).prop('isChecked')).toBe(false);
          expect(rNew.at(1).prop('isChecked')).toBe(false);
          expect(rNew.at(2).prop('isChecked')).toBe(true);
        });
      });

      describe('onChange prop', () => {
        it('is called when a radio option is changed', () => {
          const spy = jest.fn();
          const wrapper = mount(
            <RadioGroup onChange={spy} options={sampleOptions} />,
          );
          wrapper
            .find(Radio)
            .first()
            .find('input')
            .simulate('change');
          expect(spy).toHaveBeenCalledTimes(1);
        });
      });
    });

    describe('selection', () => {
      function expectRadioChecked(wrapper: ShallowWrapper, index: number) {
        const radios = wrapper.find(Radio);
        for (let i = 0; i < radios.length; i++) {
          expect(radios.at(i).prop('isChecked')).toBe(index === i);
        }
      }

      function expectNoRadioChecked(wrapper: ShallowWrapper) {
        return expectRadioChecked(wrapper, -1);
      }

      it('selects the radio with a value corresponding to the specified value prop', () => {
        const options = [
          { name: 'n', value: '0' },
          { name: 'n', value: '1' },
          { name: 'n', value: '2' },
        ];
        const wrapper = shallow(
          <RadioGroup
            options={options}
            onChange={() => {}}
            value={options[2].value}
          />,
        );
        expect(wrapper).toBeDefined();
        expectRadioChecked(wrapper, 2);
      });
      it('does not select an option if not specified', () => {
        const options = [
          { name: 'n', value: '0' },
          { name: 'n', value: '1' },
          { name: 'n', value: '2' },
        ];
        const wrapper = shallow(
          <RadioGroup onChange={() => {}} options={options} />,
        );
        expect(wrapper).toBeDefined();
        expectNoRadioChecked(wrapper);
      });
      it('can select a radio which is disabled', () => {
        const options = [
          { name: 'n', value: '0' },
          { name: 'n', value: '1' },
          { name: 'n', value: '2', isDisabled: true },
        ];
        const wrapper = shallow(
          <RadioGroup
            options={options}
            onChange={() => {}}
            value={options[2].value}
          />,
        );
        expect(wrapper).toBeDefined();
        expectRadioChecked(wrapper, 2);
      });
    });
  });
});
