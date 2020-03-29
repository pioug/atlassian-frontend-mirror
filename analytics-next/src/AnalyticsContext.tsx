import React, { Children, Component } from 'react';
import PropTypes from 'prop-types';
import { AnalyticsReactContext } from './AnalyticsReactContext';

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

interface State {
  getAtlaskitAnalyticsContext: () => any[];
  getAtlaskitAnalyticsEventHandlers: () => any[];
}

class AnalyticsContext extends Component<Props, State> {
  static contextTypes = ContextTypes;
  static childContextTypes = ContextTypes;

  constructor(props: Props) {
    super(props);
    this.state = {
      getAtlaskitAnalyticsContext: this.getAnalyticsContext,
      getAtlaskitAnalyticsEventHandlers: this.getAnalyticsEventHandlers,
    };
  }

  getChildContext = () => ({
    getAtlaskitAnalyticsContext: this.getAnalyticsContext,
  });

  getAnalyticsContext = () => {
    const { data } = this.props;
    const { getAtlaskitAnalyticsContext } = this.context;
    const ancestorData =
      (typeof getAtlaskitAnalyticsContext === 'function' &&
        getAtlaskitAnalyticsContext()) ||
      [];

    return [...ancestorData, data];
  };

  getAnalyticsEventHandlers = () => {
    const { getAtlaskitAnalyticsEventHandlers } = this.context;
    const ancestorHandlers =
      (typeof getAtlaskitAnalyticsEventHandlers === 'function' &&
        getAtlaskitAnalyticsEventHandlers()) ||
      [];
    return ancestorHandlers;
  };

  render() {
    const { children } = this.props;
    return (
      <AnalyticsReactContext.Provider value={this.state}>
        {Children.only(children)}
      </AnalyticsReactContext.Provider>
    );
  }
}

export default AnalyticsContext;
