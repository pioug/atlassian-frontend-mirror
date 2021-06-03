import React from 'react';

import { mount } from 'enzyme';

import { NavigationProvider } from '../../../../../index';
import AsyncLayoutManagerWithViewController from '../../AsyncLayoutManagerWithViewController';

const GlobalNavigationComponent = () => null;
const SkeletonContainerView = () => null;
const ItemsRenderer = () => null;

describe('AsyncLayoutManagerWithViewController', () => {
  let wrapper;

  let onCollapseStart;
  let onCollapseEnd;
  let onExpandStart;
  let onExpandEnd;
  let getRefs;

  const createAsyncLayoutManager = (props) => (
    <NavigationProvider cache={false} isDebugEnabled={false}>
      <AsyncLayoutManagerWithViewController
        containerSkeleton={SkeletonContainerView}
        firstSkeletonToRender="product"
        globalNavigation={GlobalNavigationComponent}
        itemsRenderer={ItemsRenderer}
        {...props}
      >
        <p>
          Children requires to have `NavigationProvider` as a parent Because of
          `unstated`. This is an issue
        </p>
      </AsyncLayoutManagerWithViewController>
    </NavigationProvider>
  );

  beforeEach(() => {
    onCollapseStart = jest.fn();
    onCollapseEnd = jest.fn();
    onExpandStart = jest.fn();
    onExpandEnd = jest.fn();
    getRefs = jest.fn();

    wrapper = mount(
      createAsyncLayoutManager({
        getRefs,
        onCollapseEnd,
        onCollapseStart,
        onExpandEnd,
        onExpandStart,
      }),
    );
  });

  afterEach(() => {
    onCollapseStart.mockReset();
    onCollapseEnd.mockReset();
    onExpandStart.mockReset();
    onExpandEnd.mockReset();
    getRefs.mockReset();
  });

  it('should render global navigation based on using `globalNavigation` as a reference', () => {
    expect(wrapper.find(GlobalNavigationComponent).length).toBe(1);
  });

  describe('LayerInitialised', () => {
    it('should be initialised when `onInitialised` method is called', () => {
      const layerInitialised = wrapper.find('LayerInitialised');

      expect(layerInitialised.props().initialised).toBe(false);

      layerInitialised.props().onInitialised();
      // Enzyme only lets you set prop on the root
      // The root in this case is NavigationProvider
      // instead of AsyncLayoutManagerWithViewController as explained
      // in the comment above.
      wrapper.setProps({
        children: (
          //$FlowFixMe
          <AsyncLayoutManagerWithViewController
            globalNavigation={GlobalNavigationComponent}
            firstSkeletonToRender="product"
            onCollapseStart={onCollapseStart}
            onCollapseEnd={onCollapseEnd}
            onExpandStart={onExpandStart}
            onExpandEnd={onExpandEnd}
            containerSkeleton={SkeletonContainerView}
            itemsRenderer={ItemsRenderer}
            getRefs={getRefs}
            view="some-view"
          >
            <p>
              Children requires to have `NavigationProvider` as a parent Because
              of `unstated`. This is an issue
            </p>
          </AsyncLayoutManagerWithViewController>
        ),
      });
      wrapper.update();

      expect(wrapper.find('LayerInitialised').props().initialised).toBe(true);
    });
  });

  describe('Skeleton management', () => {
    it('should render skeleton using `product` context', () => {
      expect(
        wrapper.find(AsyncLayoutManagerWithViewController).props()
          .firstSkeletonToRender,
      ).toBe('product');

      expect(wrapper.find('SkeletonContainerView').props().type).toEqual(
        'product',
      );
    });

    it('should render skeleton using `container` context', () => {
      const containerWrapper = mount(
        createAsyncLayoutManager({ firstSkeletonToRender: 'container' }),
      );

      expect(
        containerWrapper.find(AsyncLayoutManagerWithViewController).props()
          .firstSkeletonToRender,
      ).toBe('container');

      expect(
        containerWrapper.find('SkeletonContainerView').first().props().type,
      ).toEqual('container');
    });
  });

  describe('Passing props to LayoutManager', () => {
    it('should pass expand/collapse listeners and getRefs', () => {
      const layoutManager = wrapper.find('LayoutManager');

      onCollapseStart(200);
      onCollapseEnd(0);
      onExpandStart(0);
      onExpandEnd(200);

      expect(layoutManager.props().onCollapseStart).toBeCalledWith(200);
      expect(layoutManager.props().onCollapseEnd).toBeCalledWith(0);
      expect(layoutManager.props().onExpandStart).toBeCalledWith(0);
      expect(layoutManager.props().onExpandEnd).toBeCalledWith(200);
      expect(layoutManager.props().getRefs).toHaveBeenCalled();
    });
  });

  it('should forward experimental_horizontalGlobalNav as false to LayoutManager by default', () => {
    const asyncLayoutManager = mount(createAsyncLayoutManager());
    const layoutManager = asyncLayoutManager.find('LayoutManager');
    expect(layoutManager.props().experimental_horizontalGlobalNav).toBe(false);
  });

  it('should forward a true experimental_horizontalGlobalNav to LayoutManager', () => {
    const asyncLayoutManager = mount(
      createAsyncLayoutManager({ experimental_horizontalGlobalNav: true }),
    );
    const layoutManager = asyncLayoutManager.find('LayoutManager');
    expect(layoutManager.props().experimental_horizontalGlobalNav).toBe(true);
  });

  it('should forward a false experimental_horizontalGlobalNav to LayoutManager', () => {
    const asyncLayoutManager = mount(
      createAsyncLayoutManager({ experimental_horizontalGlobalNav: false }),
    );
    const layoutManager = asyncLayoutManager.find('LayoutManager');
    expect(layoutManager.props().experimental_horizontalGlobalNav).toBe(false);
  });
});
