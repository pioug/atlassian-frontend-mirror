/* eslint-disable react/prop-types */
import '@atlaskit/polyfills/object-assign';
import React, { PureComponent } from 'react';
import { getTheme } from '@atlaskit/theme/components';
import {
  withAnalyticsEvents,
  withAnalyticsContext,
  createAndFireEvent,
} from '@atlaskit/analytics-next';
import {
  name as packageName,
  version as packageVersion,
} from '../../version.json';
import { navigationExpandedCollapsed } from '../../utils/analytics';
import GlobalNavigation from './GlobalNavigation';
import ContainerNavigation from './ContainerNavigation';
import NavigationFixedContainer from '../styled/NavigationFixedContainer';
import NavigationGlobalNavigationWrapper from '../styled/NavigationGlobalNavigationWrapper';
import NavigationContainerNavigationWrapper from '../styled/NavigationContainerNavigationWrapper';
import Resizer from './Resizer';
import Spacer from './Spacer';
import {
  containerClosedWidth,
  containerOpenWidth,
  globalOpenWidth,
  resizeClosedBreakpoint,
  standardOpenWidth,
} from '../../shared-variables';
import { defaultContainerTheme, defaultGlobalTheme } from '../../theme/util';
import WithElectronTheme from '../../theme/with-electron-theme';

const warnIfCollapsedPropsAreInvalid = ({ isCollapsible, isOpen }) => {
  if (!isCollapsible && !isOpen) {
    // eslint-disable-next-line no-console
    console.warn(`
        Navigation is being told it cannot collapse and that it is not open.
        When Navigation cannot collapse it must always be open.
        Ignoring isOpen={true}
      `);
  }
};

const defaultWidth = globalOpenWidth() + containerOpenWidth;

if (process.env.NODE_ENV !== 'production' && !process.env.CI) {
  // eslint-disable-next-line no-console
  console.warn(
    '@atlaskit/navigation has been deprecated. Please use the @atlaskit/navigation-next package instead.',
  );
}

class Navigation extends PureComponent {
  static defaultProps = {
    drawers: [],
    globalPrimaryIconAppearance: 'round',
    globalSecondaryActions: [],
    isCollapsible: true,
    isOpen: true,
    isResizeable: true,
    isElectronMac: false,
    onCreateDrawerOpen: () => {},
    onResize: () => {},
    onResizeStart: () => {},
    onSearchDrawerOpen: () => {},
    onToggleEnd: () => {},
    onToggleStart: () => {},
    topOffset: 0,
    width: defaultWidth,
  };

  constructor(props, context) {
    super(props, context);

    const { containerTheme, globalTheme } = props;
    const { mode } = getTheme(props);

    this.state = {
      containerTheme: defaultContainerTheme(containerTheme, mode),
      globalTheme: defaultGlobalTheme(globalTheme, mode),
      resizeDelta: 0,
      isResizing: false,
      isTogglingIsOpen: false,
    };

    warnIfCollapsedPropsAreInvalid(props);
  }

  spacerRef;

