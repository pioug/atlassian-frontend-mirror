import React, { Component, Fragment } from 'react';

import { NavigationAnalyticsContext } from '@atlaskit/analytics-namespaced-context';

import {
  ALTERNATE_FLYOUT_DELAY,
  CONTENT_NAV_WIDTH_COLLAPSED,
  CONTENT_NAV_WIDTH_FLYOUT,
  FLYOUT_DELAY,
  GLOBAL_NAV_WIDTH,
  HORIZONTAL_GLOBAL_NAV_HEIGHT,
} from '../../../common/constants';
import RenderBlocker from '../../common/RenderBlocker';
import { ContainerNavigationMask } from '../ContentNavigation/primitives';
import ResizeTransition, { isTransitioning } from '../ResizeTransition';

import { LayoutEventListener } from './LayoutEvent';
import {
  ComposedContainerNavigation,
  ComposedGlobalNavigation,
} from './nav-components';
import {
  HorizontalNavigationContainer,
  LayoutContainer,
  NavigationContainer,
} from './primitives';
import ResizeControl from './ResizeControl';
import { pageContainerCSS } from './styles';

const packageName = process.env._PACKAGE_NAME_;
const packageVersion = process.env._PACKAGE_VERSION_;

function defaultTooltipContent(isCollapsed) {
  return isCollapsed
    ? { text: 'Expand', char: '[' }
    : { text: 'Collapse', char: '[' };
}

/* NOTE: experimental props use an underscore */

export default class LayoutManager extends Component {
  state = {
    flyoutIsOpen: false,
    itemIsDragging: false,
  };

  productNavRef;

  pageRef;

  containerRef;

  // eslint-disable-next-line no-undef
  flyoutMouseOverTimeout;

  static defaultProps = {
    collapseToggleTooltipContent: defaultTooltipContent,
    datasets: {
      content: {
        'data-testid': 'Content',
      },
      contextualNavigation: {
        'data-testid': 'ContextualNavigation',
      },
      globalNavigation: {
        'data-testid': 'GlobalNavigation',
      },
      navigation: {
        'data-testid': 'Navigation',
      },
    },
    topOffset: 0,
    shouldHideGlobalNavShadow: false,
    // eslint-disable-next-line camelcase
    experimental_alternateFlyoutBehaviour: false,
    experimental_flyoutOnHover: false,
    experimental_fullWidthFlyout: false,
    experimental_hideNavVisuallyOnCollapse: false,
    experimental_horizontalGlobalNav: false,
    showContextualNavigation: true,
  };

  static getDerivedStateFromProps(props, state) {
    // kill the flyout when the user commits to expanding navigation
    if (!props.navigationUIController.state.isCollapsed && state.flyoutIsOpen) {
      return { flyoutIsOpen: false };
    }

    return null;
  }

  nodeRefs = {
    expandCollapseAffordance: React.createRef(),
  };

  componentDidMount() {
    this.publishRefs();
  }

  componentDidUpdate() {
    this.publishRefs();
  }

  publishRefs() {
    const { getRefs } = this.props;
    if (typeof getRefs === 'function') {
      getRefs(this.nodeRefs);
    }
  }

  getContainerRef = (ref) => {
    this.containerRef = ref;
  };

  getNavRef = (ref) => {
    this.productNavRef = ref;
  };

  getPageRef = (ref) => {
    this.pageRef = ref;
  };

  mouseOutFlyoutArea = ({ currentTarget, relatedTarget }) => {
    if (currentTarget.contains(relatedTarget)) return;
    clearTimeout(this.flyoutMouseOverTimeout);
    this.setState({ flyoutIsOpen: false });
  };

  mouseOverFlyoutArea = ({ currentTarget, target }) => {
    if (!currentTarget.contains(target)) return;

    const {
      // eslint-disable-next-line camelcase
      experimental_alternateFlyoutBehaviour: EXPERIMENTAL_ALTERNATE_FLYOUT_BEHAVIOUR,
    } = this.props;
    const delay = EXPERIMENTAL_ALTERNATE_FLYOUT_BEHAVIOUR
      ? ALTERNATE_FLYOUT_DELAY
      : FLYOUT_DELAY;

    clearTimeout(this.flyoutMouseOverTimeout);

    this.flyoutMouseOverTimeout = setTimeout(() => {
      this.setState({ flyoutIsOpen: true });
    }, delay);
  };

  closeFlyout = (e) => {
    e.stopPropagation();
    clearTimeout(this.flyoutMouseOverTimeout);
    if (this.state.flyoutIsOpen) {
      this.setState({ flyoutIsOpen: false });
    }
  };

  mouseLeave = () => {
    clearTimeout(this.flyoutMouseOverTimeout);
  };

  onItemDragStart = () => {
    this.setState({ itemIsDragging: true });
  };

  onItemDragEnd = () => {
    this.setState({ itemIsDragging: false });
  };

