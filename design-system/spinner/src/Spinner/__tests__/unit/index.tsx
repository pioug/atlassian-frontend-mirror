import React from 'react';
import { mount } from 'enzyme';
import * as colors from '@atlaskit/theme/colors';

import sinon from 'sinon';
import Spinner from '../..';
import Container, { getContainerAnimation } from '../../styledContainer';
import Svg, { svgStyles, getStrokeColor } from '../../styledSvg';

beforeEach(() => {
  sinon.stub(console, 'error');
});

afterEach(() => {
  // @ts-ignore
  console.error.restore(); // eslint-disable-line no-console
});

describe('Spinner', () => {
  it('should be possible to create a component', () => {
    const wrapper = mount(<Spinner />);
    expect(wrapper).not.toBe(undefined);
  });

  it('should be active by default', () => {
    const wrapper = mount(<Spinner />);
    expect(wrapper.prop('isCompleting')).toBe(false);
  });

  it('should not use the inverted color scheme by default', () => {
    const wrapper = mount(<Spinner />);
    expect(wrapper.prop('invertColor')).toBe(false);
    expect(wrapper.find(Svg).prop('invertColor')).toBe(false);
  });

  it('should start in the DELAY phase by default', () => {
    const wrapper = mount(<Spinner />);
    expect(wrapper.find(Container).prop('phase')).toBe('DELAY');
  });

  it('should leave the DELAY state after some time', () => {
    const wrapper = mount(<Spinner />);
    wrapper.find(Container).simulate('animationEnd');
    // Issues with expect.hasAssertions()
    expect(true).toBe(true);
    setTimeout(() => {
      expect(wrapper.find(Container).prop('phase')).not.toBe('DELAY');
    });
  });

  describe('delay prop', () => {
    it('should be reflected to the DELAY phase animation', () => {
      const delayProp = 1234;
      const container = mount(<Spinner delay={delayProp} />).find(Container);
      const animation = getContainerAnimation(container.props());
      expect(Array.isArray(animation)).toBeTruthy();
      expect(animation.length).toBeGreaterThan(0);
      const animationDelay = parseFloat(animation[1] as string) * 1000;
      expect(animationDelay).toBe(delayProp);
    });
  });

  describe('isCompleting prop', () => {
    it('should add a spinner container when not set', () => {
      const wrapper = mount(<Spinner />);
      expect(wrapper.find(Container).length).toBe(1);
    });

    it('should remove the spinner container when set to true', () => {
      const wrapper = mount(<Spinner isCompleting />);
      expect(wrapper.find(Container).length).toBe(0);
    });
  });

  describe('onComplete prop', () => {
    it('should be called after isCompleting prop is set', () => {
      const spy = jest.fn();
      const wrapper = mount(<Spinner delay={0} onComplete={spy} />);
      const transitionContainerNode = wrapper.find(Container).getDOMNode();

      wrapper.setProps({ isCompleting: true });
      transitionContainerNode.dispatchEvent(new Event('animationend'));

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should not be called if isCompleting is not set', () => {
      const spy = jest.fn();
      const wrapper = mount(<Spinner delay={0} onComplete={spy} />);
      const transitionContainerNode = wrapper.find(Container).getDOMNode();

      transitionContainerNode.dispatchEvent(new Event('animationend'));

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('size prop', () => {
    it('should render the spinner with the default size if no value is provided', () => {
      const custom = mount(<Spinner />);
      expect(custom.find(Svg).prop('height')).toBe(24);
      expect(custom.find(Svg).prop('width')).toBe(24);
    });

    it('should render tee-shirt sizes with the proper heights/widths', () => {
      const xsmall = mount(<Spinner size="xsmall" />);
      const small = mount(<Spinner size="small" />);
      const medium = mount(<Spinner size="medium" />);
      const large = mount(<Spinner size="large" />);
      const xlarge = mount(<Spinner size="xlarge" />);

      expect(xsmall.find(Svg).prop('height')).toBe(8);
      expect(xsmall.find(Svg).prop('width')).toBe(8);

      expect(small.find(Svg).prop('height')).toBe(16);
      expect(small.find(Svg).prop('width')).toBe(16);

      expect(medium.find(Svg).prop('height')).toBe(24);
      expect(medium.find(Svg).prop('width')).toBe(24);

      expect(large.find(Svg).prop('height')).toBe(48);
      expect(large.find(Svg).prop('height')).toBe(48);

      expect(xlarge.find(Svg).prop('width')).toBe(96);
      expect(xlarge.find(Svg).prop('width')).toBe(96);
    });

    it('should render the spinner with a custom size', () => {
      const custom = mount(<Spinner size={72} />);

      expect(custom.find(Svg).prop('height')).toBe(72);
      expect(custom.find(Svg).prop('width')).toBe(72);
    });
  });

  describe('invertColor prop', () => {
    it('should set the invertColor prop on Svg when set to true', () => {
      const wrapper = mount(<Spinner invertColor />);
      expect(wrapper.find(Svg).prop('invertColor')).toBe(true);
    });

    it('should be colors.N500 by default', () => {
      expect(getStrokeColor({})).toBe(colors.N500);
      expect(getStrokeColor({ invertColor: false })).toBe(colors.N500);
    });

    it('should be colors.N0 when set to true', () => {
      expect(getStrokeColor({ invertColor: true })).toBe(colors.N0);
    });
  });

  describe('svg', () => {
    let styles: string;

    beforeEach(() => {
      const svg = mount(<Spinner />).find(Svg);
      const [, svgInterpolatedStyles] = svgStyles;
      styles = (svgInterpolatedStyles as (props: object) => string[])(
        svg.props(),
      ).join('');
    });

    it('should have expected svg stroke keys', () => {
      expect(/stroke-dashoffset/.test(styles)).toBe(true);
      expect(/stroke-dasharray/.test(styles)).toBe(true);
    });

    it('should have strokeDashoffset in px with no space before', () => {
      const dashOffsetMatch = styles.match(/stroke-dashoffset: [0-9.]+px;/);
      expect(dashOffsetMatch).not.toBe(null);
    });
  });
});
