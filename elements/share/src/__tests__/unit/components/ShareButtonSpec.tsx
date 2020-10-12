import Button from '@atlaskit/button/custom-theme-button';

import React from 'react';
import { shallow, mount, ReactWrapper, ShallowWrapper } from 'enzyme';

import ShareButton, { Props } from '../../../components/ShareButton';

const noop: any = () => {};

describe('ShareButton', () => {
  describe('default', () => {
    it('should render a Button with a ShareIcon', () => {
      const wrapper: ShallowWrapper<Props> = shallow(
        <ShareButton onClick={noop} />,
      );
      expect(wrapper.find(Button).length).toBe(1);
    });

    it('should proxy appearance, isSelected and isDisable props into Button component', () => {
      const propsToBeProxied: Partial<Props> = {
        appearance: 'primary',
        iconBefore: 'iconBefore',
        isSelected: false,
        isDisabled: false,
      };
      const wrapper: ShallowWrapper<Props> = shallow(
        <ShareButton {...propsToBeProxied} onClick={noop} />,
      );
      let buttonProps: any = wrapper.find(Button).props();

      expect(buttonProps).toMatchObject(propsToBeProxied);
      expect(wrapper.find(Button).prop('aria-expanded')).toEqual(false);

      const newPropsToBeProxied: any = {
        appearance: 'warning',
        iconBefore: 'newIconBefore',
        isSelected: !propsToBeProxied.isSelected,
        isDisabled: !propsToBeProxied.isDisabled,
      };
      wrapper.setProps(newPropsToBeProxied);
      buttonProps = wrapper.find(Button).props();

      expect(buttonProps).toMatchObject(newPropsToBeProxied);
      expect(wrapper.find(Button).prop('aria-expanded')).toEqual(true);
    });
  });

  describe('text prop', () => {
    it('should be rendered if given', () => {
      const wrapper: ShallowWrapper<Props> = shallow(
        <ShareButton text="Share" onClick={noop} />,
      );
      expect(wrapper.find(Button).text()).toEqual('Share');
    });

    it('should not render any text if text prop is not given', () => {
      const wrapper: ShallowWrapper<Props> = shallow(
        <ShareButton onClick={noop} />,
      );
      expect(wrapper.find(Button).text()).toEqual('');
    });
  });

  describe('onClick prop', () => {
    it('should be called when the button is clicked', () => {
      const spiedOnClick: jest.Mock = jest.fn();
      const wrapper: ReactWrapper<Props, {}, any> = mount(
        <ShareButton onClick={spiedOnClick} />,
      );
      wrapper.find(Button).simulate('click');
      expect(spiedOnClick).toHaveBeenCalledTimes(1);
    });
  });
});