  renderNavigation = () => {
    const {
      datasets,
      navigationUIController,
      // eslint-disable-next-line camelcase
      experimental_alternateFlyoutBehaviour: EXPERIMENTAL_ALTERNATE_FLYOUT_BEHAVIOUR,
      // eslint-disable-next-line camelcase
      experimental_flyoutOnHover: EXPERIMENTAL_FLYOUT_ON_HOVER,
      // eslint-disable-next-line camelcase
      experimental_fullWidthFlyout: EXPERIMENTAL_FULL_WIDTH_FLYOUT,
      // eslint-disable-next-line camelcase
      experimental_hideNavVisuallyOnCollapse: EXPERIMENTAL_HIDE_NAV_VISUALLY_ON_COLLAPSE,
      // eslint-disable-next-line camelcase
      experimental_horizontalGlobalNav: EXPERIMENTAL_HORIZONTAL_GLOBAL_NAV,
      collapseToggleTooltipContent,
      topOffset,
      shouldHideGlobalNavShadow,
      showContextualNavigation,
      globalNavigation,
      containerNavigation,
      productNavigation,
      view,
    } = this.props;
    const { flyoutIsOpen, itemIsDragging } = this.state;
    const {
      isCollapsed,
      isResizeDisabled,
      isResizing,
      productNavWidth,
    } = navigationUIController.state;

    const flyoutWidth = EXPERIMENTAL_FULL_WIDTH_FLYOUT
      ? productNavWidth
      : CONTENT_NAV_WIDTH_FLYOUT;

    const dataset = datasets ? datasets.navigation : {};

    const GlobalNavigation = globalNavigation;
    const navContainerTopOffset = EXPERIMENTAL_HORIZONTAL_GLOBAL_NAV
      ? HORIZONTAL_GLOBAL_NAV_HEIGHT + topOffset
      : topOffset;

    const onMouseOut =
      isCollapsed && EXPERIMENTAL_FLYOUT_ON_HOVER && flyoutIsOpen
        ? this.mouseOutFlyoutArea
        : null;
    const onMouseOver =
      isCollapsed && EXPERIMENTAL_FLYOUT_ON_HOVER && !flyoutIsOpen
        ? this.mouseOverFlyoutArea
        : null;

    return (
      <LayoutEventListener
        onItemDragStart={this.onItemDragStart}
        onItemDragEnd={this.onItemDragEnd}
      >
        <NavigationAnalyticsContext
          data={{
            attributes: {
              isExpanded: !isCollapsed,
              flyoutOnHoverEnabled: EXPERIMENTAL_FLYOUT_ON_HOVER,
              alternateFlyoutBehaviourEnabled: EXPERIMENTAL_ALTERNATE_FLYOUT_BEHAVIOUR,
              fullWidthFlyoutEnabled: EXPERIMENTAL_FULL_WIDTH_FLYOUT,
              horizontalGlobalNavEnabled: EXPERIMENTAL_HORIZONTAL_GLOBAL_NAV,
            },
            componentName: 'navigation',
            packageName,
            packageVersion,
          }}
        >
          <Fragment>
            {EXPERIMENTAL_HORIZONTAL_GLOBAL_NAV && (
              <HorizontalNavigationContainer topOffset={topOffset}>
                <GlobalNavigation />
              </HorizontalNavigationContainer>
            )}
            {/* eslint-disable-next-line jsx-a11y/mouse-events-have-key-events */}
            <NavigationContainer
              {...dataset}
              topOffset={navContainerTopOffset}
              innerRef={this.getContainerRef}
              onMouseOver={
                EXPERIMENTAL_ALTERNATE_FLYOUT_BEHAVIOUR ? onMouseOver : null
              }
              onMouseOut={onMouseOut}
              onMouseLeave={this.mouseLeave}
            >
              <ContainerNavigationMask
                disableInteraction={itemIsDragging}
                onMouseOver={
                  EXPERIMENTAL_ALTERNATE_FLYOUT_BEHAVIOUR ? null : onMouseOver
                }
              >
                <RenderBlocker blockOnChange itemIsDragging={itemIsDragging}>
                  {!EXPERIMENTAL_HORIZONTAL_GLOBAL_NAV && (
                    // Prevents GlobalNavigation from re-rendering on resize,
                    // and flyout expand/collapse
                    <RenderBlocker
                      blockOnChange
                      isResizing={isResizing}
                      isCollapsed={isCollapsed}
                      flyoutIsOpen={flyoutIsOpen}
                    >
                      <ComposedGlobalNavigation
                        containerNavigation={containerNavigation}
                        datasets={datasets}
                        globalNavigation={globalNavigation}
                        topOffset={topOffset}
                        shouldHideGlobalNavShadow={shouldHideGlobalNavShadow}
                        experimental_alternateFlyoutBehaviour={
                          EXPERIMENTAL_ALTERNATE_FLYOUT_BEHAVIOUR
                        }
                        closeFlyout={this.closeFlyout}
                        view={view}
                      />
                    </RenderBlocker>
                  )}

                  <ResizeTransition
                    from={[
                      showContextualNavigation
                        ? CONTENT_NAV_WIDTH_COLLAPSED
                        : 0,
                    ]}
                    in={
                      showContextualNavigation
                        ? !isCollapsed || flyoutIsOpen
                        : false
                    }
                    properties={['width']}
                    to={[flyoutIsOpen ? flyoutWidth : productNavWidth]}
                    userIsDragging={isResizing}
                    // only apply listeners to the NAV resize transition
                    productNavWidth={productNavWidth}
                  >
                    {({ transitionStyle, transitionState }) => (
                      <ComposedContainerNavigation
                        containerNavigation={containerNavigation}
                        datasets={datasets}
                        experimental_flyoutOnHover={
                          EXPERIMENTAL_FLYOUT_ON_HOVER
                        }
                        experimental_hideNavVisuallyOnCollapse={
                          !!EXPERIMENTAL_HIDE_NAV_VISUALLY_ON_COLLAPSE
                        }
                        expand={navigationUIController.expand}
                        productNavigation={productNavigation}
                        transitionState={transitionState}
                        transitionStyle={transitionStyle}
                        isCollapsed={isCollapsed}
                        isResizing={isResizing}
                        getNavRef={this.getNavRef}
                        view={view}
                      />
                    )}
                  </ResizeTransition>
                </RenderBlocker>
              </ContainerNavigationMask>
              {showContextualNavigation && (
                <ResizeControl
                  collapseToggleTooltipContent={collapseToggleTooltipContent}
                  expandCollapseAffordanceRef={
                    this.nodeRefs.expandCollapseAffordance
                  }
                  // eslint-disable-next-line camelcase
                  experimental_flyoutOnHover={EXPERIMENTAL_FLYOUT_ON_HOVER}
                  isDisabled={isResizeDisabled}
                  flyoutIsOpen={flyoutIsOpen}
                  isGrabAreaDisabled={itemIsDragging}
                  onMouseOverButtonBuffer={
                    EXPERIMENTAL_ALTERNATE_FLYOUT_BEHAVIOUR
                      ? this.closeFlyout
                      : null
                  }
                  mutationRefs={[
                    { ref: this.pageRef, property: 'padding-left' },
                    { ref: this.productNavRef, property: 'width' },
                  ]}
                  navigation={navigationUIController}
                />
              )}
            </NavigationContainer>
          </Fragment>
        </NavigationAnalyticsContext>
      </LayoutEventListener>
    );
  };

