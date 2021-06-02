import { MiddlewareAPI, Dispatch, Action } from 'redux';
import pick from 'lodash/pick';

import {
  UIAnalyticsEvent,
  UIAnalyticsEventHandler,
} from '@atlaskit/analytics-next';

import {
  ANALYTICS_MEDIA_CHANNEL,
  MediaFeatureFlags,
} from '@atlaskit/media-common';

import analyticsActionHandlers from './analyticsHandlers';
import { State } from '../domain';
import { AnalyticsEventPayload } from '../../types';
import { getPackageAttributes } from '../../util/analytics';

const COMPONENT_NAME = 'popup';

const createAndFireAnalyticsEvent = (
  handlers: UIAnalyticsEventHandler[],
  payload: AnalyticsEventPayload,
  featureFlags?: MediaFeatureFlags,
) => {
  const {
    packageName,
    packageVersion,
    componentName,
    component,
  } = getPackageAttributes(COMPONENT_NAME);

  new UIAnalyticsEvent({
    context: [
      {
        packageName,
        packageVersion,
        componentName,
        component,
        attributes: {
          featureFlags: pick(featureFlags, [
            'newCardExperience',
            'folderUploads',
          ]),
        },
      },
    ],
    handlers,
    payload,
  }).fire(ANALYTICS_MEDIA_CHANNEL);
};

export default (store: MiddlewareAPI<State>) => (next: Dispatch<State>) => (
  action: Action,
) => {
  const { featureFlags, proxyReactContext } = store.getState().config;

  if (
    proxyReactContext &&
    proxyReactContext.getAtlaskitAnalyticsEventHandlers
  ) {
    const atlaskitAnalyticsEventHandlers = proxyReactContext.getAtlaskitAnalyticsEventHandlers();

    for (const handler of analyticsActionHandlers) {
      const payloads = handler(action, store) || [];
      payloads.forEach((payload) =>
        createAndFireAnalyticsEvent(
          atlaskitAnalyticsEventHandlers,
          payload,
          featureFlags,
        ),
      );
    }
  }

  return next(action);
};
