import React, { Component, Fragment } from 'react';

import deepEqual from 'react-fast-compare';

import { N30, N40A } from '@atlaskit/theme/colors';

import {
  CONTENT_NAV_WIDTH_COLLAPSED,
  GLOBAL_NAV_WIDTH,
} from '../../../common/constants';
import { Shadow } from '../../../common/primitives';
import { light, ThemeProvider } from '../../../theme';
import ContentNavigation from '../ContentNavigation';
import { ContentNavigationWrapper } from '../ContentNavigation/primitives';
import { isTransitioning } from '../ResizeTransition';

export class ComposedContainerNavigation extends Component {
  shouldComponentUpdate(nextProps) {
    const { props } = this;
    return !deepEqual(props, nextProps);
  }

  render() {
    const {
      containerNavigation,
      datasets,
      // eslint-disable-next-line camelcase
      experimental_flyoutOnHover: EXPERIMENTAL_FLYOUT_ON_HOVER,
      // eslint-disable-next-line camelcase
      experimental_hideNavVisuallyOnCollapse: EXPERIMENTAL_HIDE_NAV_VISUALLY_ON_COLLAPSE,
      productNavigation,
      transitionState,
      transitionStyle,
      isCollapsed,
      isResizing,
      getNavRef,
      expand,
      view,
    } = this.props;

    const isVisible = transitionState !== 'exited';
    const shouldDisableInteraction =
      isResizing || isTransitioning(transitionState);

    const dataset = datasets ? datasets.contextualNavigation : {};

    return (
      <ContentNavigationWrapper
        key="product-nav-wrapper"
        innerRef={getNavRef}
        disableInteraction={shouldDisableInteraction}
        style={transitionStyle}
        {...dataset}
      >
        <ContentNavigation
          container={containerNavigation}
          isVisible={isVisible}
          key="product-nav"
          product={productNavigation}
          experimental_hideNavVisuallyOnCollapse={
            EXPERIMENTAL_HIDE_NAV_VISUALLY_ON_COLLAPSE
          }
          view={view}
        />
        {isCollapsed && !EXPERIMENTAL_FLYOUT_ON_HOVER ? (
          /* eslint-disable jsx-a11y/click-events-have-key-events */
          <div
            aria-label="Click to expand the navigation"
            role="button"
            onClick={expand}
            css={{
              cursor: 'pointer',
              height: '100%',
              outline: 0,
              position: 'absolute',
              transition: 'background-color 100ms',
              width: CONTENT_NAV_WIDTH_COLLAPSED,

              ':hover': {
                backgroundColor: containerNavigation
                  ? N30
                  : 'rgba(255, 255, 255, 0.08)',
              },
              ':active': {
                backgroundColor: N40A,
              },
            }}
            tabIndex={-1}
          />
        ) : /* eslint-enable */
        null}
      </ContentNavigationWrapper>
    );
  }
}

// Shallow comparision of props is sufficeint in this case
export class ComposedGlobalNavigation extends Component {
  render() {
    const {
      containerNavigation,
      datasets,
      globalNavigation: GlobalNavigation,
      topOffset,
      shouldHideGlobalNavShadow,
      // eslint-disable-next-line camelcase
      experimental_alternateFlyoutBehaviour: EXPERIMENTAL_ALTERNATE_FLYOUT_BEHAVIOUR,
      closeFlyout,
    } = this.props;

    const dataset = datasets ? datasets.globalNavigation : {};

    return (
      // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
      <div
        {...dataset}
        onMouseOver={
          // eslint-disable-next-line no-undef
          EXPERIMENTAL_ALTERNATE_FLYOUT_BEHAVIOUR ? closeFlyout : null
        }
      >
        <ThemeProvider
          theme={(theme) => ({
            topOffset,
            mode: light, // If no theme already exists default to light mode
            ...theme,
          })}
        >
          <Fragment>
            {!shouldHideGlobalNavShadow && (
              <Shadow
                isBold={!!containerNavigation}
                isOverDarkBg
                style={{ marginLeft: GLOBAL_NAV_WIDTH }}
              />
            )}
            {/* eslint-disable-next-line react/jsx-no-undef */}
            <GlobalNavigation />
          </Fragment>
        </ThemeProvider>
      </div>
    );
  }
}
