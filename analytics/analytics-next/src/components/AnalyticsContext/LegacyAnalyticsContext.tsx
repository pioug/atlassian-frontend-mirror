import React, { Component } from 'react';

import PropTypes from 'prop-types';

import {
  default as AnalyticsReactContext,
  AnalyticsReactContextInterface,
} from '@atlaskit/analytics-next-stable-react-context';

const ContextTypes = {
  getAtlaskitAnalyticsContext: PropTypes.func,
  getAtlaskitAnalyticsEventHandlers: PropTypes.func,
};

interface Props {
  /** Children! */
  children: React.ReactNode;
  /** Arbitrary data. Any events created below this component in the tree will
   * have this added as an item in their context array. */
  data: Object;
}

const noop = () => [];

// eslint-disable-next-line @repo/internal/react/no-class-components
class AnalyticsContext extends Component<
  Props,
  AnalyticsReactContextInterface
> {
  static contextTypes = ContextTypes;
  static childContextTypes = ContextTypes;

  contextValue: AnalyticsReactContextInterface;

  constructor(props: Props) {
    super(props);

    this.contextValue = {
      getAtlaskitAnalyticsContext: this.getAnalyticsContext,
      getAtlaskitAnalyticsEventHandlers: this.getAnalyticsEventHandlers,
    };
  }

  getChildContext = () => ({
    getAtlaskitAnalyticsContext: this.getAnalyticsContext,
  });

  getAnalyticsContext = () => {
    const { data } = this.props;
    const { getAtlaskitAnalyticsContext = noop } = this.context;
    return [...getAtlaskitAnalyticsContext(), data];
  };

  getAnalyticsEventHandlers = () => {
    const { getAtlaskitAnalyticsEventHandlers = noop } = this.context;
    return getAtlaskitAnalyticsEventHandlers();
  };

  render() {
    const { children } = this.props;

    return (
      <AnalyticsReactContext.Provider value={this.contextValue}>
        {children}
      </AnalyticsReactContext.Provider>
    );
  }
}

export default AnalyticsContext;
