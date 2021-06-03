import React from 'react';

import { render, shallow } from 'enzyme';

import SkeletonContainerView from '../../index';

describe('SkeletonContainerView', () => {
  it('should return null if the component was called without a type', () => {
    const wrapper = shallow(<SkeletonContainerView />);
    expect(wrapper.html()).toBe(null);
  });

  it('should return product if it receives type as `product`', () => {
    const wrapper = shallow(<SkeletonContainerView type="product" />);
    expect(wrapper.find('ProductNavigationTheme')).toHaveLength(1);
  });

  it('should return container if it receives type as `container`', () => {
    const wrapper = shallow(<SkeletonContainerView type="container" />);
    expect(wrapper.find('ContainerNavigationTheme')).toHaveLength(1);
  });

  ['product', 'container'].forEach((type) => {
    it(`should apply a default dataset to the container element when given a ${type} type and dataset is not provided`, () => {
      const wrapper = render(<SkeletonContainerView type={type} />);
      expect(wrapper.data()).toEqual({
        testid: 'ContextualNavigationSkeleton',
      });
    });

    it(`should apply a custom dataset to the container element when given a ${type} type and dataset is provided`, () => {
      const wrapper = render(
        <SkeletonContainerView
          dataset={{ 'data-foo': 'foo', 'data-bar': 'bar' }}
          type={type}
        />,
      );
      expect(wrapper.data()).toEqual({
        foo: 'foo',
        bar: 'bar',
      });
    });
  });
});
