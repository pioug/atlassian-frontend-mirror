import React, { Component } from 'react';

import PropTypes from 'prop-types';

import {
  default as AnalyticsReactContext,
  AnalyticsReactContextInterface,
} from '@atlaskit/analytics-next-stable-react-context';

import UIAnalyticsEvent, {
  UIAnalyticsEventHandler,
} from '../../events/UIAnalyticsEvent';

type Props = {
  /** Children! */
  children?: React.ReactNode;
  /** The channel to listen for events on. */
  channel?: string;
  /** A function which will be called when an event is fired on this Listener's
   * channel. It is passed the event and the channel as arguments. */
  onEvent: (event: UIAnalyticsEvent, channel?: string) => void;
};

const ContextTypes = {
  getAtlaskitAnalyticsEventHandlers: PropTypes.func,
  getAtlaskitAnalyticsContext: PropTypes.func,
};

const noop = () => [];

// eslint-disable-next-line @repo/internal/react/no-class-components
class AnalyticsListener extends Component<Props> {
  static contextTypes = ContextTypes;
  static childContextTypes = ContextTypes;

  contextValue: AnalyticsReactContextInterface;

  constructor(props: Props) {
    super(props);

    this.contextValue = {
      getAtlaskitAnalyticsContext: this.getAtlaskitAnalyticsContext,
      getAtlaskitAnalyticsEventHandlers: this.getAnalyticsEventHandlers,
    };
  }

  getChildContext = () => ({
    getAtlaskitAnalyticsEventHandlers: this.getAnalyticsEventHandlers,
    getAtlaskitAnalyticsContext: this.getAtlaskitAnalyticsContext,
  });

  getAnalyticsEventHandlers = () => {
    const { channel, onEvent } = this.props;
    const { getAtlaskitAnalyticsEventHandlers = noop } = this.context;

    const handler: UIAnalyticsEventHandler = (event, eventChannel) => {
      if (channel === '*' || channel === eventChannel) {
        onEvent(event, eventChannel);
      }
    };

    return [handler, ...getAtlaskitAnalyticsEventHandlers()];
  };

  getAtlaskitAnalyticsContext = () => {
    const { getAtlaskitAnalyticsContext = noop } = this.context;
    return getAtlaskitAnalyticsContext();
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

export default AnalyticsListener;
