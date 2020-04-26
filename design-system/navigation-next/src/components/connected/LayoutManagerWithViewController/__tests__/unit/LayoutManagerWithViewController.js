import React from 'react';

import { mount, shallow } from 'enzyme';

import { NavigationProvider } from '../../../../../index';
import ItemsRenderer from '../../../../../renderer';
import SkeletonContainerView from '../../../../presentational/SkeletonContainerView';
import AsyncLayoutManagerWithViewController from '../../../AsyncLayoutManagerWithViewController';
import LayoutManagerWithViewController from '../../LayoutManagerWithViewController';

const GlobalNavigationComponent = () => null;

describe('LayoutManagerWithViewController', () => {
  let defaultProps;

  beforeEach(() => {
    jest.clearAllMocks();
    defaultProps = {
      customComponents: { Foo: () => null },
      globalNavigation: GlobalNavigationComponent,
      experimental_flyoutOnHover: false,
      experimental_hideNavVisuallyOnCollapse: false,
      firstSkeletonToRender: 'product',
      onCollapseStart: jest.fn(),
      onCollapseEnd: jest.fn(),
      onExpandStart: jest.fn(),
      onExpandEnd: jest.fn(),
      getRefs: jest.fn(),
    };
  });

  it('should render AsyncLayoutManagerWithViewController', () => {
    const wrapper = mount(
      <NavigationProvider cache={false} isDebugEnabled={false}>
        <LayoutManagerWithViewController
          globalNavigation={GlobalNavigationComponent}
          firstSkeletonToRender="product"
          {...defaultProps}
        >
          <div />
        </LayoutManagerWithViewController>
      </NavigationProvider>,
    );
    const asyncLayoutManager = wrapper.find(
      AsyncLayoutManagerWithViewController,
    );
    expect(asyncLayoutManager).toHaveLength(1);
  });

  it('should pass down props to AsyncLayoutManagerWithViewController', () => {
    const child = <div />;
    const wrapper = mount(
      <NavigationProvider cache={false} isDebugEnabled={false}>
        <LayoutManagerWithViewController {...defaultProps}>
          {child}
        </LayoutManagerWithViewController>
      </NavigationProvider>,
    );
    const asyncLayoutManager = wrapper.find(
      AsyncLayoutManagerWithViewController,
    );
    expect(asyncLayoutManager.props()).toMatchObject({
      children: child,
      ...defaultProps,
    });
  });

  it('should inject `itemsRenderer` and `containerSkeleton` props into AsyncLayoutManagerWithViewController', () => {
    const wrapper = mount(
      <NavigationProvider cache={false} isDebugEnabled={false}>
        <LayoutManagerWithViewController {...defaultProps}>
          <div />
        </LayoutManagerWithViewController>
      </NavigationProvider>,
    );
    const asyncLayoutManager = wrapper.find(
      AsyncLayoutManagerWithViewController,
    );
    expect(asyncLayoutManager.props()).toMatchObject({
      containerSkeleton: expect.any(Function),
      itemsRenderer: ItemsRenderer,
    });
  });

  it('`containerSkeleton` prop passed down to Async should render a skeleton container view if `firstSkeletonToRender` prop is set', () => {
    const wrapper = mount(
      <NavigationProvider cache={false} isDebugEnabled={false}>
        <LayoutManagerWithViewController
          {...defaultProps}
          firstSkeletonToRender="product"
        >
          <div />
        </LayoutManagerWithViewController>
      </NavigationProvider>,
    );
    const asyncLayoutManager = wrapper.find(
      AsyncLayoutManagerWithViewController,
    );
    const ContainerSkeleton = asyncLayoutManager.prop('containerSkeleton');

    const containerSkeletonEl = shallow(<ContainerSkeleton />);

    expect(containerSkeletonEl.find(SkeletonContainerView)).toHaveLength(1);
    expect(containerSkeletonEl.find(SkeletonContainerView).props()).toEqual({
      dataset: {
        'data-testid': 'ContextualNavigationSkeleton',
      },
      type: 'product',
    });
  });

  it('`containerSkeleton` prop passed down to Async should not render anything if `firstSkeletonToRender` prop is not set', () => {
    const wrapper = mount(
      <NavigationProvider cache={false} isDebugEnabled={false}>
        <LayoutManagerWithViewController
          {...defaultProps}
          firstSkeletonToRender={undefined}
        >
          <div />
        </LayoutManagerWithViewController>
      </NavigationProvider>,
    );
    const asyncLayoutManager = wrapper.find(
      AsyncLayoutManagerWithViewController,
    );
    const ContainerSkeleton = asyncLayoutManager.prop('containerSkeleton');

    const containerSkeletonEl = shallow(<ContainerSkeleton />);
    expect(containerSkeletonEl.children()).toHaveLength(0);
  });
});
