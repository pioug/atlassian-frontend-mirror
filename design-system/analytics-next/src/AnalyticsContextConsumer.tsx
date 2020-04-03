import React from 'react';
import PropTypes from 'prop-types';

import {
  CreateEventMap,
  CreateUIAnalyticsEvent,
  AnalyticsEventCreator,
} from './types';
import UIAnalyticsEvent from './UIAnalyticsEvent';
import { AnalyticsEventPayload } from './AnalyticsEvent';

export interface AnalyticsContextConsumerProps<Props> {
  children: (props: {
    createAnalyticsEvent: CreateUIAnalyticsEvent;
    patchedEventProps: CreateEventMap;
  }) => React.ReactNode;
  createEventMap: CreateEventMap;
  wrappedComponentProps: Props;
}

/**
 * This component is used to grab the analytics functions off context.
 * It uses legacy context, but provides an API similar to 16.3 context.
 * This makes it easier to use with the forward ref API.
 */
class AnalyticsContextConsumer<
  Props extends Record<string, any>
> extends React.Component<AnalyticsContextConsumerProps<Props>> {
  static contextTypes = {
    getAtlaskitAnalyticsEventHandlers: PropTypes.func,
    getAtlaskitAnalyticsContext: PropTypes.func,
  };

  static defaultProps = {
    createEventMap: {},
  };

  /**
   * Store references to the original and patched event props so we can
   * determine when to update the patched props
   */
  originalEventProps: CreateEventMap = {};
  patchedEventProps: CreateEventMap = {};

  constructor(props: AnalyticsContextConsumerProps<Props>) {
    super(props);

    Object.keys(this.props.createEventMap).forEach(p => {
      this.originalEventProps[p] = props.wrappedComponentProps[p];
    });

    this.patchedEventProps = this.mapCreateEventsToProps(
      Object.keys(this.props.createEventMap),
      props.wrappedComponentProps,
    );
  }

  // Update patched event props only if the original props have changed
  updatePatchedEventProps = (props: Props) => {
    const changedPropCallbacks = Object.keys(this.props.createEventMap).filter(
      p => this.originalEventProps[p] !== props[p],
    );
    if (changedPropCallbacks.length > 0) {
      this.patchedEventProps = {
        ...this.patchedEventProps,
        ...this.mapCreateEventsToProps(changedPropCallbacks, props),
      };
      changedPropCallbacks.forEach(p => {
        this.originalEventProps[p] = props[p];
      });
    }

    return this.patchedEventProps;
  };

  mapCreateEventsToProps = (changedPropNames: string[], props: Props) =>
    changedPropNames.reduce((modified, propCallbackName) => {
      const eventCreator = this.props.createEventMap[propCallbackName];
      const providedCallback = props[propCallbackName];

      if (!['object', 'function'].includes(typeof eventCreator)) {
        return modified;
      }

      const modifiedCallback = (...args: any[]) => {
        const analyticsEvent =
          typeof eventCreator === 'function'
            ? (eventCreator as AnalyticsEventCreator)(
                this.createAnalyticsEvent,
                props,
              )
            : this.createAnalyticsEvent(eventCreator);

        if (providedCallback) {
          providedCallback(...args, analyticsEvent);
        }
      };

      return {
        ...modified,
        [propCallbackName]: modifiedCallback,
      };
    }, {});

  createAnalyticsEvent = (payload: AnalyticsEventPayload): UIAnalyticsEvent => {
    const {
      getAtlaskitAnalyticsEventHandlers,
      getAtlaskitAnalyticsContext,
    } = this.context;

    return new UIAnalyticsEvent({
      context:
        (typeof getAtlaskitAnalyticsContext === 'function' &&
          getAtlaskitAnalyticsContext()) ||
        [],
      handlers:
        (typeof getAtlaskitAnalyticsEventHandlers === 'function' &&
          getAtlaskitAnalyticsEventHandlers()) ||
        [],
      payload,
    });
  };

  render() {
    const patchedEventProps = this.updatePatchedEventProps(
      this.props.wrappedComponentProps,
    );

    return this.props.children({
      createAnalyticsEvent: this.createAnalyticsEvent,
      patchedEventProps,
    });
  }
}

export default AnalyticsContextConsumer;
