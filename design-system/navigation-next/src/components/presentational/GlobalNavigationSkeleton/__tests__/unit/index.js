import React from 'react';

import { mount } from 'enzyme';

import BaseGlobalNavigationSkeleton from '../../GlobalNavigationSkeleton';
import GlobalNavigationSkeleton from '../../index';

describe('GlobalNavigationSkeleton with theming', () => {
  it('should render a ThemeProvider with a BaseGlobalNavigationSkeleton', () => {
    const wrapper = mount(<GlobalNavigationSkeleton />);
    const themeProviderWrapper = wrapper.find('ThemeProvider');
    expect(
      themeProviderWrapper.find(BaseGlobalNavigationSkeleton),
    ).toHaveLength(1);
  });

  it('should pass a theme prop to ThemeProvider', () => {
    const wrapper = mount(<GlobalNavigationSkeleton />);
    const themeProviderWrapper = wrapper.find('ThemeProvider');
    expect(themeProviderWrapper.props()).toHaveProperty('theme');
  });

  it('should pass navigation-next theme to BaseGlobalNavigationSkeleton', () => {
    const wrapper = mount(<GlobalNavigationSkeleton />);
    expect(wrapper.find(BaseGlobalNavigationSkeleton).prop('theme')).toEqual(
      expect.objectContaining({
        context: 'product',
        mode: expect.objectContaining({
          contentNav: expect.any(Function),
          globalItem: expect.any(Function),
          globalNav: expect.any(Function),
          heading: expect.any(Function),
          item: expect.any(Function),
          section: expect.any(Function),
          separator: expect.any(Function),
          skeletonItem: expect.any(Function),
        }),
      }),
    );
  });
});
