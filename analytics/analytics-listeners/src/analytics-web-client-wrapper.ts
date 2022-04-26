import { AnalyticsWebClient } from './types';
import {
  GasPayload,
  GasScreenEventPayload,
  GasPureScreenEventPayload,
  GasPurePayload,
} from '@atlaskit/analytics-gas-types';
import Logger from './helpers/logger';

const isPromise = (c: any): c is Promise<AnalyticsWebClient> => {
  return typeof c.then === 'function';
};

type GasEvent = GasPayload | GasScreenEventPayload;

export const sendEvent = (
  logger: Logger,
  client?: AnalyticsWebClient | Promise<AnalyticsWebClient>,
) => (event: GasEvent): void => {
  if (client) {
    const { eventType, ...gasEvent } = event;

    const withClient = (cb: (analyticsClient: AnalyticsWebClient) => void) => {
      if (isPromise(client)) {
        client
          .then(cb)
          .catch((e) => logger.warn('There was an error sending the event', e));
      } else {
        try {
          cb(client);
        } catch (e) {
          logger.warn('There was an error sending the event', e);
        }
      }
    };

    switch (event.eventType) {
      case 'ui':
        logger.debug('Sending UI Event via analytics client', gasEvent);
        withClient((client) => client.sendUIEvent(gasEvent as GasPurePayload));
        break;

      case 'operational':
        logger.debug(
          'Sending Operational Event via analytics client',
          gasEvent,
        );
        withClient((client) =>
          client.sendOperationalEvent(gasEvent as GasPurePayload),
        );
        break;

      case 'track':
        logger.debug('Sending Track Event via analytics client', gasEvent);
        withClient((client) =>
          client.sendTrackEvent(gasEvent as GasPurePayload),
        );
        break;

      case 'screen':
        logger.debug('Sending Screen Event via analytics client', gasEvent);
        withClient((client) =>
          client.sendScreenEvent(gasEvent as GasPureScreenEventPayload),
        );
        break;

      default:
        logger.error(
          `cannot map eventType ${event.eventType} to an analytics-web-client function`,
        );
    }
  } else {
    logger.warn('AnalyticsWebClient instance is not provided');
  }
};
