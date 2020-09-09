import React from 'react';

import { mount } from 'enzyme';

import { light } from '../../../../../theme';
import {
  ContainerNavigation,
  ContainerNavigationMask,
  ProductNavigation,
} from '../../primitives';

describe('ContentNavigation primitives', () => {
  describe('ContainerNavigationMask', () => {
    it('should render correctly with default props', () => {
      const wrapper = mount(<ContainerNavigationMask />);

      expect(wrapper).toMatchSnapshot();
    });

    it('should set pointerEvents to none when interaction is disabled', () => {
      const wrapper = mount(<ContainerNavigationMask disableInteraction />);

      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('ContainerNavigation', () => {
    let defaultProps;
    beforeEach(() => {
      defaultProps = {
        isEntering: false,
        isExiting: false,
        isVisible: true,
      };
    });

    it('should ALWAYS use the `light` theme', () => {
      const wrapper = mount(
        <ContainerNavigation {...defaultProps}>
          <p>This is a text</p>
        </ContainerNavigation>,
      );

      expect(wrapper.find('ThemeProvider').props().theme).toMatchObject({
        mode: light,
      });
    });

    it('should ALWAYS use the `container` context', () => {
      const wrapper = mount(
        <ContainerNavigation {...defaultProps}>
          <p>This is a text</p>
        </ContainerNavigation>,
      );

      expect(wrapper.find('ThemeProvider').props().theme.context).toBe(
        'container',
      );
    });

    it('should have scrollable effect', () => {
      const wrapper = mount(
        <ContainerNavigation {...defaultProps}>
          <p>This is a text</p>
        </ContainerNavigation>,
      );

      expect(wrapper.find('ScrollProvider').length).toBe(1);
    });

    it('should render the received children', () => {
      const wrapper = mount(
        <ContainerNavigation {...defaultProps}>
          <p>This is a text</p>
        </ContainerNavigation>,
      );

      expect(wrapper.text()).toBe('This is a text');
    });
  });

  describe('ProductNavigation', () => {
    it('should use the `light` theme if another theme was not provided', () => {
      const wrapper = mount(
        <ProductNavigation isVisible>
          <p>This is a text</p>
        </ProductNavigation>,
      );

      expect(wrapper.find('ThemeProvider').props().theme()).toMatchObject({
        mode: light,
      });
    });

    it('should ALWAYS use the `product` context', () => {
      const wrapper = mount(
        <ProductNavigation isVisible>
          <p>This is a text</p>
        </ProductNavigation>,
      );

      expect(wrapper.find('ThemeProvider').props().theme().context).toBe(
        'product',
      );
    });

    it('should have scrollable effect', () => {
      const wrapper = mount(
        <ProductNavigation isVisible>
          <p>This is a text</p>
        </ProductNavigation>,
      );

      expect(wrapper.find('ScrollProvider').length).toBe(1);
    });

    it('should render the received children', () => {
      const wrapper = mount(
        <ProductNavigation isVisible>
          <p>This is a text</p>
        </ProductNavigation>,
      );

      expect(wrapper.text()).toBe('This is a text');
    });
  });
});
