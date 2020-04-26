import React from 'react';

import { mount, shallow } from 'enzyme';

import ArrowRightCircleIcon from '@atlaskit/icon/glyph/arrow-right-circle';
import Spinner from '@atlaskit/spinner';

import ConnectedItem from '../../../ConnectedItem';
import { GoToItemBase } from '../../index';

describe('GoToItemBase', () => {
  let baseProps;
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    const mockNavigationViewController = {
      state: {},
      setView: jest.fn(),
    };
    baseProps = {
      navigationViewController: mockNavigationViewController,
    };
  });

  it('should render a ConnectedItem', () => {
    const wrapper = mount(
      <GoToItemBase
        {...baseProps}
        goTo="another-view"
        id="another-view-item"
        text="Another View"
      />,
    );

    expect(wrapper.find(ConnectedItem)).toHaveLength(1);
    expect(wrapper).toMatchSnapshot();
  });
  describe('Default After prop', () => {
    it('should be provided to ConnectedItem if one is not provided to GoTo item', () => {
      const wrapper = mount(
        <GoToItemBase
          {...baseProps}
          goTo="another-view"
          id="another-view-item"
          text="Another View"
        />,
      );

      const AfterComp = wrapper.find(ConnectedItem).prop('after');
      expect(AfterComp).toEqual(expect.any(Function));
    });

    it('should only show on hover or active or focus', () => {
      const wrapper = mount(
        <GoToItemBase
          {...baseProps}
          goTo="another-view"
          id="another-view-item"
          text="Another View"
        />,
      );

      const AfterComp = wrapper.find(ConnectedItem).prop('after');

      const afterEl = shallow(<AfterComp />);
      expect(afterEl.children()).toHaveLength(0);

      afterEl.setProps({ isHover: true });
      expect(afterEl.find(ArrowRightCircleIcon)).toHaveLength(1);
      expect(afterEl).toMatchSnapshot();

      afterEl.setProps({ isFocused: false, isHover: false, isActive: true });
      expect(afterEl.find(ArrowRightCircleIcon)).toHaveLength(1);

      afterEl.setProps({ isFocused: true, isHover: false, isActive: false });
      expect(afterEl.find(ArrowRightCircleIcon)).toHaveLength(1);

      afterEl.setProps({ isFocused: false, isHover: false, isActive: false });
      expect(afterEl.find(ArrowRightCircleIcon)).toHaveLength(0);
    });

    it("should show a spinner if the incoming view equals the 'goTo' prop of GoToItem", () => {
      baseProps.navigationViewController.state.incomingView = {
        id: 'another-view',
      };
      const wrapper = mount(
        <GoToItemBase
          {...baseProps}
          goTo="another-view"
          id="another-view-item"
          text="Another View"
        />,
      );

      expect(wrapper.find(Spinner)).toHaveLength(1);
      expect(wrapper.find(Spinner)).toMatchSnapshot();
    });

    it('should set the spinner delay to the spinnerDelay prop if it exists', () => {
      baseProps.navigationViewController.state.incomingView = {
        id: 'another-view',
      };
      const wrapper = mount(
        <GoToItemBase
          {...baseProps}
          goTo="another-view"
          id="another-view-item"
          text="Another View"
          spinnerDelay={500}
        />,
      );

      expect(wrapper.find(Spinner).prop('delay')).toBe(500);
    });

    it('should be replaced by after prop of GoToItem if passed in', () => {
      const MyAfterComp = () => <span>...</span>;
      const wrapper = mount(
        <GoToItemBase
          {...baseProps}
          after={MyAfterComp}
          goTo="another-view"
          id="another-view-item"
          text="Another View"
        />,
      );

      expect(wrapper.find(ConnectedItem).prop('after')).toEqual(MyAfterComp);
    });
  });
});

describe('GoToItem', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('should be wrapped with withNavigationViewController HOC', () => {
    const mockWithNavigationViewController = jest.fn(() => () => null);
    jest.doMock('../../../../../view-controller', () => ({
      withNavigationViewController: mockWithNavigationViewController,
    }));
    const { GoToItemBase: RequiredGoToItemBase } = require('../../index');

    expect(mockWithNavigationViewController).toHaveBeenLastCalledWith(
      RequiredGoToItemBase,
    );
  });
});
