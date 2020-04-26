import React, { Component, Fragment } from 'react';

import { NavigationAnalyticsContext } from '@atlaskit/analytics-namespaced-context';

import { withNavigationUIController } from '../../../ui-controller';
import { ViewControllerSubscriber } from '../../../view-controller';
import LayerInitialised from '../../presentational/LayerInitialised';
import LayoutManager from '../../presentational/LayoutManager';
/* NOTE: experimental props use an underscore */
/* eslint-disable camelcase */

class AsyncLayoutManagerWithViewControllerBase extends Component {
  static defaultProps = {
    experimental_alternateFlyoutBehaviour: false,
    experimental_flyoutOnHover: false,
    experimental_fullWidthFlyout: false,
    experimental_hideNavVisuallyOnCollapse: false,
    experimental_horizontalGlobalNav: false,
  };

  state = {
    hasInitialised: false,
    outgoingView: null,
  };

  constructor(props) {
    super(props);
    this.renderContainerNavigation.displayName = 'ContainerNavigationRenderer';
    this.renderProductNavigation.displayName = 'ProductNavigationRenderer';
  }

  componentDidUpdate(prevProps) {
    const { view } = this.props;
    const { view: prevView } = prevProps;

    if (!view || !prevView) {
      return;
    }

    // If we're moving from a product to a container view or vice versa we cache
    // the previous view so that we can still render it during the transition.
    if (view.type !== prevView.type) {
      // It's totally fine to setState in componentDidUpdate as long as it's
      // wrapped in a condition:
      // https://reactjs.org/docs/react-component.html#componentdidupdate
      // eslint-disable-next-line
      this.setState({ outgoingView: prevView });
    }
  }

  onInitialised = () => {
    this.setState({
      hasInitialised: true,
    });
  };

  renderSkeleton = () => {
    const { containerSkeleton: ContainerSkeleton } = this.props;
    return <ContainerSkeleton type={this.props.firstSkeletonToRender} />;
  };

  renderContainerNavigation = () => {
    const { firstSkeletonToRender, view } = this.props;
    const { outgoingView } = this.state;

    if (view && view.type === 'container') {
      return this.renderView(view);
    }

    if (outgoingView && outgoingView.type === 'container') {
      return this.renderView(outgoingView);
    }

    if (
      !view &&
      firstSkeletonToRender === 'container' &&
      !this.state.hasInitialised
    ) {
      return this.renderSkeleton();
    }

    return firstSkeletonToRender !== 'container' ? null : this.renderSkeleton();
  };

  renderGlobalNavigation = () => {
    const { globalNavigation: GlobalNavigation, view } = this.props;
    const { hasInitialised } = this.state;

    /* We are embedding the LayerInitialised analytics component within global navigation so that
     * the event it fires can access the analytics context within LayerManager. The component
     * cannot be rendered directly within LayerManager since it needs access to view data which
     * only exists in LayoutManagerWithViewController. */
    return (
      <Fragment>
        <GlobalNavigation />
        <LayerInitialised
          activeView={view}
          initialised={hasInitialised}
          onInitialised={this.onInitialised}
        />
      </Fragment>
    );
  };

  renderProductNavigation = () => {
    const { view } = this.props;
    const { outgoingView } = this.state;

    if (view && view.type === 'product') {
      return this.renderView(view);
    }

    // If we're transitioning from a product view to a container view still
    // render the outgoing product view.
    if (
      view &&
      view.type === 'container' &&
      outgoingView &&
      outgoingView.type === 'product'
    ) {
      return this.renderView(outgoingView);
    }

    return this.renderSkeleton();
  };

  renderView(view) {
    const { customComponents, itemsRenderer: ItemsRenderer } = this.props;
    return (
      <ItemsRenderer customComponents={customComponents} items={view.data} />
    );
  }

  render() {
    const {
      children,
      datasets,
      experimental_alternateFlyoutBehaviour,
      experimental_flyoutOnHover,
      experimental_fullWidthFlyout,
      experimental_hideNavVisuallyOnCollapse,
      experimental_horizontalGlobalNav,
      firstSkeletonToRender,
      onExpandStart,
      onExpandEnd,
      onCollapseStart,
      onCollapseEnd,
      getRefs,
      view,
      topOffset,
      shouldHideGlobalNavShadow,
      showContextualNavigation,
    } = this.props;

    return (
      <NavigationAnalyticsContext
        data={{
          attributes: {
            navigationLayer: view && view.type,
            view: view && view.id,
            ...(view && view.analyticsAttributes),
          },
        }}
      >
        <LayoutManager
          globalNavigation={this.renderGlobalNavigation}
          containerNavigation={
            (view && view.type === 'container') ||
            (!view &&
              firstSkeletonToRender === 'container' &&
              !this.state.hasInitialised)
              ? this.renderContainerNavigation
              : null
          }
          experimental_alternateFlyoutBehaviour={
            experimental_alternateFlyoutBehaviour
          }
          experimental_flyoutOnHover={experimental_flyoutOnHover}
          experimental_fullWidthFlyout={experimental_fullWidthFlyout}
          experimental_hideNavVisuallyOnCollapse={
            experimental_hideNavVisuallyOnCollapse
          }
          experimental_horizontalGlobalNav={experimental_horizontalGlobalNav}
          productNavigation={this.renderProductNavigation}
          onExpandStart={onExpandStart}
          onExpandEnd={onExpandEnd}
          onCollapseStart={onCollapseStart}
          onCollapseEnd={onCollapseEnd}
          getRefs={getRefs}
          topOffset={topOffset}
          shouldHideGlobalNavShadow={shouldHideGlobalNavShadow}
          showContextualNavigation={showContextualNavigation}
          datasets={datasets}
          view={view}
        >
          {children}
        </LayoutManager>
      </NavigationAnalyticsContext>
    );
  }
}

const AsyncLayoutManagerWithView = (
  // eslint-disable-next-line no-undef
  props,
) => (
  <ViewControllerSubscriber>
    {({ state: { activeView } }) => {
      return (
        <AsyncLayoutManagerWithViewControllerBase
          view={activeView}
          {...props}
        />
      );
    }}
  </ViewControllerSubscriber>
);

export default withNavigationUIController(AsyncLayoutManagerWithView);
