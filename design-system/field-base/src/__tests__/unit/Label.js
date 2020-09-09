import React from 'react';
import { shallow, mount } from 'enzyme';

import { Label } from '../..';

import { RequiredIndicator, LabelInner } from '../../styled/Label';

const testLabel = 'test';
const isLabelHidden = true;

describe('ak-field-base', () => {
  describe('Label', () => {
    describe('by default', () => {
      it('should render a label element', () => {
        expect(
          shallow(
            <Label label={testLabel} isLabelHidden={isLabelHidden} />,
          ).find(LabelInner).length,
        ).toBeGreaterThan(0);
      });
    });

    describe('label prop', () => {
      it('should be reflected in the label element', () => {
        const label = 'This is a label';
        const wrapper = mount(<Label label={label} />);
        expect(wrapper.find(LabelInner).childAt(0).text()).toBe(label);
      });
    });

    describe('hideLabel prop', () => {
      it('should be reflected in the label element', () => {
        const label = 'This is a label';
        const wrapper = mount(<Label label={label} isLabelHidden />);
        expect(wrapper.find(LabelInner).prop('isHidden')).toBe(true);
      });
    });

    describe('required prop', () => {
      it('should append an asterisk to the content', () => {
        expect(
          shallow(
            <Label
              label={testLabel}
              isLabelHidden={isLabelHidden}
              isRequired
            />,
          ).find(RequiredIndicator).length,
        ).toBeGreaterThan(0);
      });

      it('should not append an asterisk to the content if required is not set', () => {
        expect(
          shallow(
            <Label label={testLabel} isLabelHidden={isLabelHidden} />,
          ).find(RequiredIndicator).length,
        ).toBe(0);
        expect(
          shallow(<Label label={testLabel} isLabelHidden={isLabelHidden} />)
            .find('span')
            .text(),
        ).toBe('test');
      });
    });

    describe('appearance prop', () => {
      it('should be "default" appearance by default', () => {
        expect(
          mount(<Label label="required prop label" />).prop('appearance'),
        ).toBe('default');
      });

      it('should set prop for it', () => {
        expect(
          mount(<Label label="required prop label" />)
            .find(LabelInner)
            .prop('inlineEdit'),
        ).toBe(false);
        expect(
          mount(<Label label="required prop label" appearance="inline-edit" />)
            .find(LabelInner)
            .prop('inlineEdit'),
        ).toBe(true);
      });
    });

    describe('isFirstChild prop', () => {
      it('should set prop for it', () => {
        expect(
          mount(<Label label="required prop label" />)
            .find(LabelInner)
            .prop('firstChild'),
        ).toBe(undefined);
        expect(
          mount(<Label label="required prop label" isFirstChild />)
            .find(LabelInner)
            .prop('firstChild'),
        ).toBe(true);
      });
    });

    describe('onClick prop', () => {
      it('should fire handler when the span is clicked', () => {
        const handler = jest.fn();
        const wrapper = shallow(
          <Label
            label={testLabel}
            isLabelHidden={isLabelHidden}
            onClick={handler}
          />,
        );
        wrapper.find('span').simulate('click');
        expect(handler).toHaveBeenCalledTimes(1);
      });
    });

    describe('.children', () => {
      it('should render any children passed to it', () => {
        const wrapper = shallow(
          <Label label={testLabel} isLabelHidden={isLabelHidden}>
            <div className="foo">Here is some child content!</div>
          </Label>,
        );
        expect(wrapper.find('div.foo')).not.toBe(undefined);
      });
    });
  });
});