  renderPageContent = () => {
    const {
      datasets,
      // eslint-disable-next-line camelcase
      experimental_horizontalGlobalNav: EXPERIMENTAL_HORIZONTAL_GLOBAL_NAV,
      navigationUIController,
      onExpandStart,
      onExpandEnd,
      onCollapseStart,
      onCollapseEnd,
      children,
      showContextualNavigation,
    } = this.props;
    const { flyoutIsOpen } = this.state;
    const {
      isResizing,
      isCollapsed,
      productNavWidth,
    } = navigationUIController.state;

    const leftOffset = EXPERIMENTAL_HORIZONTAL_GLOBAL_NAV
      ? 0
      : GLOBAL_NAV_WIDTH;
    // This offset should just be the global nav height, as the topOffset prop has already been applied
    // to layout manager content via a margin
    const topOffset = EXPERIMENTAL_HORIZONTAL_GLOBAL_NAV
      ? HORIZONTAL_GLOBAL_NAV_HEIGHT
      : 0;

    const collapsedSize = 0;
    const expandedSize = flyoutIsOpen
      ? CONTENT_NAV_WIDTH_FLYOUT
      : productNavWidth;

    const dataset = datasets ? datasets.content : {};

    return (
      <ResizeTransition
        from={[CONTENT_NAV_WIDTH_COLLAPSED]}
        in={!isCollapsed}
        productNavWidth={productNavWidth}
        properties={['paddingLeft']}
        to={[showContextualNavigation ? expandedSize : collapsedSize]}
        userIsDragging={isResizing}
        /* Attach expand/collapse callbacks to the page resize transition to ensure they are only
         * called when the nav is permanently expanded/collapsed, i.e. when page content position changes. */
        onExpandStart={onExpandStart}
        onExpandEnd={onExpandEnd}
        onCollapseStart={onCollapseStart}
        onCollapseEnd={onCollapseEnd}
      >
        {({ transitionStyle, transitionState }) => (
          <div
            css={pageContainerCSS({
              disableInteraction:
                isResizing || isTransitioning(transitionState),
              leftOffset,
              topOffset,
            })}
            ref={this.getPageRef}
            style={transitionStyle}
            {...dataset}
          >
            {children}
          </div>
        )}
      </ResizeTransition>
    );
  };

  render() {
    const { topOffset } = this.props;
    return (
      <LayoutContainer topOffset={topOffset}>
        {this.renderNavigation()}
        {this.renderPageContent()}
      </LayoutContainer>
    );
  }
}
