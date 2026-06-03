import { useCallback, useMemo, useRef } from 'react';

import { type JsonLd } from '@atlaskit/json-ld-types';
import { extractSmartLinkProvider } from '@atlaskit/link-extractors';
import { useSmartLinkContext } from '@atlaskit/link-provider';
import {
	ACTION_RESOLVING,
	ACTION_UPDATE_METADATA_STATUS,
	cardAction,
	type MetadataStatus,
} from '@atlaskit/linking-common';
import { auth, type AuthError } from '@atlaskit/outbound-auth-flow-client';
import { fg } from '@atlaskit/platform-feature-flags';
import { functionWithFG } from '@atlaskit/platform-feature-flags-react';
import { ROVO_POST_MESSAGE_EVENT_TYPE } from '@atlaskit/rovo-triggers/post-message-to-pubsub';
import { type ChatNewPayload } from '@atlaskit/rovo-triggers/types';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import { useAnalyticsEvents } from '../../common/analytics/generated/use-analytics-events';
import { SmartLinkStatus } from '../../constants';
import { type InvokeClientOpts, type InvokeServerOpts } from '../../model/invoke-opts';
import { noop } from '../../utils';
import { getIsRovoChatEnabled } from '../../utils/rovo';
import { type CardInnerAppearance } from '../../view/Card/types';
import { startUfoExperience } from '../analytics';
import { getByDefinitionId, getDefinitionId, getExtensionKey, getServices } from '../helpers';
import useActionFlags from '../hooks/use-action-flags';
import useInvokeClientAction from '../hooks/use-invoke-client-action';
import useResolve from '../hooks/use-resolve';

const POST_AUTH_CHAT_EXTENSION_KEY = 'google-object-provider';

const SMART_LINK_TO_ROVO_SOURCE = 'smart-link';

const getPostAuthChatPayloadId = () => {
	if (typeof crypto !== 'undefined') {
		if (typeof crypto.randomUUID === 'function') {
			return crypto.randomUUID();
		}

		if (typeof crypto.getRandomValues === 'function') {
			const values = new Uint32Array(4);
			crypto.getRandomValues(values);

			return `smart-link-post-auth-chat-${Array.from(values, (value) => value.toString(16)).join(
				'-',
			)}`;
		}
	}

	return `smart-link-post-auth-chat-${Date.now()}`;
};

const sendPostAuthChatOpenMessage = (url: string) => {
	if (typeof window === 'undefined' || typeof window.parent?.postMessage !== 'function') {
		return;
	}

	const payload: ChatNewPayload = {
		type: 'chat-new',
		source: SMART_LINK_TO_ROVO_SOURCE,
		data: {
			dialogues: [],
			mode: {
				useCurrentPageContext: false,
			},
			aiFeatureContext: {
				projectContext: {
					projectId: url,
					// Use the URL as projectName to avoid introducing a hardcoded
					// user-facing provider label in Smart Card.
					projectName: url,
					projectUrl: url,
				},
			},
		},
		openChat: true,
		openChatMode: 'mini-modal',
	};

	window.parent.postMessage(
		{
			eventType: ROVO_POST_MESSAGE_EVENT_TYPE,
			payload,
			payloadId: getPostAuthChatPayloadId(),
		},
		'*',
	);
};

export const useSmartCardActions = (
	id: string,
	url: string,
): {
	authorize: (appearance: CardInnerAppearance) => void;
	invoke: (
		opts: InvokeClientOpts | InvokeServerOpts,
		appearance: CardInnerAppearance,
	) => Promise<JsonLd.Response | void>;
	loadMetadata: () => Promise<void> | undefined;
	register: () => Promise<void>;
	reload: () => void;
} => {
	const resolveUrl = useResolve();
	const invokeClientAction = useInvokeClientAction({});
	const { fireEvent } = useAnalyticsEvents();

	const useActionFlagsGated = functionWithFG<typeof useActionFlags | typeof noop>(
		'platform_sl_connect_account_flag',
		useActionFlags,
		noop,
	);
	const flags = useActionFlagsGated();

	const { store, rovoOptions } = useSmartLinkContext();
	const rovoOptionsRef = useRef(rovoOptions);
	rovoOptionsRef.current = rovoOptions;
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
			const isSupportedPostAuthChatExtensionKey =
				extensionKey === POST_AUTH_CHAT_EXTENSION_KEY;
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

				auth(services[0].url).then(
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

						// Post-auth Chat onboarding: auto-open Rovo Chat mini-modal with the
						// authed 3P link as context, for supported providers (e.g. Google Drive).
						// Provider eligibility is derived from the pre-auth SmartLink state.
						const isEligibleForPostAuthChat =
							status === 'unauthorized' &&
							isSupportedPostAuthChatExtensionKey &&
							fg('platform_sl_3p_post_auth_chat_open_fg') &&
							getIsRovoChatEnabled(rovoOptionsRef.current);

						// Experiment check: fires exposure for both control and treatment.
						// Only reached after eligibility preconditions + kill switch pass, so
						// exposure is counted for the triggered eligible pool.
						const isPostAuthChatTreatment =
							isEligibleForPostAuthChat &&
							expValEquals('platform_sl_3p_post_auth_chat_open_exp', 'isEnabled', true);

						if (status === 'unauthorized' && !isPostAuthChatTreatment) {
							if (fg('platform_sl_connect_account_flag')) {
								const provider = extractSmartLinkProvider(details);
								flags?.showConnectFlag({
									id: `smart-link-connect-success-${extensionKey}`,
									provider,
								});
							}
						}

						reload();

						if (isPostAuthChatTreatment) {
							sendPostAuthChatOpenMessage(url);
						}
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
		[
			getSmartLinkState,
			id,
			reload,
			fireEvent,
			flags,
			url,
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
