import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Gateway, GatewayRegistry } from './gateway';
import Portal from './Portal';
import withContextFromProps from './withContextFromProps';

export default function withRenderTarget(
  { target, withTransitionGroup },
  WrappedComponent,
) {
  // Access the analytics context types so we can provide them across portal boundaries
  // until we can support React 16 where it can be provided natively
  const analyticsContextTypes = {
    // Old analytics keys
    onAnalyticsEvent: PropTypes.func,
    getParentAnalyticsData: PropTypes.func,
    // New analytics-next keys,
    getAtlaskitAnalyticsContext: PropTypes.func,
    getAtlaskitAnalyticsEventHandlers: PropTypes.func,
  };

  // These context types have been copied from jira-frontend to temporarily fix context issues for jira-frontend with other
  // layer-manager rendered components like flag - AK-4281
  const jiraContextTypes = {
    // For react-redux
    store: PropTypes.object,
    // For react-intl
    intl: PropTypes.object,
    // For common/analytics/analytics-provider
    triggerAnalytics: PropTypes.func,
    // For portfolio/common/view-awesome/validation/form/connect-to-form
    internalFormContext: PropTypes.object,
    // For board-v2/column/column-create/column-create-form
    validateColumn: PropTypes.func,
    // For board-v2/column/column-header/column-header
    createColumnMenu: PropTypes.func,
    // For board-v2/column/draggable-column/draggable-column
    getScrollTop: PropTypes.func,
    // For board/view/components/done-issues-button/done-issues-button
    configuration: PropTypes.object,
    // For board/view/components/drag-handle/drag-handle
    getDraggableOriginCenterPos: PropTypes.func,
    // For board/view/components/drag-handle/drag-handle
    getDraggableTranslatedCenterPos: PropTypes.func,
    // For common/components/profilecard/profilecard-view
    akProfileClient: PropTypes.object,
    // For common/components/profilecard/profilecard-view
    cloudId: PropTypes.string,
    // For common/engagement/with-engagement
    subscribeEngagementState: PropTypes.func,
    // For navigation/view/navigation-group-item/index
    perfMetricsStart: PropTypes.func,
    // For navigation/view/onboarding/components/onboarding-manager
    spotlightRegistry: PropTypes.object,
    // For navigation/view/project-header/index
    slideRight: PropTypes.func,
    // For portfolio/common/view/components/tree-table/view/details/index
    consumerStore: PropTypes.object,
    // For portfolio/page-plan/view-awesome/main/planning/schedule/schedule/lane/bar/index-dumb
    onBarSelected: PropTypes.func,
  };

  const portalledContextTypes = {
    ...analyticsContextTypes,
    ...jiraContextTypes,
  };

  const ContextProvider = withContextFromProps(portalledContextTypes, null);

  // eslint-disable-next-line react/prefer-stateless-function
  return class extends Component {
    gatewayOrPortalChildRef;

    static contextTypes = {
      gatewayRegistry: PropTypes.instanceOf(GatewayRegistry),
      blockChildGatewayRender: PropTypes.bool,
      ...analyticsContextTypes,
      ...jiraContextTypes,
    };

    getWrappedComponentRef = ref => {
      this.gatewayOrPortalChildRef = ref;
    };

    render() {
      const { gatewayRegistry, ...portalledContext } = this.context;
      const GatewayOrPortal = gatewayRegistry ? Gateway : Portal;

      return (
        <GatewayOrPortal
          id={process.env.NODE_ENV === 'test' ? 'gateway-or-portal' : ''}
          into={target}
          withTransitionGroup={withTransitionGroup}
          shouldBlockRender={this.context.blockChildGatewayRender}
        >
          <ContextProvider {...portalledContext}>
            <WrappedComponent
              ref={this.getWrappedComponentRef}
              {...this.props}
            />
          </ContextProvider>
        </GatewayOrPortal>
      );
    }
  };
}
