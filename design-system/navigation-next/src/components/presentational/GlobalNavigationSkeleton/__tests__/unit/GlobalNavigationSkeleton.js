import React from 'react';

import { render, shallow } from 'enzyme';

import { light } from '../../../../../theme';
import GlobalNavigationSkeleton from '../../GlobalNavigationSkeleton';
import GlobalNavigationSkeletonItem from '../../GlobalNavigationSkeletonItem';

describe('GlobalNavigationSkeleton', () => {
  const props = {
    theme: {
      mode: light,
      context: 'product',
    },
  };

  it('should add the skeleton items based on the defaults', () => {
    const wrapper = shallow(<GlobalNavigationSkeleton {...props} />);
    expect(wrapper.find(GlobalNavigationSkeletonItem)).toHaveLength(8);
  });

  it('should apply a default dataset to the container element when dataset is not provided', () => {
    expect(render(<GlobalNavigationSkeleton {...props} />).data()).toEqual({
      testid: 'GlobalNavigationSkeleton',
    });
  });

  it('should apply a custom dataset to the container element when dataset is provided', () => {
    expect(
      render(
        <GlobalNavigationSkeleton
          {...props}
          dataset={{ 'data-foo': 'foo', 'data-bar': 'bar' }}
        />,
      ).data(),
    ).toEqual({
      foo: 'foo',
      bar: 'bar',
    });
  });
});
