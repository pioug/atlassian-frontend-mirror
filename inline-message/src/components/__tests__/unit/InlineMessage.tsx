import React from 'react';
import { shallow, mount } from 'enzyme';
import Button from '@atlaskit/button';
import InlineDialog from '@atlaskit/inline-dialog';
import InlineMessage from '../../..';
import IconForType from '../../IconForType';
import { Text, Title } from '../../InlineMessage/styledInlineMessage';

describe('Inline Message', () => {
  it('basic sanity check', () => {
    expect(shallow(<InlineMessage />)).not.toBe(undefined);
  });

  describe('isOpen state', () => {
    it('should default to false', () => {
      expect(shallow(<InlineMessage />).state('isOpen')).toBe(false);
    });
    it('should toggle when the button is clicked', () => {
      const wrapper = shallow(<InlineMessage />);
      wrapper.find(Button).simulate('click');
      expect(wrapper.state('isOpen')).toBe(true);
    });
  });

  describe('props', () => {
    describe('title', () => {
      it('supplied title should be rendered', () => {
        expect(
          mount(<InlineMessage title="Title goes here" />)
            .find(Title)
            .text(),
        ).toBe('Title goes here');
      });
    });
    describe('secondaryText', () => {
      it('supplied secondary text should be rendered', () => {
        expect(
          mount(<InlineMessage secondaryText="Secondary goes here" />)
            .find(Text)
            .text(),
        ).toBe('Secondary goes here');
      });
    });
    describe('type', () => {
      it('should default to "connectivity"', () => {
        expect(mount(<InlineMessage />).prop('type')).toBe('connectivity');
      });
      it('should be passed to IconForType component', () => {
        expect(
          shallow(<InlineMessage type="error" />)
            .find(IconForType)
            .prop('type'),
        ).toBe('error');
      });
    });
    describe('placement', () => {
      it('should default to "bottom-start"', () => {
        expect(mount(<InlineMessage />).prop('placement')).toBe('bottom-start');
      });
      it('should be passed to InlineDialog component', () => {
        expect(
          shallow(<InlineMessage placement="right" />)
            .find(InlineDialog)
            .prop('placement'),
        ).toBe('right');
      });
    });
  });
});
