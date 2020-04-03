import React from 'react';
import { shallow } from 'enzyme';
import { HeaderButtons, Header, Description } from '../../common';
import {
  Title,
  Wrapper,
  Description as StyledDescription,
} from '../../styled/common';

describe('Common Components', () => {
  describe('HeaderButtons', () => {
    const getDefaultProps = () => ({
      optOutLabel: 'a',
      canClose: true,
      canOptOut: true,
      onClose: jest.fn(),
      onOptOut: jest.fn(),
    });

    it('should render an opt out button if canOptOut is true', () => {
      const props = getDefaultProps();
      const wrapper = shallow(<HeaderButtons {...props} />);
      expect(
        wrapper
          .findWhere(n => {
            return n.prop('onClick') === props.onOptOut;
          })
          .exists(),
      ).toBe(true);
    });

    it('should not render an opt out button if canOptOut is false', () => {
      const props = { ...getDefaultProps(), canOptOut: false };
      const wrapper = shallow(<HeaderButtons {...props} />);
      expect(
        wrapper
          .findWhere(n => {
            return n.prop('onClick') === props.onOptOut;
          })
          .exists(),
      ).toBe(false);
    });

    it('should render a close button if canClose is true', () => {
      const props = getDefaultProps();
      const wrapper = shallow(<HeaderButtons {...props} />);
      expect(
        wrapper
          .findWhere(n => {
            return n.prop('onClick') === props.onClose;
          })
          .exists(),
      ).toBe(true);
    });

    it('should not render a close button if canClose is false', () => {
      const props = { ...getDefaultProps(), canClose: false };
      const wrapper = shallow(<HeaderButtons {...props} />);
      expect(
        wrapper
          .findWhere(n => {
            return n.prop('onClick') === props.onClose;
          })
          .exists(),
      ).toBe(false);
    });
  });

  describe('Header', () => {
    const getDefaultProps = () => ({
      title: 'a',
      canClose: true,
      canOptOut: true,
      onClose: jest.fn(),
      onOptOut: jest.fn(),
      optOutLabel: 'b',
    });

    it('should render a Title', () => {
      const props = getDefaultProps();
      const wrapper = shallow(<Header {...props} />);
      const title = wrapper.find(Title);
      expect(title.exists()).toBe(true);
      expect(
        title
          .children()
          .first()
          .text(),
      ).toEqual(props.title);
    });

    it('should render HeaderButtons', () => {
      const props = getDefaultProps();
      const wrapper = shallow(<Header {...props} />);
      expect(wrapper.find(HeaderButtons).exists()).toBe(true);
    });
  });

  describe('Description', () => {
    it('should render a Wrapper', () => {
      const wrapper = shallow(<Description>a</Description>);
      expect(wrapper.find(Wrapper).exists()).toBe(true);
    });

    it('should render a StyledDescription', () => {
      const wrapper = shallow(<Description>a</Description>);
      expect(wrapper.find(StyledDescription).exists()).toBe(true);
    });
  });
});
