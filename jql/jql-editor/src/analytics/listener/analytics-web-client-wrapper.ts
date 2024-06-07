/**
 * Copied from https://bitbucket.org/atlassian/atlassian-frontend/src/master/packages/analytics/analytics-listeners/src/analytics-web-client-wrapper.ts
 * In future if this package is migrated into the Atlassian Frontend repo, then this code and related logic should be
 * moved into @atlaskit/analytics-listeners.
 */

import {
	type GasPayload,
	type GasPurePayload,
	type GasPureScreenEventPayload,
	type GasScreenEventPayload,
} from '@atlaskit/analytics-gas-types';

import type Logger from './helpers/logger';
import { type AnalyticsWebClient } from './types';

const isPromise = (c: any): c is Promise<AnalyticsWebClient> => {
	return typeof c.then === 'function';
};

export const sendEvent =
	(logger: Logger, client?: AnalyticsWebClient | Promise<AnalyticsWebClient>) =>
	(event: GasPayload | GasScreenEventPayload): void => {
		if (client) {
			const gasEvent = {
				...event,
			};
			/*
      Merging this ts-ignore is not going to affect the type definitions of the package
      there's a whole lot more wrong going on here than just this delete.
      All the send methods on the client take a GasPurePayload object which requires actionSubject
      actionSubject is missing on GasPayload | GasScreenEventPayload
    */
			// @ts-ignore mergeable @fixme TypeScript 4.2.4 upgrade
			delete gasEvent.eventType;

			const withClient = (cb: (analyticsClient: AnalyticsWebClient) => void) => {
				if (isPromise(client)) {
					client.then(cb).catch((e) => logger.warn('There was an error sending the event', e));
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
					logger.debug('Sending Operational Event via analytics client', gasEvent);
					withClient((client) => client.sendOperationalEvent(gasEvent as GasPurePayload));
					break;

				case 'track':
					logger.debug('Sending Track Event via analytics client', gasEvent);
					withClient((client) => client.sendTrackEvent(gasEvent as GasPurePayload));
					break;

				case 'screen':
					logger.debug('Sending Screen Event via analytics client', gasEvent);
					withClient((client) => client.sendScreenEvent(gasEvent as GasPureScreenEventPayload));
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
