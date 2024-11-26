import { useCallback, useMemo } from 'react';

import { type JsonLd } from 'json-ld-types';

import { useSmartLinkContext } from '@atlaskit/link-provider';
import {
	ACTION_RESOLVING,
	ACTION_UPDATE_METADATA_STATUS,
	cardAction,
	type MetadataStatus,
} from '@atlaskit/linking-common';
import { auth, type AuthError } from '@atlaskit/outbound-auth-flow-client';
import { fg } from '@atlaskit/platform-feature-flags';

import { useAnalyticsEvents } from '../../common/analytics/generated/use-analytics-events';
import { SmartLinkStatus } from '../../constants';
import { type InvokeClientOpts, type InvokeServerOpts } from '../../model/invoke-opts';
import { type CardInnerAppearance } from '../../view/Card/types';
import { type AnalyticsFacade } from '../analytics';
import { getByDefinitionId, getDefinitionId, getExtensionKey, getServices } from '../helpers';
import useInvokeClientAction from '../hooks/use-invoke-client-action';
import useResolve from '../hooks/use-resolve';

export const useSmartCardActions = (id: string, url: string, analytics: AnalyticsFacade) => {
	const resolveUrl = useResolve();
	const invokeClientAction = useInvokeClientAction({ analytics });
	const { fireEvent } = useAnalyticsEvents();

	const { store } = useSmartLinkContext();
	const { getState, dispatch } = store;

	const getSmartLinkState = useCallback(() => {
		const { details, status, metadataStatus } = getState()[url] ?? {
			status: SmartLinkStatus.Pending,
		};
		return { details, status, metadataStatus };
	}, [getState, url]);

	const setMetadataStatus = useCallback(
		(metadataStatus: MetadataStatus) => {
			dispatch(
				cardAction(ACTION_UPDATE_METADATA_STATUS, { url }, undefined, undefined, metadataStatus),
			);
		},
		[dispatch, url],
	);

	const resolve = useCallback(
		async (resourceUrl = url, isReloading = false, isMetadataRequest = false) =>
			resolveUrl(resourceUrl, isReloading, isMetadataRequest, id),
		[id, resolveUrl, url],
	);

	const register = useCallback(() => {
		const { details } = getSmartLinkState();
		if (!details) {
			dispatch(cardAction(ACTION_RESOLVING, { url }));
			setMetadataStatus('pending');
		}
		return resolve();
	}, [getSmartLinkState, resolve, dispatch, url, setMetadataStatus]);

	const reload = useCallback(() => {
		const { details } = getSmartLinkState();
		const definitionId = getDefinitionId(details);
		if (definitionId) {
			getByDefinitionId(definitionId, getState()).map((url) => resolve(url, true));
		} else {
			resolve(url, true);
		}
	}, [getSmartLinkState, url, getState, resolve]);

	const loadMetadata = useCallback(() => {
		const { metadataStatus } = getSmartLinkState();
		//metadataStatus will be undefined for SSR links only
		if (metadataStatus === undefined) {
			setMetadataStatus('pending');
			return resolve(url, false, true);
		}
	}, [getSmartLinkState, resolve, setMetadataStatus, url]);

	const authorize = useCallback(
		(appearance: CardInnerAppearance) => {
			const { details, status } = getSmartLinkState();
			const definitionId = getDefinitionId(details);
			const extensionKey = getExtensionKey(details);
			const services = getServices(details);
			// When authentication is triggered, let GAS know!
			if (status === 'unauthorized') {
				analytics.ui.authEvent({
					display: appearance,
					definitionId,
					extensionKey,
				});
			}
			if (status === 'forbidden') {
				analytics.ui.authAlternateAccountEvent({
					display: appearance,
					definitionId,
					extensionKey,
				});
			}
			if (services.length > 0) {
				if (fg('platform_smart-card-migrate-screen-analytics')) {
					fireEvent('screen.consentModal.viewed', {
						definitionId: definitionId ?? null,
					});
				} else {
					analytics.screen.authPopupEvent({ definitionId, extensionKey });
				}
				auth(services[0].url).then(
					() => {
						fireEvent('track.applicationAccount.connected', {
							definitionId: definitionId ?? null,
						});
						analytics.operational.connectSucceededEvent({
							id,
							definitionId,
							extensionKey,
						});
						reload();
					},
					(err: AuthError) => {
						analytics.operational.connectFailedEvent({
							id,
							definitionId,
							extensionKey,
							reason: err.type,
						});
						if (err.type === 'auth_window_closed') {
							analytics.ui.closedAuthEvent({
								display: appearance,
								definitionId,
								extensionKey,
							});
						}
						reload();
					},
				);
			}
		},
		[
			getSmartLinkState,
			analytics.ui,
			analytics.screen,
			analytics.operational,
			id,
			reload,
			fireEvent,
		],
	);

	const invoke = useCallback(
		async (
			opts: InvokeClientOpts | InvokeServerOpts,
			appearance: CardInnerAppearance,
		): Promise<JsonLd.Response | void> => {
			const { key, action } = opts;
			const source = opts.source || appearance;
			if (opts.type === 'client') {
				return await invokeClientAction({
					actionFn: opts.action.promise,
					actionType: action.type,
					display: source,
					extensionKey: key,
				});
			}
		},
		[invokeClientAction],
	);

	return useMemo(
		() => ({
			register,
			reload,
			authorize,
			invoke,
			loadMetadata,
		}),
		[register, reload, authorize, invoke, loadMetadata],
	);
};
