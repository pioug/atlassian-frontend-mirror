import React from 'react';
import { mount, shallow } from 'enzyme';
import * as renderer from 'react-test-renderer';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import Banner from '../../Banner';
import {
  backgroundColor,
  textColor,
  testErrorBackgroundColor,
  testErrorTextColor,
  Container,
  Visibility,
  Text,
} from '../../../styled';

describe('banner', () => {
  it('basic sanity check', () =>
    expect(shallow(<Banner />)).not.toBe(undefined));

  describe('props', () => {
    describe('appearance prop', () => {
      it('should default to warning appearance', () =>
        expect(mount(<Banner />).prop('appearance')).toBe('warning'));
      it('should apply error styles when error appearance supplied', () => {
        const props = { appearance: 'error' };
        expect(backgroundColor(props)).toBe(testErrorBackgroundColor);
        expect(textColor(props)).toBe(testErrorTextColor);
      });
    });

    it('should render children prop', () => {
      const wrapper = mount(<Banner>Testing!</Banner>);
      expect(wrapper.find(Text).text()).toBe('Testing!');
    });

    it('should render icon prop', () => {
      const wrapper = shallow(
        <Banner
          icon={<WarningIcon label="Warning" secondaryColor="inherit" />}
        />,
      );
      expect(wrapper.find(WarningIcon).exists()).toBe(true);
    });

    describe('isOpen prop', () => {
      it('should default to not being open', () =>
        expect(mount(<Banner />).prop('isOpen')).toBe(false));
      it('should have height 0 on visibility component', () => {
        expect(
          mount(<Banner />)
            .find(Visibility)
            .prop('bannerHeight'),
        ).toBe(0);
      });
      it('should have height in pixels when open', () => {
        expect(
          mount(<Banner isOpen />)
            .find(Visibility)
            .prop('bannerHeight'),
          // This height will not be '0px' in a real render, and discovered
          // that in enzyme, clientHeight is always 0. This means that checking
          // that these sizes are correct cannot have reliable tests written for it.
          // See https://github.com/airbnb/enzyme/issues/1435 for context
        ).toBe(0);
      });
    });
  });

  describe('a11y', () => {
    it('should have role=alert', () =>
      expect(
        shallow(<Banner />)
          .find(Container)
          .is('[role="alert"]'),
      ).toBe(true));

    it('should be aria-hidden=false when isOpen is true', () =>
      expect(
        shallow(<Banner isOpen />)
          .find(Container)
          .is('[aria-hidden=false]'),
      ).toBe(true));

    it('should be aria-hidden=true when isOpen is false', () =>
      expect(
        shallow(<Banner />)
          .find(Container)
          .is('[aria-hidden=true]'),
      ).toBe(true));
  });

  it('should render warning banner correctly', () => {
    const wrapper = (
      <Banner isOpen appearance="warning">
        This is a warning banner with a <a href="http://atlassian.com">link</a>
      </Banner>
    );
    const Component = renderer.create(wrapper).toJSON();
    expect(Component).toMatchSnapshot();
  });

  it('should render error banner correctly', () => {
    const wrapper = (
      <Banner isOpen appearance="error">
        This is an error banner with a <a href="http://atlassian.com">link</a>
      </Banner>
    );
    const Component = renderer.create(wrapper).toJSON();
    expect(Component).toMatchSnapshot();
  });
});