  // It is possible that Navigation.width will not be supplied by the product, which means the
  // default width will be used, which assumes a non-Electron environment. We update the width
  // for this specific case in componentDidMount.
  componentDidMount() {
    if (
      this.props.isElectronMac &&
      this.props.isOpen &&
      this.props.width === defaultWidth
    ) {
      this.onPropsResize({
        isOpen: true,
        width: globalOpenWidth(true) + containerOpenWidth,
      });
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { containerTheme, globalTheme } = nextProps;
    // TODO work out why nextProps.theme.__ATLASKIT_THEME__.mode always returns the mode
    // that was applied at time of first page load.

    const { mode } = getTheme(nextProps);

    const isTogglingIsOpen = this.props.isOpen !== nextProps.isOpen;

    if (isTogglingIsOpen) {
      this.props.onToggleStart();
    }

    this.setState({
      containerTheme: defaultContainerTheme(containerTheme, mode),
      globalTheme: defaultGlobalTheme(globalTheme, mode),
      isTogglingIsOpen,
    });

    warnIfCollapsedPropsAreInvalid(nextProps);
  }

  getSnappedWidth = width => {
    // |------------------------------|
    //      |           |             |
    //    closed    breakpoint       open
    //          * snap closed
    //                       * snap open
    //                                    * maintain expanded width

    const { isElectronMac } = this.props;
    const resizeClosedBreakpointResult = resizeClosedBreakpoint(isElectronMac);

    // Snap closed if width ever goes below the resizeClosedBreakpoint
    if (width < resizeClosedBreakpointResult) {
      return globalOpenWidth(isElectronMac);
    }

    // Snap open if in between the closed breakpoint and the standard width
    if (
      width > resizeClosedBreakpointResult &&
      width < standardOpenWidth(isElectronMac)
    ) {
      return standardOpenWidth(isElectronMac);
    }

    // At this point the width > standard width.
    // We allow you to have your own wider width.
    return width;
  };

  onResize = resizeDelta => {
    this.setState({
      isResizing: true,
      resizeDelta,
    });
  };

  onPropsResize = (resizeState, trigger) => {
    const { createAnalyticsEvent, isOpen } = this.props;
    if (trigger && resizeState.isOpen !== isOpen) {
      navigationExpandedCollapsed(createAnalyticsEvent, {
        isCollapsed: !resizeState.isOpen,
        trigger,
      });
    }
    this.props.onResize(resizeState);
  };

  onResizeEnd = resizeDelta => {
    const width = this.getRenderedWidth();
    const snappedWidth = this.getSnappedWidth(width);

    const resizeState = {
      isOpen: snappedWidth >= standardOpenWidth(this.props.isElectronMac),
      width: snappedWidth,
    };

    this.setState(
      {
        resizeDelta: 0,
        isResizing: false,
      },
      function callOnResizeAfterSetState() {
        const resizerClicked = resizeDelta === 0;
        this.onPropsResize(
          resizeState,
          resizerClicked ? undefined : 'resizerDrag',
        );
      },
    );
  };

  getRenderedWidth = () => {
    const { isOpen, width, isCollapsible, isElectronMac } = this.props;
    const baselineWidth = isOpen ? width : containerClosedWidth(isElectronMac);
    const minWidth = isCollapsible
      ? containerClosedWidth(isElectronMac)
      : standardOpenWidth(isElectronMac);
    return Math.max(minWidth, baselineWidth + this.state.resizeDelta);
  };

  triggerResizeButtonHandler = (resizeState, resizerClick) => {
    if (resizeState) {
      const trigger = resizerClick ? 'resizerClick' : 'chevron';
      this.onPropsResize(resizeState, trigger);
    }
  };

  registerSpacerRef = spacerRef => {
    this.spacerRef = spacerRef;
  };

  onSpacerTransitionEnd = e => {
    if (!this.spacerRef || e.target !== this.spacerRef) {
      return;
    }
    this.props.onToggleEnd();
  };

  render() {
    const {
      children,
      containerHeaderComponent,
      containerScrollRef,
      drawers,
      globalCreateIcon,
      globalPrimaryActions,
      globalPrimaryIcon,
      globalPrimaryIconAppearance,
      globalPrimaryItemHref,
      globalSearchIcon,
      globalSecondaryActions,
      hasScrollHintTop,
      isCollapsible,
      isElectronMac,
      isOpen,
      isResizeable,
      linkComponent,
      onCreateDrawerOpen,
      onResizeStart,
      onSearchDrawerOpen,
      topOffset,
      resizerButtonLabel,
    } = this.props;

    const {
      containerTheme,
      globalTheme,
      isTogglingIsOpen,
      isResizing,
    } = this.state;

    // if collapsed then:
    // 1. isOpen is ignored
    // 2. You cannot resize to a size smaller than the default open size

    const renderedWidth = this.getRenderedWidth();

    const globalOpenWidthResult = globalOpenWidth(isElectronMac);
    const containerClosedWidthResult = containerClosedWidth(isElectronMac);

    const isGlobalNavPartiallyCollapsed =
      isResizing &&
      renderedWidth < globalOpenWidthResult + containerClosedWidthResult;

    // Cover over the global navigation when it is partially collapsed
    const containerOffsetX = isGlobalNavPartiallyCollapsed
      ? renderedWidth - (globalOpenWidthResult + containerClosedWidthResult)
      : 0;

    // always show global navigation if it is not collapsible
    const showGlobalNavigation = !isCollapsible || isOpen || isResizing;

    const containerWidth = showGlobalNavigation
      ? Math.max(
          renderedWidth - globalOpenWidthResult,
          containerClosedWidthResult,
        )
      : containerClosedWidthResult;

    const isContainerCollapsed =
      !showGlobalNavigation || containerWidth === containerClosedWidthResult;
    const shouldAnimateContainer = isTogglingIsOpen && !isResizing;

    // When the navigation is not collapsible, and the width is expanded.
    // Users should be able to click the collapse button to go back to the original width
    const canCollapse = isCollapsible || containerWidth > containerOpenWidth;

    const globalNavigation = showGlobalNavigation ? (
      <NavigationGlobalNavigationWrapper>
        <GlobalNavigation
          theme={globalTheme}
          primaryActions={globalPrimaryActions}
          createIcon={globalCreateIcon}
          linkComponent={linkComponent}
          onCreateActivate={onCreateDrawerOpen}
          onSearchActivate={onSearchDrawerOpen}
          primaryIcon={globalPrimaryIcon}
          primaryIconAppearance={globalPrimaryIconAppearance}
          primaryItemHref={globalPrimaryItemHref}
          searchIcon={globalSearchIcon}
          secondaryActions={globalSecondaryActions}
        />
      </NavigationGlobalNavigationWrapper>
    ) : null;

    const resizer = isResizeable ? (
      <Resizer
        navigationWidth={renderedWidth}
        onResize={this.onResize}
        onResizeButton={this.triggerResizeButtonHandler}
        onResizeStart={onResizeStart}
        onResizeEnd={this.onResizeEnd}
        resizerButtonLabel={resizerButtonLabel}
        showResizeButton={canCollapse}
      />
    ) : null;

    return (
      <WithElectronTheme isElectronMac={isElectronMac}>
        <div>
          {/* Used to push the page to the right the width of the nav */}
          <Spacer
            innerRef={this.registerSpacerRef}
            onTransitionEnd={this.onSpacerTransitionEnd}
            shouldAnimate={shouldAnimateContainer}
            width={renderedWidth}
          >
            <NavigationFixedContainer topOffset={topOffset}>
              {globalNavigation}
              <NavigationContainerNavigationWrapper
                horizontalOffset={containerOffsetX}
              >
                <ContainerNavigation
                  scrollRef={containerScrollRef}
                  theme={containerTheme}
                  showGlobalActions={!showGlobalNavigation}
                  globalCreateIcon={globalCreateIcon}
                  globalPrimaryActions={globalPrimaryActions}
                  globalPrimaryIcon={globalPrimaryIcon}
                  globalPrimaryItemHref={globalPrimaryItemHref}
                  globalSearchIcon={globalSearchIcon}
                  globalSecondaryActions={globalSecondaryActions}
                  hasScrollHintTop={hasScrollHintTop}
                  headerComponent={containerHeaderComponent}
                  linkComponent={linkComponent}
                  onGlobalCreateActivate={onCreateDrawerOpen}
                  onGlobalSearchActivate={onSearchDrawerOpen}
                  isCollapsed={isContainerCollapsed}
                >
                  {children}
                </ContainerNavigation>
              </NavigationContainerNavigationWrapper>
              {resizer}
            </NavigationFixedContainer>
          </Spacer>
          {drawers}
        </div>
      </WithElectronTheme>
    );
  }
}

export { Navigation as NavigationWithoutAnalytics };
const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');

export default withAnalyticsContext({
  componentName: 'navigationSidebar',
  packageName,
  packageVersion,
})(
  withAnalyticsEvents({
    onResize: createAndFireEventOnAtlaskit({
      action: 'resized',
      actionSubject: 'navigationSidebar',

      attributes: {
        componentName: 'navigation',
        packageName,
        packageVersion,
      },
    }),

    onResizeStart: createAndFireEventOnAtlaskit({
      action: 'resizeStarted',
      actionSubject: 'navigationSidebar',

      attributes: {
        componentName: 'navigation',
        packageName,
        packageVersion,
      },
    }),
  })(Navigation),
);
