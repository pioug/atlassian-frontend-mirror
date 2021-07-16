import React, { Component, Fragment } from 'react';

import deepEqual from 'react-fast-compare';
import Transition from 'react-transition-group/Transition';

import { NavigationAnalyticsContext } from '@atlaskit/analytics-namespaced-context';

import { transitionDurationMs } from '../../../common/constants';

import { ContainerNavigation, ProductNavigation } from './primitives';

const ToggleContent = ({
  isVisible,
  experimental_hideNavVisuallyOnCollapse: EXPERIMENTAL_HIDE_NAV_VISUALLY_ON_COLLAPSE,
  ...rest
}) => {
  // If FF is false, retain the old behaviour of
  // un-mounting navigation components on collapse
  if (!EXPERIMENTAL_HIDE_NAV_VISUALLY_ON_COLLAPSE && !isVisible) {
    return null;
  }

  return <Fragment {...rest} />;
};

const productNavigationAnalytics = {
  attributes: {
    navigationLayer: 'product',
  },
};

const containerNavigationAnalytics = {
  attributes: {
    navigationLayer: 'container',
  },
};

export default class ContentNavigation extends Component {
  _isMounted = false;

  state = {
    cachedContainer: null,
  };

  componentDidMount() {
    this._isMounted = true;
  }

  shouldComponentUpdate(nextProps) {
    const { props } = this;
    return !deepEqual(props, nextProps);
  }

  static getDerivedStateFromProps({ container }, state) {
    if (container && container !== state.cachedContainer) {
      // We cache the most recent container component in state so that we can
      // render it while the container layer is transitioning out, which is
      // triggered by setting the container prop to null.
      return { ...state, cachedContainer: container };
    }
    return null;
  }

  render() {
    const {
      container,
      isVisible,
      product: Product,
      experimental_hideNavVisuallyOnCollapse: EXPERIMENTAL_HIDE_NAV_VISUALLY_ON_COLLAPSE,
    } = this.props;
    const { cachedContainer: CachedContainer } = this.state;

    const shouldRenderContainer = Boolean(container);
    const ContainerComponent = CachedContainer || Fragment;

    return (
      <Fragment>
        <ProductNavigation isVisible={isVisible}>
          <ToggleContent
            experimental_hideNavVisuallyOnCollapse={
              EXPERIMENTAL_HIDE_NAV_VISUALLY_ON_COLLAPSE
            }
            isVisible={isVisible}
          >
            <NavigationAnalyticsContext data={productNavigationAnalytics}>
              <Product />
            </NavigationAnalyticsContext>
          </ToggleContent>
        </ProductNavigation>
        <Transition
          in={shouldRenderContainer}
          timeout={this._isMounted ? transitionDurationMs : 0}
          mountOnEnter
          unmountOnExit
        >
          {(state) => (
            <ContainerNavigation
              isEntering={state === 'entering'}
              isExiting={state === 'exiting'}
              isVisible={isVisible}
            >
              <ToggleContent
                experimental_hideNavVisuallyOnCollapse={
                  EXPERIMENTAL_HIDE_NAV_VISUALLY_ON_COLLAPSE
                }
                isVisible={isVisible}
              >
                <NavigationAnalyticsContext data={containerNavigationAnalytics}>
                  <ContainerComponent />
                </NavigationAnalyticsContext>
              </ToggleContent>
            </ContainerNavigation>
          )}
        </Transition>
      </Fragment>
    );
  }
}
