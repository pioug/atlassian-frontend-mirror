/* eslint-disable no-console */
import { shallow, mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React, { PureComponent } from 'react';
import sinon from 'sinon';
import AddIcon from '@atlaskit/icon/glyph/add';
import NavigationWithAnalytics, {
  NavigationWithoutAnalytics as Navigation,
} from '../../components/js/Navigation';
import ContainerNavigationChildren from '../../components/js/ContainerNavigationChildren';
import Drawer from '../../components/js/Drawer';
import GlobalNavigation from '../../components/js/GlobalNavigation';
import ContainerNavigation from '../../components/js/ContainerNavigation';
import GlobalSecondaryActions from '../../components/js/GlobalSecondaryActions';
import Resizer from '../../components/js/Resizer';
import Spacer from '../../components/js/Spacer';
import SpacerInner from '../../components/styled/SpacerInner';
import WithElectronTheme from '../../theme/with-electron-theme';
import * as presets from '../../theme/presets';
import {
  containerClosedWidth as containerClosedWidthFn,
  globalOpenWidth as globalOpenWidthFn,
  standardOpenWidth as standardOpenWidthFn,
  containerOpenWidth,
  resizeClosedBreakpoint as resizeClosedBreakpointFn,
} from '../../shared-variables';

configure({ adapter: new Adapter() });
const containerClosedWidth = containerClosedWidthFn(false);
const globalOpenWidth = globalOpenWidthFn(false);
const standardOpenWidth = standardOpenWidthFn(false);
const resizeClosedBreakpoint = resizeClosedBreakpointFn(false);

const { expect } = window;

class Child extends PureComponent {
  render() {
    return <div>Hi there</div>;
  }
}

describe('<Navigation />', () => {
  const mockAnalyticsEvent = {
    fire: jest.fn(),
  };
  const mockCreateAnalyticsEvent = jest.fn(() => mockAnalyticsEvent);

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  describe('is open', () => {
    it('should render a <ContainerNavigation />', () => {
      expect(
        shallow(
          <Navigation createAnalyticsEvent={mockCreateAnalyticsEvent} isOpen />,
        ).find(ContainerNavigation).length,
      ).toBe(1);
    });

    it('should render a <GlobalNavigation />', () => {
      expect(
        shallow(
          <Navigation createAnalyticsEvent={mockCreateAnalyticsEvent} isOpen />,
        ).find(GlobalNavigation).length,
      ).toBe(1);
    });

    it('should render the provided Drawers', () => {
      const drawer1 = <Drawer key="d1" />;
      const drawer2 = <Drawer key="d2" />;
      expect(
        shallow(
          <Navigation
            createAnalyticsEvent={mockCreateAnalyticsEvent}
            isOpen
            drawers={[drawer1, drawer2]}
          />,
        ).find(Drawer).length,
      ).toBe(2);
    });

    it('should render a Spacer that has the width of the GlobalNavigation and ContainerNavigation', () => {
      const wrapper = shallow(
        <Navigation createAnalyticsEvent={mockCreateAnalyticsEvent} isOpen />,
      );

      expect(
        wrapper
          .find(Spacer)
          .first()
          .props().width,
      ).toBe(globalOpenWidth + containerOpenWidth);
    });
  });

  describe('is closed', () => {
    it('should render a <ContainerNavigation />', () => {
      expect(
        shallow(
          <Navigation
            createAnalyticsEvent={mockCreateAnalyticsEvent}
            isOpen={false}
          />,
        ).find(ContainerNavigation).length,
      ).toBe(1);
    });

    it('should not render a <GlobalNavigation />', () => {
      expect(
        shallow(
          <Navigation
            createAnalyticsEvent={mockCreateAnalyticsEvent}
            isOpen={false}
          />,
        ).find(GlobalNavigation).length,
      ).toBe(0);
    });

    it('should render the provided Drawers', () => {
      const drawer1 = <Drawer key="d1" />;
      const drawer2 = <Drawer key="d2" />;
      expect(
        shallow(
          <Navigation
            createAnalyticsEvent={mockCreateAnalyticsEvent}
            isOpen={false}
            drawers={[drawer1, drawer2]}
          />,
        ).find(Drawer).length,
      ).toBe(2);
    });

    it('should render a Spacer that has the width of the GlobalNavigation', () => {
      const wrapper = shallow(
        <Navigation
          createAnalyticsEvent={mockCreateAnalyticsEvent}
          isOpen={false}
        />,
      );

      expect(
        wrapper
          .find(Spacer)
          .first()
          .props().width,
      ).toBe(globalOpenWidth);
    });
  });

  describe('resizing', () => {
    const getSpacerWidth = wrapper =>
      wrapper
        .find(Spacer)
        .first()
        .props().width;

    const resize = (wrapper, resizeTo, ResizerComp = Resizer) => {
      const resizer = wrapper.find(ResizerComp);
      resizer.props().onResizeStart();
      resizer.props().onResize(resizeTo);
      resizer.props().onResizeEnd(resizeTo);
    };

    it('should not allow resizing if not resizable', () => {
      const onResizeStart = jest.fn();
      const onResize = jest.fn();
      const wrapper = shallow(
        <Navigation
          createAnalyticsEvent={mockCreateAnalyticsEvent}
          isOpen
          isResizeable={false}
          onResize={onResize}
          onResizeStart={onResizeStart}
        />,
      );

      // cannot resize because there is no Resizer
      expect(wrapper.find('Resizer').length).toBe(0);
    });

    it('should call onResizeStart when the resizer starts resizing', () => {
      const stub = jest.fn();
      const wrapper = mount(
        <Navigation
          createAnalyticsEvent={mockCreateAnalyticsEvent}
          onResizeStart={stub}
        />,
      );

      wrapper.find('Resizer').simulate('mouseDown');

      expect(stub).toHaveBeenCalled();
    });

    it('should render a Spacer that has the width of the current container', () => {
      const wrapper = mount(
        <Navigation createAnalyticsEvent={mockCreateAnalyticsEvent} isOpen />,
      );

      wrapper
        .find('Resizer')
        .props()
        .onResize(2000);

      wrapper.update();

      expect(
        wrapper
          .find(Spacer)
          .first()
          .props().width,
      ).toBe(2000 + (containerOpenWidth + globalOpenWidth));
    });

    it('should call onResize when a resize finishes', () => {
      const stub = jest.fn();
      const wrapper = mount(
        <Navigation
          createAnalyticsEvent={mockCreateAnalyticsEvent}
          isOpen
          onResize={stub}
        />,
      );

      wrapper
        .find(Resizer)
        .props()
        .onResizeEnd();

      expect(stub).toHaveBeenCalled();
    });

    it('should never have a width less than the GlobalNavigation', () => {
      const wrapper = mount(
        <Navigation createAnalyticsEvent={mockCreateAnalyticsEvent} isOpen />,
      );

      wrapper
        .find(Resizer)
        .props()
        .onResize(-300);

      wrapper.update();
      expect(getSpacerWidth(wrapper)).toBe(globalOpenWidth);
    });

    it('should allow the width to grow above the standard width if not collapsible', () => {
      const wrapper = mount(
        <Navigation
          createAnalyticsEvent={mockCreateAnalyticsEvent}
          isCollapsible={false}
        />,
      );

      wrapper
        .find(Resizer)
        .props()
        .onResize(5);

      wrapper.update();
      expect(getSpacerWidth(wrapper)).toBe(
        globalOpenWidth + containerOpenWidth + 5,
      );
    });

    it('should not allow the width to drop below the standard width if not collapsible', () => {
      const wrapper = mount(
        <Navigation
          createAnalyticsEvent={mockCreateAnalyticsEvent}
          isCollapsible={false}
        />,
      );

      wrapper
        .find(Resizer)
        .props()
        .onResize(-5);

      expect(getSpacerWidth(wrapper)).toBe(
        globalOpenWidth + containerOpenWidth,
      );
    });

    describe('snapping', () => {
      describe('starting open', () => {
        it('should snap closed if moving beyond the resize breakpoint', () => {
          const stub = jest.fn();
          const wrapper = mount(
            <Navigation
              createAnalyticsEvent={mockCreateAnalyticsEvent}
              isOpen
              onResize={stub}
            />,
          );
          const diff = standardOpenWidth - resizeClosedBreakpoint;
          // moving to the left beyond the resize breakpoint
          const resizeTo = -1 * diff - 1;

          resize(wrapper, resizeTo);

          expect(stub).toHaveBeenCalledWith({
            width: globalOpenWidth,
            isOpen: false,
          });
        });

        it('should snap open if closing but did not move past the resize breakpoint', () => {
          const stub = jest.fn();
          const wrapper = mount(
            <Navigation
              createAnalyticsEvent={mockCreateAnalyticsEvent}
              isOpen
              onResize={stub}
            />,
          );
          const diff = standardOpenWidth - resizeClosedBreakpoint;
          // moving to the left but not enough
          const resizeTo = -1 * diff + 1;

          resize(wrapper, resizeTo);

          expect(stub).toHaveBeenCalledWith({
            width: standardOpenWidth,
            isOpen: true,
          });
        });
      });

      describe('starting closed', () => {
        it('should snap closed if opening but did not move beyond the resize breakpoint', () => {
          const stub = jest.fn();
          const wrapper = mount(
            <Navigation
              createAnalyticsEvent={mockCreateAnalyticsEvent}
              isOpen={false}
              onResize={stub}
            />,
          );
          // moving to the right but not beyond the resize breakpoint
          const resizeTo = globalOpenWidth + 1;

          resize(wrapper, resizeTo);

          expect(stub).toHaveBeenCalledWith({
            width: globalOpenWidth,
            isOpen: false,
          });
        });

        it('should snap open if expanding beyond the resize breakpoint', () => {
          const stub = jest.fn();
          const wrapper = mount(
            <Navigation
              createAnalyticsEvent={mockCreateAnalyticsEvent}
              isOpen={false}
              onResize={stub}
            />,
          );
          const diff = resizeClosedBreakpoint - globalOpenWidth;
          // moving to the right beyond the resize breakpoint
          const resizeTo = diff + 1;

          resize(wrapper, resizeTo);

          expect(stub).toHaveBeenCalledWith({
            width: standardOpenWidth,
            isOpen: true,
          });
        });
      });

      describe('analytics', () => {
        const mockNavigationExpandedCollapsed = jest.fn();
        let RequiredNavigation;
        let RequiredResizer;
        beforeEach(() => {
          jest.resetModules();
          jest.clearAllMocks();
          jest.doMock('../../utils/analytics', () => ({
            navigationExpandedCollapsed: mockNavigationExpandedCollapsed,
            withGlobalItemAnalytics: jest.fn(Comp => Comp),
          }));

          const navExports = require('../../components/js/Navigation');
          RequiredNavigation = navExports.NavigationWithoutAnalytics;

          const resizerExports = require('../../components/js/Resizer');
          RequiredResizer = resizerExports.default;
        });

        describe('expand event', () => {
          it('should fire with a trigger of chevron when nav is opened via resizer button click', () => {
            const wrapper = shallow(
              <RequiredNavigation
                createAnalyticsEvent={mockCreateAnalyticsEvent}
                isOpen={false}
              />,
            );

            expect(mockNavigationExpandedCollapsed).not.toHaveBeenCalled();

            wrapper
              .find(RequiredResizer)
              .props()
              .onResizeButton({ isOpen: true, width: 500 });

            expect(mockNavigationExpandedCollapsed).toHaveBeenCalledTimes(1);
            expect(mockNavigationExpandedCollapsed).toHaveBeenCalledWith(
              mockCreateAnalyticsEvent,
              {
                isCollapsed: false,
                trigger: 'chevron',
              },
            );
          });

          it('should fire with a trigger of resizerClick when nav is opened via resizer click', () => {
            const wrapper = shallow(
              <RequiredNavigation
                createAnalyticsEvent={mockCreateAnalyticsEvent}
                isOpen={false}
              />,
            );

            expect(mockNavigationExpandedCollapsed).not.toHaveBeenCalled();

            wrapper
              .find(RequiredResizer)
              .props()
              .onResizeButton({ isOpen: true, width: 500 }, true);

            expect(mockNavigationExpandedCollapsed).toHaveBeenCalledTimes(1);
            expect(mockNavigationExpandedCollapsed).toHaveBeenCalledWith(
              mockCreateAnalyticsEvent,
              {
                isCollapsed: false,
                trigger: 'resizerClick',
              },
            );
          });

          it('should fire with a trigger of resizerDrag when the nav is opened via resizer drag', () => {
            const wrapper = shallow(
              <RequiredNavigation
                createAnalyticsEvent={mockCreateAnalyticsEvent}
                isOpen={false}
              />,
            );

            expect(mockNavigationExpandedCollapsed).not.toHaveBeenCalled();

            resize(wrapper, 350, RequiredResizer);

            expect(mockNavigationExpandedCollapsed).toHaveBeenCalledTimes(1);
            expect(mockNavigationExpandedCollapsed).toHaveBeenCalledWith(
              mockCreateAnalyticsEvent,
              {
                isCollapsed: false,
                trigger: 'resizerDrag',
              },
            );
          });

          it('should NOT fire when the nav is resized and the nav remains open', () => {
            const wrapper = shallow(
              <RequiredNavigation
                createAnalyticsEvent={mockCreateAnalyticsEvent}
                isOpen
              />,
            );

            expect(mockNavigationExpandedCollapsed).not.toHaveBeenCalled();

            resize(wrapper, 25, RequiredResizer);

            expect(mockNavigationExpandedCollapsed).not.toHaveBeenCalled();
          });
        });

        describe('collapse event', () => {
          it('should fire with a trigger of chevron when nav is closed via resizer button click', () => {
            const wrapper = shallow(
              <RequiredNavigation
                createAnalyticsEvent={mockCreateAnalyticsEvent}
                isOpen
              />,
            );

            expect(mockNavigationExpandedCollapsed).not.toHaveBeenCalled();

            wrapper
              .find(RequiredResizer)
              .props()
              .onResizeButton({ isOpen: false, width: 500 });

            expect(mockNavigationExpandedCollapsed).toHaveBeenCalledTimes(1);
            expect(mockNavigationExpandedCollapsed).toHaveBeenCalledWith(
              mockCreateAnalyticsEvent,
              {
                isCollapsed: true,
                trigger: 'chevron',
              },
            );
          });

          it('should fire with a trigger of resizerClick when nav is closed via resizer click', () => {
            const wrapper = shallow(
              <RequiredNavigation
                createAnalyticsEvent={mockCreateAnalyticsEvent}
                isOpen
              />,
            );

            expect(mockNavigationExpandedCollapsed).not.toHaveBeenCalled();

            wrapper
              .find(RequiredResizer)
              .props()
              .onResizeButton({ isOpen: false, width: 500 }, true);

            expect(mockNavigationExpandedCollapsed).toHaveBeenCalledTimes(1);
            expect(mockNavigationExpandedCollapsed).toHaveBeenCalledWith(
              mockCreateAnalyticsEvent,
              {
                isCollapsed: true,
                trigger: 'resizerClick',
              },
            );
          });

          it('should fire with a trigger of resizerDrag when the nav is opened via resizer drag', () => {
            const wrapper = shallow(
              <RequiredNavigation
                createAnalyticsEvent={mockCreateAnalyticsEvent}
                isOpen
              />,
            );

            expect(mockNavigationExpandedCollapsed).not.toHaveBeenCalled();

            resize(wrapper, -250, RequiredResizer);

            expect(mockNavigationExpandedCollapsed).toHaveBeenCalledTimes(1);
            expect(mockNavigationExpandedCollapsed).toHaveBeenCalledWith(
              mockCreateAnalyticsEvent,
              {
                isCollapsed: true,
                trigger: 'resizerDrag',
              },
            );
          });

          it('should NOT fire when the nav is resized and the nav remains closed', () => {
            const wrapper = shallow(
              <RequiredNavigation
                createAnalyticsEvent={mockCreateAnalyticsEvent}
                isOpen={false}
              />,
            );

            expect(mockNavigationExpandedCollapsed).not.toHaveBeenCalled();

            resize(wrapper, 25, RequiredResizer);

            expect(mockNavigationExpandedCollapsed).not.toHaveBeenCalled();
          });
        });
      });
    });

    describe('forwarding props', () => {
      it('containerHeaderComponent - passes a func for the container header component to <ContainerNavigation />', () => {
        const header = () => [<div>foo</div>];
        expect(
          shallow(
            <Navigation
              createAnalyticsEvent={mockCreateAnalyticsEvent}
              containerHeaderComponent={header}
            />,
          )
            .find(ContainerNavigation)
            .props().headerComponent,
        ).toBe(header);
      });

      it('should pass globalSearchIcon onto <GlobalNavigation />', () => {
        const icon = <img alt="search" />;
        expect(
          mount(
            <Navigation
              createAnalyticsEvent={mockCreateAnalyticsEvent}
              globalSearchIcon={icon}
            />,
          )
            .find(GlobalNavigation)
            .props().searchIcon,
        ).toBe(icon);
      });

      it('should pass globalCreateIcon onto <GlobalNavigation />', () => {
        const icon = <img alt="create" />;
        expect(
          mount(
            <Navigation
              createAnalyticsEvent={mockCreateAnalyticsEvent}
              globalCreateIcon={icon}
            />,
          )
            .find(GlobalNavigation)
            .props().createIcon,
        ).toBe(icon);
      });

      it('should pass globalTheme onto <GlobalNavigation />', () => {
        const theme = presets.settings;
        expect(
          mount(
            <Navigation
              createAnalyticsEvent={mockCreateAnalyticsEvent}
              globalTheme={theme}
            />,
          )
            .find(GlobalNavigation)
            .props().theme,
        ).toBe(theme);
      });

      it('should pass containerScrollRef to ContainerNavigation.scrollRef', () => {
        const myRef = () => {};
        expect(
          shallow(
            <Navigation
              createAnalyticsEvent={mockCreateAnalyticsEvent}
              containerScrollRef={myRef}
            />,
          )
            .find(ContainerNavigation)
            .props().scrollRef,
        ).toBe(myRef);
      });

      it('should pass containerTheme onto <ContainerNavigation />', () => {
        const theme = presets.settings;
        expect(
          mount(
            <Navigation
              createAnalyticsEvent={mockCreateAnalyticsEvent}
              containerTheme={theme}
            />,
          )
            .find(ContainerNavigation)
            .props().theme,
        ).toBe(theme);
      });

      it('should pass globalSearchIcon onto <ContainerNavigation />', () => {
        const icon = <img alt="search" />;
        expect(
          mount(
            <Navigation
              createAnalyticsEvent={mockCreateAnalyticsEvent}
              globalSearchIcon={icon}
            />,
          )
            .find(ContainerNavigation)
            .props().globalSearchIcon,
        ).toBe(icon);
      });

      it('should pass globalCreateIcon onto <ContainerNavigation />', () => {
        const icon = <img alt="create" />;
        expect(
          mount(
            <Navigation
              createAnalyticsEvent={mockCreateAnalyticsEvent}
              globalCreateIcon={icon}
            />,
          )
            .find(ContainerNavigation)
            .props().globalCreateIcon,
        ).toBe(icon);
      });

      it('should pass hasScrollHintTop onto <ContainerNavigationChildren />', () => {
        expect(
          mount(
            <Navigation
              createAnalyticsEvent={mockCreateAnalyticsEvent}
              hasScrollHintTop
            />,
          )
            .find(ContainerNavigationChildren)
            .props().hasScrollHintTop,
        ).toBe(true);
      });

      it('onResize is called after the resizeDelta has been reset to 0 (so that animations are enabled again)', done => {
        const navigation = mount(
          <Navigation createAnalyticsEvent={mockCreateAnalyticsEvent} />,
        );
        navigation.setProps({
          onResize: () => {
            expect(navigation.state().resizeDelta).toBe(0);
            done();
          },
        });
        navigation
          .find(Resizer)
          .props()
          .onResizeStart();
        navigation
          .find(Resizer)
          .props()
          .onResize(-300);
        navigation
          .find(Resizer)
          .props()
          .onResizeEnd();
      });

      it("globalPrimaryItem should map to global navigation's primaryItem", () => {
        const primaryIcon = <span className="PRIMARY_ICON" />;
        expect(
          mount(
            <Navigation
              createAnalyticsEvent={mockCreateAnalyticsEvent}
              globalPrimaryIcon={primaryIcon}
            />,
          )
            .find(GlobalNavigation)
            .props().primaryIcon,
        ).toBe(primaryIcon);
      });
      it('should allow you to pass in global secondard actions', () => {
        const wrapper = mount(
          <Navigation
            createAnalyticsEvent={mockCreateAnalyticsEvent}
            globalSecondaryActions={[<Child />, <Child />]}
          />,
        );

        expect(
          wrapper
            .find(GlobalNavigation)
            .find(GlobalSecondaryActions)
            .find(Child),
        ).toHaveLength(2);
      });
      it('linkComponent is passed on to <GlobalNavigation/>', () => {
        const linkComponent = () => null;
        expect(
          mount(
            <Navigation
              createAnalyticsEvent={mockCreateAnalyticsEvent}
              linkComponent={linkComponent}
            />,
          )
            .find(GlobalNavigation)
            .props().linkComponent,
        ).toBe(linkComponent);
      });

      it('initial width prop is reflected on <Spacer />', () => {
        expect(
          shallow(
            <Navigation
              createAnalyticsEvent={mockCreateAnalyticsEvent}
              width={500}
            />,
          )
            .find(Spacer)
            .first()
            .props().width,
        ).toBe(500);
        expect(
          shallow(
            <Navigation
              createAnalyticsEvent={mockCreateAnalyticsEvent}
              width={200}
            />,
          )
            .find(Spacer)
            .first()
            .props().width,
        ).toBe(200);
      });

      it('should override width when container is closed', () => {
        expect(
          mount(
            <Navigation
              createAnalyticsEvent={mockCreateAnalyticsEvent}
              isOpen={false}
              width={500}
            />,
          )
            .find(Spacer)
            .first()
            .props().width,
        ).toBe(containerClosedWidth);
      });
    });

    describe('not collapsible and is open is set to false', () => {
      let wrapper;
      let warnStub;
      function expectWarningCollapse() {
        sinon.assert.calledWithMatch(
          console.warn,
          new RegExp(
            `Navigation is being told it cannot collapse and that it is not open.
        When Navigation cannot collapse it must always be open.
        Ignoring isOpen={true}`,
          ),
        );
      }
      beforeEach(() => {
        warnStub = jest.spyOn(console, 'warn');
        sinon.stub(console, 'warn');
        wrapper = shallow(
          <Navigation
            isCollapsible={false}
            createAnalyticsEvent={mockCreateAnalyticsEvent}
            isOpen={false}
          />,
        );
      });

      afterEach(() => {
        console.warn.restore();
        warnStub.mockRestore();
        wrapper.unmount();
      });

      it('should keep the container navigation open', () => {
        expect(wrapper.find(ContainerNavigation).length).toBe(1);
      });

      it('should tell the container not to render the global primary items', () => {
        expect(
          wrapper.find(ContainerNavigation).props().showGlobalActions,
        ).toBe(false);
      });

      it('should render the global navigation', () => {
        expect(wrapper.find(GlobalNavigation).length).toBe(1);
      });

      it('should render the correct width', () => {
        expect(
          wrapper
            .find(Spacer)
            .first()
            .props().width,
        ).toBe(globalOpenWidth + containerOpenWidth);
      });

      it('should log a warning on mount', () => {
        expectWarningCollapse();
        sinon.assert.callCount(console.warn, 1);
        expect(warnStub).toHaveBeenCalledTimes(0);
      });

      it('should log a warning on update', () => {
        warnStub.mockClear();
        const customWrapper = shallow(
          <Navigation createAnalyticsEvent={mockCreateAnalyticsEvent} isOpen />,
        );

        expect(warnStub).toHaveBeenCalledTimes(0);

        customWrapper.setProps({
          isOpen: false,
          isCollapsible: false,
        });

        sinon.assert.callCount(console.warn, 2);
        expectWarningCollapse();
      });
    });

    describe('collapsing', () => {
      it('should allow collapsing if isCollapsible is set to false and navigation width is expanded', () => {
        const wrapper = mount(
          <Navigation
            createAnalyticsEvent={mockCreateAnalyticsEvent}
            isCollapsible={false}
          />,
        );
        wrapper
          .find(Resizer)
          .props()
          .onResize(1);

        wrapper.update();

        expect(wrapper.find(Resizer).props().showResizeButton).toBe(true);
      });

      it('should not allow collapsing if isCollapsible is set to false and navigation width is not expanded', () => {
        const wrapper = mount(
          <Navigation
            createAnalyticsEvent={mockCreateAnalyticsEvent}
            isCollapsible={false}
          />,
        );

        expect(wrapper.find(Resizer).props().showResizeButton).toBe(false);
      });

      it('should fire onToggleStart when the isOpen prop changes', () => {
        const onToggleStart = jest.fn();
        const wrapper = mount(
          <Navigation
            onToggleStart={onToggleStart}
            createAnalyticsEvent={mockCreateAnalyticsEvent}
            isOpen
          />,
        );
        wrapper.setProps({ isOpen: false });
        wrapper.setProps({ isOpen: true });
        expect(onToggleStart).toHaveBeenCalledTimes(2);
      });

      it('should fire onToggleEnd callback when a transition event on the Spacer completes', () => {
        const onToggleEnd = jest.fn();
        const wrapper = mount(
          <Navigation
            onToggleEnd={onToggleEnd}
            createAnalyticsEvent={mockCreateAnalyticsEvent}
            isOpen
          />,
        );

        // Enzyme doesn't support `.simulate('transitionend')`
        // so we have to reach in and trigger it ourselves
        // https://github.com/airbnb/enzyme/issues/1258
        const spacer = wrapper.find(SpacerInner);
        const e = { target: spacer.getDOMNode() };
        spacer.props().onTransitionEnd(e);

        expect(onToggleEnd).toBeCalled();
      });
    });

    describe('isElectronMac', () => {
      it('should render WithElectronTheme with set to false by default', () => {
        const wrapper = shallow(
          <Navigation createAnalyticsEvent={mockCreateAnalyticsEvent} />,
        );
        expect(wrapper.find(WithElectronTheme).props().isElectronMac).toBe(
          false,
        );
      });
      it('should pass isElectronMac prop to WithElectronTheme', () => {
        const wrapper = shallow(
          <Navigation
            isElectronMac
            createAnalyticsEvent={mockCreateAnalyticsEvent}
          />,
        );
        expect(wrapper.find(WithElectronTheme).props().isElectronMac).toBe(
          true,
        );
      });
    });
    describe('reactWarnings', () => {
      beforeEach(() => {
        jest.fn(error => {
          throw new Error(error);
        });
      });

      it('should not throw errors on mounting closed Navigation with primary icon', () => {
        expect(() => {
          mount(
            <Navigation
              globalPrimaryIcon={<AddIcon />}
              globalPrimaryItemHref="http://a.com"
              createAnalyticsEvent={mockCreateAnalyticsEvent}
              isOpen={false}
            />,
          );
        }).not.toThrow();
      });
    });
  });

  describe('NavigationWithAnalytics', () => {
    beforeEach(() => {
      jest.spyOn(global.console, 'warn');
      jest.spyOn(global.console, 'error');
    });
    afterEach(() => {
      global.console.warn.mockRestore();
      global.console.error.mockRestore();
    });

    it('should mount without errors', () => {
      mount(<NavigationWithAnalytics isOpen />);
      /* eslint-disable no-console */
      expect(console.warn).not.toHaveBeenCalled();
      expect(console.error).not.toHaveBeenCalled();
      /* eslint-enable no-console */
    });
  });
});
