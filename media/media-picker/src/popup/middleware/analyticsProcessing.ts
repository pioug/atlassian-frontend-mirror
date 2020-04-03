import { MiddlewareAPI, Dispatch, Action } from 'redux';
import {
  UIAnalyticsEvent,
  UIAnalyticsEventHandler,
} from '@atlaskit/analytics-next';

import { State } from '../domain';
import { version, name } from '../../version.json';

import analyticsActionHandlers, { Payload } from './analyticsHandlers';
import { ANALYTICS_MEDIA_CHANNEL } from '../../components/media-picker-analytics-error-boundary';

// TODO https://product-fabric.atlassian.net/browse/MS-598

const createAndFire = (
  payload: Payload,
  handlers: UIAnalyticsEventHandler[],
) => {
  new UIAnalyticsEvent({
    context: [{}],
    handlers,
    payload: {
      ...payload,
      attributes: {
        ...payload.attributes,
        componentName: 'mediaPicker',
        packageName: name,
        componentVersion: version,
      },
    },
  }).fire(ANALYTICS_MEDIA_CHANNEL);
};

export default (store: MiddlewareAPI<State>) => (next: Dispatch<State>) => (
  action: Action,
) => {
  const proxyReactContext = store.getState().config.proxyReactContext;

  if (
    proxyReactContext &&
    proxyReactContext.getAtlaskitAnalyticsEventHandlers
  ) {
    const atlaskitAnalyticsEventHandlers = proxyReactContext.getAtlaskitAnalyticsEventHandlers();

    for (const handler of analyticsActionHandlers) {
      const payloads = handler(action, store) || [];
      payloads.forEach(payload =>
        createAndFire(payload, atlaskitAnalyticsEventHandlers),
      );
    }
  }

  return next(action);
};
