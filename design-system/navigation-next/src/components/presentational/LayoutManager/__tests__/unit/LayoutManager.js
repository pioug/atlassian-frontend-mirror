import React, { Component } from 'react';

import { mount, render, shallow } from 'enzyme';

import { NavigationAnalyticsContext } from '@atlaskit/analytics-namespaced-context';

import {
  GLOBAL_NAV_WIDTH,
  HORIZONTAL_GLOBAL_NAV_HEIGHT,
} from '../../../../../common/constants';
import ContentNavigation from '../../../ContentNavigation';
import { ContainerNavigationMask } from '../../../ContentNavigation/primitives';
import ResizeTransition from '../../../ResizeTransition';
import { LayoutEventListener } from '../../LayoutEvent';
import LayoutManager from '../../LayoutManager';
import { ComposedGlobalNavigation } from '../../nav-components';
import {
  HorizontalNavigationContainer,
  NavigationContainer,
} from '../../primitives';
import ResizeControl from '../../ResizeControl';

const packageName = process.env._PACKAGE_NAME_;

describe('LayoutManager', () => {
  let defaultProps;
  let mockNavigationUIController;
  const pageContentSelector = '[data-testid="Content"]';

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    mockNavigationUIController = {
      expand: Function.prototype,
      state: {
        isCollapsed: false,
      },
    };
    defaultProps = {
      navigationUIController: mockNavigationUIController,
      globalNavigation: () => null,
      productNavigation: () => null,
      containerNavigation: null,
      children: <div>Page content</div>,
      experimental_flyoutOnHover: false,
      experimental_alternateFlyoutBehaviour: false,
      experimental_fullWidthFlyout: false,
      collapseToggleTooltipContent: () => ({ text: 'Expand', char: '[' }),
    };
  });
  // TODO: Please update this test, it should be deterministic,
  // make sure your generated snapshots do not include platform specific or other non-deterministic data. In this case, the packageVersion.
  // eslint-disable-next-line
  it.skip('should render correctly', () => {
    const wrapper = shallow(<LayoutManager {...defaultProps} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should apply a default dataset to the content when datasets is not provided', () => {
    expect(
      render(<LayoutManager {...defaultProps} />)
        .find('[data-testid="Content"]')
        .data(),
    ).toEqual({
      testid: 'Content',
    });
  });

  it('should apply a default dataset to the navigation container when datasets is not provided', () => {
    expect(
      render(<LayoutManager {...defaultProps} />)
        .find('[data-testid="Navigation"]')
        .data(),
    ).toEqual({
      testid: 'Navigation',
    });
  });

  it('should apply a default dataset to the global navigation container when datasets is not provided', () => {
    expect(
      render(<LayoutManager {...defaultProps} />)
        .find('[data-testid="GlobalNavigation"]')
        .data(),
    ).toEqual({
      testid: 'GlobalNavigation',
    });
  });

  it('should apply a default dataset to the contextual navigation container element when datasets is not provided', () => {
    expect(
      render(<LayoutManager {...defaultProps} />)
        .find('[data-testid="ContextualNavigation"]')
        .data(),
    ).toEqual({
      testid: 'ContextualNavigation',
    });
  });

  it('should apply a custom dataset to the content when datasets is provided', () => {
    expect(
      render(
        <LayoutManager
          {...defaultProps}
          datasets={{
            content: {
              'data-content': '',
            },
            contextualNavigation: {},
            globalNavigation: {},
            navigation: {},
          }}
        />,
      )
        .find('[data-content]')
        .data(),
    ).toEqual({
      content: '',
    });
  });

  it('should apply a custom dataset to the navigation container when datasets is provided', () => {
    expect(
      render(
        <LayoutManager
          {...defaultProps}
          datasets={{
            content: {},
            contextualNavigation: {},
            globalNavigation: { 'data-navigation': '' },
            navigation: {},
          }}
        />,
      )
        .find('[data-navigation]')
        .data(),
    ).toEqual({
      navigation: '',
    });
  });

  it('should apply a custom dataset to the global navigation container when datasets is provided', () => {
    expect(
      render(
        <LayoutManager
          {...defaultProps}
          datasets={{
            content: {},
            contextualNavigation: {},
            globalNavigation: { 'data-global-navigation': '' },
            navigation: {},
          }}
        />,
      )
        .find('[data-global-navigation]')
        .data(),
    ).toEqual({
      globalNavigation: '',
    });
  });

  it('should apply a custom dataset to the contextual navigation container when datasets is provided', () => {
    expect(
      render(
        <LayoutManager
          {...defaultProps}
          datasets={{
            content: {},
            contextualNavigation: { 'data-contextual-navigation': '' },
            globalNavigation: {},
            navigation: {},
          }}
        />,
      )
        .find('[data-contextual-navigation]')
        .data(),
    ).toEqual({
      contextualNavigation: '',
    });
  });

  const testHorizontalNavigationLayout = (layoutManager, topOffset) => {
    const composedGlobalNavigation = layoutManager.find(
      ComposedGlobalNavigation,
    );
    const horizontalNavigation = layoutManager.find(
      HorizontalNavigationContainer,
    );
    const navigationContainer = layoutManager.find(NavigationContainer);
    const pageContent = layoutManager.find(pageContentSelector);

    expect(composedGlobalNavigation.exists()).toBe(false);
    expect(horizontalNavigation.exists()).toBe(true);
    expect(navigationContainer.props().topOffset).toBe(
      Number.isInteger(topOffset)
        ? topOffset + HORIZONTAL_GLOBAL_NAV_HEIGHT
        : HORIZONTAL_GLOBAL_NAV_HEIGHT,
    );
    expect(pageContent).toHaveStyleDeclaration('margin-left', '0');
    expect(pageContent).toHaveStyleDeclaration(
      'margin-top',
      `${HORIZONTAL_GLOBAL_NAV_HEIGHT}px`,
    );
  };

  const testVerticalNavigationLayout = (layoutManager, topOffset) => {
    const composedGlobalNavigation = layoutManager.find(
      ComposedGlobalNavigation,
    );
    const horizontalNavigation = layoutManager.find(
      HorizontalNavigationContainer,
    );
    const navigationContainer = layoutManager.find(NavigationContainer);
    const pageContent = layoutManager.find(pageContentSelector);

    expect(composedGlobalNavigation.exists()).toBe(true);
    expect(horizontalNavigation.exists()).toBe(false);
    expect(navigationContainer.props().topOffset).toBe(
      Number.isInteger(topOffset) ? topOffset : 0,
    );
    expect(pageContent).toHaveStyleDeclaration(
      'margin-left',
      `${GLOBAL_NAV_WIDTH}px`,
    );
    expect(pageContent).toHaveStyleDeclaration('margin-top', '0');
  };

  it('should render the layout correctly by default', () => {
    const layoutManager = mount(<LayoutManager {...defaultProps} />);
    testVerticalNavigationLayout(layoutManager);
  });

  it('should render the layout correctly when experimental_horizontalGlobalNav is false', () => {
    const layoutManager = mount(
      <LayoutManager
        {...defaultProps}
        experimental_horizontalGlobalNav={false}
      />,
    );
    testVerticalNavigationLayout(layoutManager);
  });

  it('should render the layout correctly when experimental_horizontalGlobalNav is false and a topOffset is provided', () => {
    const layoutManager = mount(
      <LayoutManager
        {...defaultProps}
        experimental_horizontalGlobalNav={false}
        topOffset={50}
      />,
    );
    testVerticalNavigationLayout(layoutManager, 50);
  });

  it('should render the layout correctly when experimental_horizontalGlobalNav is true', () => {
    const layoutManager = mount(
      <LayoutManager {...defaultProps} experimental_horizontalGlobalNav />,
    );
    testHorizontalNavigationLayout(layoutManager);
  });

  it('should render the layout correctly when experimental_horizontalGlobalNav is true and a topOffset is provided', () => {
    const layoutManager = mount(
      <LayoutManager
        {...defaultProps}
        experimental_horizontalGlobalNav
        topOffset={50}
      />,
    );
    testHorizontalNavigationLayout(layoutManager, 50);
  });

  it('should correctly re-render the horizontal global navigation when the globalNavigation prop is updated', () => {
    let GlobalNavigation = () => <div>global navigation skeleton</div>;
    const layoutManager = mount(
      <LayoutManager
        {...defaultProps}
        experimental_horizontalGlobalNav
        globalNavigation={GlobalNavigation}
      />,
    );

    const prevHtml = layoutManager.find(GlobalNavigation).html();

    GlobalNavigation = () => <div>global navigation</div>;
    layoutManager.setProps({ globalNavigation: GlobalNavigation });

    const html = layoutManager.find(GlobalNavigation).html();

    expect({ html, prevHtml }).toEqual({
      html: '<div>global navigation</div>',
      prevHtml: '<div>global navigation skeleton</div>',
    });
  });

  it('should correctly re-render the horizontal global navigation when the global navigation is updated internally', () => {
    class GlobalNavigation extends Component {
      state = {
        loading: true,
      };

      timeoutId;

      componentDidMount() {
        this.timeoutId = setTimeout(() => {
          this.setState({ loading: false });
        });
      }

      componentWillUnmount() {
        clearTimeout(this.timeoutId);
      }

      render() {
        const { loading } = this.state;
        if (loading) {
          return <div>global navigation skeleton</div>;
        }

        return <div>global navigation</div>;
      }
    }

    const layoutManager = mount(
      <LayoutManager
        {...defaultProps}
        experimental_horizontalGlobalNav
        globalNavigation={GlobalNavigation}
      />,
    );

    const prevHtml = layoutManager.find(GlobalNavigation).html();
    jest.runAllTimers();
    const html = layoutManager.find(GlobalNavigation).html();

    expect({ html, prevHtml }).toEqual({
      html: '<div>global navigation</div>',
      prevHtml: '<div>global navigation skeleton</div>',
    });
  });

  describe('Flyout', () => {
    beforeEach(() => {
      defaultProps.experimental_flyoutOnHover = true;
      defaultProps.navigationUIController.state.isCollapsed = true;
    });

    describe('when experimental_flyoutOnHover is set and navigation is collapsed', () => {
      beforeEach(() => {
        jest.useFakeTimers();
      });
      afterEach(() => {
        jest.clearAllTimers();
      });

      it('should open when mousing over ContainerNavigationMask with a delay of 350ms', () => {
        const wrapper = mount(<LayoutManager {...defaultProps} />);
        expect(wrapper.state('flyoutIsOpen')).toBe(false);
        wrapper.find(ContainerNavigationMask).simulate('mouseover');

        jest.advanceTimersByTime(349);
        expect(wrapper.state('flyoutIsOpen')).toBe(false);

        jest.advanceTimersByTime(1);
        expect(wrapper.state('flyoutIsOpen')).toBe(true);
      });

      it('should not open when mousing out before 350ms', () => {
        const wrapper = mount(<LayoutManager {...defaultProps} />);
        expect(wrapper.state('flyoutIsOpen')).toBe(false);
        wrapper.find(ContainerNavigationMask).simulate('mouseover');

        jest.advanceTimersByTime(300);
        wrapper.find(NavigationContainer).simulate('mouseleave');
        expect(wrapper.state('flyoutIsOpen')).toBe(false);

        jest.runAllTimers();
        expect(wrapper.state('flyoutIsOpen')).toBe(false);
      });

      it('should close when mousing out of NavigationContainer', () => {
        const wrapper = mount(<LayoutManager {...defaultProps} />);

        wrapper.find(ContainerNavigationMask).simulate('mouseover');
        wrapper.find(NavigationContainer).simulate('mouseout');

        expect(wrapper.state('flyoutIsOpen')).toBe(false);
      });

      it('should display ContentNavigation when flyout is open', () => {
        const wrapper = mount(<LayoutManager {...defaultProps} />);

        wrapper.setState({ flyoutIsOpen: true });
        wrapper.update();
        expect(wrapper.find(ContentNavigation).prop('isVisible')).toBe(true);
      });

      it('should NOT display ContentNavigation when flyout is closed', () => {
        const wrapper = mount(<LayoutManager {...defaultProps} />);

        wrapper.setState({ flyoutIsOpen: false });
        wrapper.update();
        expect(wrapper.find(ContentNavigation).prop('isVisible')).toBe(false);
      });

      it('should NOT display resize hint bar', () => {
        const wrapper = mount(<LayoutManager {...defaultProps} />);

        const resizeBar = wrapper.find(
          'div[aria-label="Click to expand the navigation"]',
        );
        expect(resizeBar).toHaveLength(0);
      });

      it('should NOT be open when nav is permanently expanded', () => {
        const wrapper = mount(<LayoutManager {...defaultProps} />);

        wrapper.find(ContainerNavigationMask).simulate('mouseover');
        defaultProps.navigationUIController.state.isCollapsed = false;
        wrapper.setProps(defaultProps);

        expect(wrapper.state('flyoutIsOpen')).toBe(false);
      });

      it('should NOT listen to mouseOvers over ContainerNavigationMask if flyout is already open', () => {
        const wrapper = mount(<LayoutManager {...defaultProps} />);
        expect(
          wrapper.find(ContainerNavigationMask).prop('onMouseOver'),
        ).toEqual(expect.any(Function));
        wrapper.find(ContainerNavigationMask).simulate('mouseover');

        jest.advanceTimersByTime(349);
        wrapper.update();
        expect(
          wrapper.find(ContainerNavigationMask).prop('onMouseOver'),
        ).toEqual(expect.any(Function));

        jest.advanceTimersByTime(1);
        wrapper.update();
        expect(
          wrapper.find(ContainerNavigationMask).prop('onMouseOver'),
        ).toBeNull();
      });

      it('should NOT listen to mouseOuts of NavigationContainer if flyout is already closed', () => {
        const wrapper = mount(<LayoutManager {...defaultProps} />);

        wrapper.setState({ flyoutIsOpen: false });
        wrapper.update();
        expect(wrapper.find(NavigationContainer).prop('onMouseOut')).toBeNull();
      });

      describe('Expand/collapse callbacks', () => {
        let handlers;
        beforeEach(() => {
          handlers = {
            onExpandStart: jest.fn(),
            onExpandEnd: jest.fn(),
            onCollapseStart: jest.fn(),
            onCollapseEnd: jest.fn(),
          };
        });

        it('should NOT be called when flyout opens', () => {
          const wrapper = mount(
            <LayoutManager {...defaultProps} {...handlers} />,
          );

          wrapper.setState({ flyoutIsOpen: true });
          wrapper.update();
          jest.runAllTimers();

          Object.keys(handlers).forEach((propName) => {
            expect(handlers[propName]).not.toHaveBeenCalled();
          });
        });

        it('should NOT be called when flyout closes', () => {
          const wrapper = mount(
            <LayoutManager {...defaultProps} {...handlers} />,
          );

          wrapper.setState({ flyoutIsOpen: true });
          wrapper.update();
          jest.runAllTimers();

          wrapper.setState({ flyoutIsOpen: false });
          wrapper.update();
          jest.runAllTimers();

          Object.keys(handlers).forEach((propName) => {
            expect(handlers[propName]).not.toHaveBeenCalled();
          });
        });
      });

      describe('when experimental_alternateFlyoutBehaviour is set', () => {
        beforeEach(() => {
          defaultProps.experimental_alternateFlyoutBehaviour = true;
        });

        it('should open when mousing over NavigationContainer with a delay of 200ms', () => {
          const ProductNavigation = () => null;
          const wrapper = mount(
            <LayoutManager
              {...defaultProps}
              productNavigation={ProductNavigation}
            />,
          );
          expect(wrapper.state('flyoutIsOpen')).toBe(false);
          wrapper.find(NavigationContainer).simulate('mouseover');

          expect(wrapper.contains(ProductNavigation)).toBeTruthy();
          expect(wrapper.find('Outer').exists()).toBeTruthy();

          jest.advanceTimersByTime(199);
          expect(wrapper.state('flyoutIsOpen')).toBe(false);

          jest.advanceTimersByTime(1);
          expect(wrapper.state('flyoutIsOpen')).toBe(true);
        });

        it('should NOT open when mousing over GlobalNavigation with a delay of 200ms', () => {
          const Global = () => <div>Global</div>;
          const wrapper = mount(
            <LayoutManager {...defaultProps} globalNavigation={Global} />,
          );
          const instance = wrapper.instance();
          const spy = jest.spyOn(instance, 'closeFlyout');
          // to register the spy on the instance
          wrapper.setProps({});

          wrapper.find('Global').closest('div').simulate('mouseover');

          expect(spy).toHaveBeenCalled();
        });

        it('should NOT open when mousing over expand/collapse affordance with a delay of 200ms', () => {
          const wrapper = mount(<LayoutManager {...defaultProps} />);
          const instance = wrapper.instance();
          const spy = jest.spyOn(instance, 'closeFlyout');
          wrapper.setProps({});

          wrapper
            .find('Button')
            .parents('Tooltip')
            .findWhere(
              (el) =>
                el.name() === 'div' &&
                typeof el.prop('onMouseOver') === 'function',
            )
            .simulate('mouseover');

          expect(spy).toHaveBeenCalled();
        });

        it('should NOT close already expanded flyout when mousing over expand/collapse affordance', () => {
          const wrapper = mount(<LayoutManager {...defaultProps} />);
          expect(
            wrapper
              .find('Button')
              .parents('Tooltip')
              .closest('div')
              .prop('onMouseOver'),
          ).toBeInstanceOf(Function);

          wrapper.setState({ flyoutIsOpen: true });
          wrapper.update();

          expect(
            wrapper
              .find('Button')
              .parents('Tooltip')
              .closest('div')
              .prop('onMouseOver'),
          ).toBeNull();
        });

        it('should not open when mousing out before 200ms', () => {
          const wrapper = mount(<LayoutManager {...defaultProps} />);
          expect(wrapper.state('flyoutIsOpen')).toBe(false);
          wrapper.find(ContainerNavigationMask).simulate('mouseover');

          jest.advanceTimersByTime(100);
          wrapper.find(NavigationContainer).simulate('mouseleave');
          expect(wrapper.state('flyoutIsOpen')).toBe(false);

          jest.runAllTimers();
          expect(wrapper.state('flyoutIsOpen')).toBe(false);
        });

        it('should close when mousing out of NavigationContainer', () => {
          const wrapper = mount(<LayoutManager {...defaultProps} />);

          wrapper.find(ContainerNavigationMask).simulate('mouseover');
          wrapper.find(NavigationContainer).simulate('mouseout');

          expect(wrapper.state('flyoutIsOpen')).toBe(false);
        });

        it('should close when mousing over of GlobalNavigation', () => {
          const Global = () => <div>Global</div>;
          defaultProps.globalNavigation = Global;
          const wrapper = mount(<LayoutManager {...defaultProps} />);

          wrapper.find(ContainerNavigationMask).simulate('mouseover');
          wrapper.find('Global').closest('div').simulate('mouseover');

          expect(wrapper.state('flyoutIsOpen')).toBe(false);
        });

        it('should display ContentNavigation when flyout is open', () => {
          const wrapper = mount(<LayoutManager {...defaultProps} />);

          wrapper.setState({ flyoutIsOpen: true });
          wrapper.update();
          expect(wrapper.find(ContentNavigation).prop('isVisible')).toBe(true);
        });

        it('should NOT display ContentNavigation when flyout is closed', () => {
          const wrapper = mount(<LayoutManager {...defaultProps} />);

          wrapper.setState({ flyoutIsOpen: false });
          wrapper.update();
          expect(wrapper.find(ContentNavigation).prop('isVisible')).toBe(false);
        });

        it('should NOT display resize hint bar', () => {
          const wrapper = mount(<LayoutManager {...defaultProps} />);

          const resizeBar = wrapper.find(
            'div[aria-label="Click to expand the navigation"]',
          );
          expect(resizeBar).toHaveLength(0);
        });

        it('should NOT be open when nav is permanently expanded', () => {
          const wrapper = mount(<LayoutManager {...defaultProps} />);

          wrapper.find(ContainerNavigationMask).simulate('mouseover');
          defaultProps.navigationUIController.state.isCollapsed = false;
          wrapper.setProps(defaultProps);

          expect(wrapper.state('flyoutIsOpen')).toBe(false);
        });

        it('should NOT listen to mouseOvers over NavigationContainer if flyout is already open', () => {
          const wrapper = mount(<LayoutManager {...defaultProps} />);
          expect(wrapper.find(NavigationContainer).prop('onMouseOver')).toEqual(
            expect.any(Function),
          );
          wrapper.find(NavigationContainer).simulate('mouseover');

          jest.advanceTimersByTime(199);
          wrapper.update();
          expect(wrapper.find(NavigationContainer).prop('onMouseOver')).toEqual(
            expect.any(Function),
          );

          jest.advanceTimersByTime(1);
          wrapper.update();
          expect(
            wrapper.find(NavigationContainer).prop('onMouseOver'),
          ).toBeNull();
        });

        it('should NOT listen to mouseOuts of NavigationContainer if flyout is already closed', () => {
          const wrapper = mount(<LayoutManager {...defaultProps} />);

          wrapper.setState({ flyoutIsOpen: false });
          wrapper.update();
          expect(
            wrapper.find(NavigationContainer).prop('onMouseOut'),
          ).toBeNull();
        });
      });
    });

    describe('when experimental_flyoutOnHover experimental_alternateFlyoutBehaviour are not set', () => {
      beforeEach(() => {
        defaultProps.experimental_flyoutOnHover = false;
        defaultProps.experimental_alternateFlyoutBehaviour = false;
      });

      it('should NOT open NavigationContainer when mousing over ContainerNavigationMask', () => {
        const wrapper = mount(<LayoutManager {...defaultProps} />);
        expect(wrapper.state('flyoutIsOpen')).toBe(false);
        wrapper.find(ContainerNavigationMask).simulate('mouseover');
        expect(wrapper.state('flyoutIsOpen')).toBe(false);
      });

      it('should NOT cause a re-render when mousing out of NavigationContainer', () => {
        const wrapper = mount(<LayoutManager {...defaultProps} />);
        expect(wrapper.state('flyoutIsOpen')).toBe(false);
        wrapper.find(NavigationContainer).simulate('mouseover');

        expect(wrapper.state('flyoutIsOpen')).toBe(false);
      });
    });

    describe('when experimental_flyoutOnHover is not set and experimental_alternateFlyoutBehaviour is set', () => {
      beforeEach(() => {
        defaultProps.experimental_flyoutOnHover = false;
        defaultProps.experimental_alternateFlyoutBehaviour = true;
      });

      it('should NOT open NavigationContainer when mousing over ContainerNavigationMask', () => {
        const wrapper = mount(<LayoutManager {...defaultProps} />);
        expect(wrapper.state('flyoutIsOpen')).toBe(false);
        wrapper.find(ContainerNavigationMask).simulate('mouseover');
        expect(wrapper.state('flyoutIsOpen')).toBe(false);
      });

      it('should NOT cause a re-render when mousing out of NavigationContainer', () => {
        const wrapper = mount(<LayoutManager {...defaultProps} />);
        expect(wrapper.state('flyoutIsOpen')).toBe(false);
        wrapper.find(NavigationContainer).simulate('mouseover');

        expect(wrapper.state('flyoutIsOpen')).toBe(false);
      });
    });
    describe('when navigation is permanently expanded', () => {
      beforeEach(() => {
        defaultProps.navigationUIController.state.isCollapsed = false;
      });

      it('should NOT cause a re-render when mousing over ContainerNavigationMask', () => {
        const wrapper = mount(<LayoutManager {...defaultProps} />);
        expect(wrapper.state('flyoutIsOpen')).toBe(false);
        wrapper.find(ContainerNavigationMask).simulate('mouseover');
        expect(wrapper.state('flyoutIsOpen')).toBe(false);
      });

      it('should NOT cause a re-render when mousing out of NavigationContainer', () => {
        const wrapper = mount(<LayoutManager {...defaultProps} />);
        expect(wrapper.state('flyoutIsOpen')).toBe(false);
        wrapper.find(NavigationContainer).simulate('mouseover');
        expect(wrapper.state('flyoutIsOpen')).toBe(false);
      });
    });
  });

  describe('collapse & expand callbacks', () => {
    let handlers;

    beforeEach(() => {
      handlers = {
        onExpandStart: jest.fn(),
        onExpandEnd: jest.fn(),
        onCollapseStart: jest.fn(),
        onCollapseEnd: jest.fn(),
      };
    });

    it('should be attached to the Page transition component', () => {
      const wrapper = mount(<LayoutManager {...handlers} {...defaultProps} />);
      expect(wrapper.find(ResizeTransition).last().props()).toEqual(
        expect.objectContaining(handlers),
      );
    });

    it('should NOT be attached to the Nav transition component', () => {
      const wrapper = mount(<LayoutManager {...handlers} {...defaultProps} />);
      expect(wrapper.find(ResizeTransition).first().props()).not.toEqual(
        expect.objectContaining(handlers),
      );
    });

    it('should call onExpandStart when nav starts to permanently expand', () => {
      defaultProps.navigationUIController.state.isCollapsed = true;
      const wrapper = mount(<LayoutManager {...handlers} {...defaultProps} />);

      expect(handlers.onExpandStart).not.toHaveBeenCalled();

      defaultProps.navigationUIController.state.isCollapsed = false;
      wrapper.setProps(defaultProps);

      expect(handlers.onExpandStart).toHaveBeenCalledTimes(1);
    });

    it('should call onExpandEnd when nav completes permanently expanding', () => {
      defaultProps.navigationUIController.state.isCollapsed = true;
      const wrapper = mount(<LayoutManager {...handlers} {...defaultProps} />);

      defaultProps.navigationUIController.state.isCollapsed = false;
      wrapper.setProps(defaultProps);

      jest.advanceTimersByTime(299);
      expect(handlers.onExpandEnd).not.toHaveBeenCalled();

      jest.advanceTimersByTime(1);
      expect(handlers.onExpandEnd).toHaveBeenCalledTimes(1);
    });

    it('should call onCollapseStart when nav starts to permanently collapse', () => {
      defaultProps.navigationUIController.state.isCollapsed = false;
      const wrapper = mount(<LayoutManager {...handlers} {...defaultProps} />);

      expect(handlers.onCollapseStart).not.toHaveBeenCalled();

      defaultProps.navigationUIController.state.isCollapsed = true;
      wrapper.setProps(defaultProps);

      expect(handlers.onCollapseStart).toHaveBeenCalledTimes(1);
    });

    it('should call onCollapseEnd when nav completes permanently collapsing', () => {
      defaultProps.navigationUIController.state.isCollapsed = false;
      const wrapper = mount(<LayoutManager {...handlers} {...defaultProps} />);

      defaultProps.navigationUIController.state.isCollapsed = true;
      wrapper.setProps(defaultProps);

      jest.advanceTimersByTime(299);
      expect(handlers.onCollapseEnd).not.toHaveBeenCalled();

      jest.advanceTimersByTime(1);
      expect(handlers.onCollapseEnd).toHaveBeenCalledTimes(1);
    });
  });

  describe('analytics', () => {
    it('should render NavigationAnalyticsContext with correct payload when nav is collapsed', () => {
      defaultProps.navigationUIController.state.isCollapsed = true;
      const wrapper = shallow(<LayoutManager {...defaultProps} />);

      const analyticsContext = wrapper.find(NavigationAnalyticsContext);

      expect(analyticsContext).toHaveLength(1);
      expect(analyticsContext.prop('data')).toEqual({
        attributes: {
          isExpanded: false,
          flyoutOnHoverEnabled: false,
          alternateFlyoutBehaviourEnabled: false,
          fullWidthFlyoutEnabled: false,
          horizontalGlobalNavEnabled: false,
        },
        componentName: 'navigation',
        packageName,
        packageVersion: expect.any(String),
      });
    });

    it('should render NavigationAnalyticsContext with correct payload when nav is expanded', () => {
      defaultProps.navigationUIController.state.isCollapsed = false;
      const wrapper = shallow(<LayoutManager {...defaultProps} />);

      const analyticsContext = wrapper.find(NavigationAnalyticsContext);

      expect(analyticsContext).toHaveLength(1);
      expect(analyticsContext.prop('data')).toEqual({
        attributes: {
          isExpanded: true,
          flyoutOnHoverEnabled: false,
          alternateFlyoutBehaviourEnabled: false,
          fullWidthFlyoutEnabled: false,
          horizontalGlobalNavEnabled: false,
        },
        componentName: 'navigation',
        packageName,
        packageVersion: expect.any(String),
      });
    });

    it('should render NavigationAnalyticsContext with correct payload when flyoutOnHover experiment is enabled', () => {
      defaultProps.experimental_flyoutOnHover = true;
      const wrapper = shallow(<LayoutManager {...defaultProps} />);

      const analyticsContext = wrapper.find(NavigationAnalyticsContext);

      expect(analyticsContext).toHaveLength(1);
      expect(analyticsContext.prop('data')).toEqual({
        attributes: {
          isExpanded: true,
          flyoutOnHoverEnabled: true,
          alternateFlyoutBehaviourEnabled: false,
          fullWidthFlyoutEnabled: false,
          horizontalGlobalNavEnabled: false,
        },
        componentName: 'navigation',
        packageName,
        packageVersion: expect.any(String),
      });
    });

    it('should render NavigationAnalyticsContext with correct payload when alternateFlyoutBehaviour experiment is enabled', () => {
      defaultProps.experimental_flyoutOnHover = true;
      defaultProps.experimental_alternateFlyoutBehaviour = true;
      const wrapper = shallow(<LayoutManager {...defaultProps} />);

      const analyticsContext = wrapper.find(NavigationAnalyticsContext);

      expect(analyticsContext).toHaveLength(1);
      expect(analyticsContext.prop('data')).toEqual({
        attributes: {
          isExpanded: true,
          flyoutOnHoverEnabled: true,
          alternateFlyoutBehaviourEnabled: true,
          fullWidthFlyoutEnabled: false,
          horizontalGlobalNavEnabled: false,
        },
        componentName: 'navigation',
        packageName,
        packageVersion: expect.any(String),
      });
    });

    it('should render NavigationAnalyticsContext with correct payload when horizontalGlobalNav experiment is enabled', () => {
      defaultProps.experimental_horizontalGlobalNav = true;
      const wrapper = shallow(<LayoutManager {...defaultProps} />);

      const analyticsContext = wrapper.find(NavigationAnalyticsContext);

      expect(analyticsContext).toHaveLength(1);
      expect(analyticsContext.prop('data')).toEqual({
        attributes: {
          isExpanded: true,
          flyoutOnHoverEnabled: false,
          alternateFlyoutBehaviourEnabled: false,
          fullWidthFlyoutEnabled: false,
          horizontalGlobalNavEnabled: true,
        },
        componentName: 'navigation',
        packageName,
        packageVersion: expect.any(String),
      });
    });
  });

  describe('Sortable item dragging', () => {
    it('should set itemIsDragging state when onItemDragStart event is fired', () => {
      const wrapper = shallow(<LayoutManager {...defaultProps} />);

      expect(wrapper.state('itemIsDragging')).toBe(false);
      wrapper.find(LayoutEventListener).prop('onItemDragStart')();
      expect(wrapper.state('itemIsDragging')).toBe(true);
    });

    it('should unset itemIsDragging state when onItemDragEnd event is fired', () => {
      const wrapper = shallow(<LayoutManager {...defaultProps} />);
      wrapper.find(LayoutEventListener).prop('onItemDragStart')();

      expect(wrapper.state('itemIsDragging')).toBe(true);
      wrapper.find(LayoutEventListener).prop('onItemDragEnd')();
      expect(wrapper.state('itemIsDragging')).toBe(false);
    });

    it('should disable grab area when item is being dragged', () => {
      const wrapper = mount(<LayoutManager {...defaultProps} />);

      expect(wrapper.find(ResizeControl).prop('isGrabAreaDisabled')).toBe(
        false,
      );
      wrapper.setState({ itemIsDragging: true });
      expect(wrapper.find(ResizeControl).prop('isGrabAreaDisabled')).toBe(true);
    });

    it('should disable interaction on ContainerNavigationMask when item is being dragged', () => {
      const wrapper = mount(<LayoutManager {...defaultProps} />);

      expect(
        wrapper.find(ContainerNavigationMask).prop('disableInteraction'),
      ).toBe(false);
      wrapper.setState({ itemIsDragging: true });
      expect(
        wrapper.find(ContainerNavigationMask).prop('disableInteraction'),
      ).toBe(true);
    });

    it('should block render of navigation when `itemIsDragging` state changes', () => {
      const globalNav = jest.fn(() => null);
      const productNav = jest.fn(() => null);
      const wrapper = mount(
        <LayoutManager
          {...defaultProps}
          globalNavigation={globalNav}
          productNavigation={productNav}
        />,
      );

      expect(globalNav).toHaveBeenCalledTimes(1);
      expect(productNav).toHaveBeenCalledTimes(1);

      wrapper.setState({ itemIsDragging: true });

      expect(globalNav).toHaveBeenCalledTimes(1);
      expect(productNav).toHaveBeenCalledTimes(1);

      wrapper.setState({ itemIsDragging: false });

      expect(globalNav).toHaveBeenCalledTimes(1);
      expect(productNav).toHaveBeenCalledTimes(1);
    });
  });
});
