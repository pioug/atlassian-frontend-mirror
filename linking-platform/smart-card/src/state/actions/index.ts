import { useCallback, useMemo } from 'react';

import FeatureGates from '@atlaskit/feature-gate-js-client';
import { type JsonLd } from '@atlaskit/json-ld-types';
import { useSmartLinkContext } from '@atlaskit/link-provider';
import {
	ACTION_RESOLVING,
	ACTION_UPDATE_METADATA_STATUS,
	cardAction,
	type MetadataStatus,
} from '@atlaskit/linking-common';
import { auth, type AuthError } from '@atlaskit/outbound-auth-flow-client';

import { useAnalyticsEvents } from '../../common/analytics/generated/use-analytics-events';
import { SmartLinkStatus } from '../../constants';
import { type InvokeClientOpts, type InvokeServerOpts } from '../../model/invoke-opts';
import {
	AUTH_WINDOW_HEIGHT,
	AUTH_WINDOW_WIDTH,
	getWindowOpenFeatures,
} from '../../utils/window-open-features';
import { type CardInnerAppearance } from '../../view/Card/types';
import { startUfoExperience } from '../analytics';
import { getByDefinitionId, getDefinitionId, getExtensionKey, getServices } from '../helpers';
import useInvokeClientAction from '../hooks/use-invoke-client-action';
import useResolve from '../hooks/use-resolve';

export const useSmartCardActions = (id: string, url: string) => {
	const resolveUrl = useResolve();
	const invokeClientAction = useInvokeClientAction({});
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
			// @ts-ignore - Workaround for help-center local consumption

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
				fireEvent('ui.button.clicked.connectAccount', {
					display: appearance,
					definitionId: definitionId ?? null,
				});
			}
			if (status === 'forbidden') {
				fireEvent('ui.smartLink.clicked.tryAnotherAccount', {
					display: appearance,
					definitionId: definitionId ?? null,
				});
			}
			if (services.length > 0) {
				fireEvent('screen.consentModal.viewed', {
					definitionId: definitionId ?? null,
				});

				const shouldShowInPopupWindow =
					status === 'unauthorized' &&
					FeatureGates.getExperimentValue<'control' | 'test'>(
						'platform_sl_3p_auth_window_experiment',
						'cohort',
						'control',
					) === 'test';
				const windowFeatures = shouldShowInPopupWindow
					? getWindowOpenFeatures(AUTH_WINDOW_HEIGHT, AUTH_WINDOW_WIDTH)
					: undefined;
				auth(services[0].url, windowFeatures).then(
					() => {
						fireEvent('track.applicationAccount.connected', {
							definitionId: definitionId ?? null,
						});
						startUfoExperience('smart-link-authenticated', id, {
							extensionKey,
							status: 'success',
						});
						fireEvent('operational.smartLink.connectSucceeded', {
							definitionId: definitionId ?? null,
						});

						reload();
					},
					(err: AuthError) => {
						startUfoExperience('smart-link-authenticated', id, {
							extensionKey,
							status: err.type,
						});
						fireEvent('operational.smartLink.connectFailed', {
							definitionId: definitionId ?? null,
							reason: err.type ?? null,
						});
						if (err.type === 'auth_window_closed') {
							fireEvent('ui.consentModal.closed', {
								display: appearance,
								definitionId: definitionId ?? null,
							});
						}
						reload();
					},
				);
			}
		},
		[getSmartLinkState, id, reload, fireEvent],
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
