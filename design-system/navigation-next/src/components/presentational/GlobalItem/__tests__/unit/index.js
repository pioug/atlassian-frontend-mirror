import React from 'react';

import { mount, shallow } from 'enzyme';

import { AtlassianIcon } from '@atlaskit/logo';

import InteractionStateManager from '../../../InteractionStateManager';
import GlobalItem, { GlobalItemBase } from '../../index';
import GlobalItemPrimitive from '../../primitives';

const theme = {
  mode: {
    globalItem: jest.fn(({ size }) => ({
      itemBase: {},
      badgeWrapper: {},
      itemWrapper: {
        marginTop: size === 'large' ? 10 : 0,
      },
    })),
  },
};

describe('GlobalItem', () => {
  let defaultProps;
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();

    defaultProps = {
      createAnalyticsEvent: () => ({}),
      theme,
    };
  });

  it('should render correctly', () => {
    const wrapper = mount(<GlobalItem icon={() => <AtlassianIcon />} />);

    expect(wrapper).toMatchSnapshot();
  });

  it('should wrap GlobalItemBase using withGlobalTheme HOC', () => {
    const WrappedWithGlobalTheme = () => null;
    const mockWithGlobalTheme = jest.fn(() => WrappedWithGlobalTheme);
    jest.doMock('../../../../../theme', () => ({
      withGlobalTheme: mockWithGlobalTheme,
      styleReducerNoOp: jest.fn((styles) => styles),
    }));

    const { GlobalItemBase: RecentGlobalItemBase } = require('../../index');
    expect(mockWithGlobalTheme).toHaveBeenCalledWith(RecentGlobalItemBase);
  });

  it('should wrap GlobalItemBase using navigationItemClicked HOC', () => {
    const WrappedWithGlobalTheme = () => null;
    const mockWithGlobalTheme = jest.fn(() => WrappedWithGlobalTheme);
    jest.doMock('../../../../../theme', () => ({
      withGlobalTheme: mockWithGlobalTheme,
      styleReducerNoOp: jest.fn((styles) => styles),
    }));

    const WrappedWithNavigationItemClicked = () => null;
    const MockNavigationItemClicked = jest.fn(
      () => WrappedWithNavigationItemClicked,
    );
    jest.doMock('../../../../../common/analytics', () => ({
      navigationItemClicked: MockNavigationItemClicked,
    }));

    const { default: DefaultGlobalItem } = require('../../index');

    expect(MockNavigationItemClicked).toHaveBeenCalledWith(
      WrappedWithGlobalTheme,
      'globalItem',
      true,
    );
    expect(DefaultGlobalItem).toBe(WrappedWithNavigationItemClicked);
  });

  describe('GlobalItemBase', () => {
    it('should render an InteractionStateManager', () => {
      const wrapper = shallow(
        <GlobalItemBase {...defaultProps} icon={() => <AtlassianIcon />} />,
      );

      expect(wrapper.find(InteractionStateManager)).toHaveLength(1);

      expect(wrapper).toMatchSnapshot();
    });

    it('should render the GlobalItem primitive', () => {
      const wrapper = shallow(
        <GlobalItemBase {...defaultProps} icon={() => <AtlassianIcon />} />,
      );

      const renderChildren = wrapper.find(InteractionStateManager).dive();

      const primitive = renderChildren.find(GlobalItemPrimitive);

      expect(primitive).toHaveLength(1);
      expect(primitive).toMatchSnapshot();
    });

    it('should render an item wrapper with the globalItem.itemWrapper theme styles when size is large', () => {
      const largeItem = shallow(
        <GlobalItemBase
          {...defaultProps}
          icon={() => <AtlassianIcon />}
          size="large"
        />,
      );

      expect(theme.mode.globalItem).toHaveBeenCalledWith({ size: 'large' });
      expect(largeItem).toMatchSnapshot('largeItem');
    });

    it('should render an item wrapper with the globalItem.itemWrapper theme styles when size is small', () => {
      const smallItem = shallow(
        <GlobalItemBase
          {...defaultProps}
          icon={() => <AtlassianIcon />}
          size="small"
        />,
      );

      expect(theme.mode.globalItem).toHaveBeenCalledWith({ size: 'small' });
      expect(smallItem).toMatchSnapshot('smallItem');
    });
  });
});
