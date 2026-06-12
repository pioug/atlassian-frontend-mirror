import { useCallback, useMemo, useRef } from 'react';

import { type JsonLd } from '@atlaskit/json-ld-types';
import { extractSmartLinkProvider, extractSmartLinkTitle } from '@atlaskit/link-extractors';
import { useSmartLinkContext } from '@atlaskit/link-provider';
import {
	ACTION_RESOLVING,
	ACTION_UPDATE_METADATA_STATUS,
	cardAction,
	type CardAppearance,
	type MetadataStatus,
} from '@atlaskit/linking-common';
import { auth, type AuthError } from '@atlaskit/outbound-auth-flow-client';
import { fg } from '@atlaskit/platform-feature-flags';
import { functionWithFG } from '@atlaskit/platform-feature-flags-react';
import { ROVO_POST_MESSAGE_EVENT_TYPE } from '@atlaskit/rovo-triggers/post-message-to-pubsub';
import { type ChatSmartLink3PPostAuthLaunchPayload } from '@atlaskit/rovo-triggers/types';
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
import useResolve, { type ResolveUrlParams } from '../hooks/use-resolve';

const POST_AUTH_CHAT_EXTENSION_KEY = 'google-object-provider';
// Smart Card resolver key differs from the consumer-facing Rovo payload key.
const POST_AUTH_CHAT_PAYLOAD_EXTENSION_KEY = 'google-drive';

const SMART_LINK_3P_POST_AUTH_SOURCE = 'smart-link-3p-post-auth';

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

const sendPostAuthChatOpenMessage = (url: string, documentTitle?: string) => {
	if (typeof window === 'undefined' || typeof window.parent?.postMessage !== 'function') {
		return;
	}

	const payload: ChatSmartLink3PPostAuthLaunchPayload = {
		type: 'chat-smartlink-3p-post-auth-launch',
		source: SMART_LINK_3P_POST_AUTH_SOURCE,
		openChat: true,
		openChatMode: 'mini-modal',
		data: {
			extensionKey: POST_AUTH_CHAT_PAYLOAD_EXTENSION_KEY,
			provider: 'Google Drive',
			projectContext: {
				projectId: url,
				projectName: documentTitle ?? 'Google Drive',
				projectUrl: url,
			},
		},
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
	register: (appearance?: CardAppearance) => Promise<void>;
	reload: (appearance?: CardAppearance) => void;
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

	// Original resolve function — signature kept intact for maximum safety when FG is off.
	const resolve = useCallback(
		async (resourceUrl: string = url, isReloading: boolean = false, isMetadataRequest: boolean = false) =>
			resolveUrl({ url: resourceUrl, isReloading, isMetadataRequest, id }),
		[id, resolveUrl, url],
	);

	// New resolve function accepting ResolveUrlParams (minus 'id' which is closed over).
	// Used when FG is enabled to pass appearance to ORS.
	const resolveNew = useCallback(
		async (params: Partial<Omit<ResolveUrlParams, 'id'>> = {}) => {
			const {
				url: resourceUrl = url,
				isReloading = false,
				isMetadataRequest = false,
				appearance,
			} = params;
			return resolveUrl({ url: resourceUrl, isReloading, isMetadataRequest, id, appearance });
		},
		[id, resolveUrl, url],
	);

	/**
	 * Register a smart link for resolution.
	 * @param appearance - Card appearance hint for ORS to optimize response payload.
	 *                     When 'inline', ORS returns minimal data (title, status).
	 *                     When 'block' or 'embed', ORS returns full data including summary.
	 */
	const register = useCallback(
		(appearance?: CardAppearance) => {
			const { details } = getSmartLinkState();
			if (!details) {
				dispatch(cardAction(ACTION_RESOLVING, { url }));
				// Always set metadataStatus to 'pending' during registration to prevent
				// loadMetadata from firing a duplicate concurrent fetch if a hover card
				// mounts while registration is in-flight. This matches pre-PR behaviour.
				setMetadataStatus('pending');
			}
			if (fg('platform_smartlink_inline_resolve_optimization')) {
				return resolveNew({ url, appearance });
			}
			return resolve(url);
		},
		[getSmartLinkState, resolve, resolveNew, dispatch, url, setMetadataStatus],
	);

	const reload = useCallback(
		(appearance?: CardAppearance) => {
			const { details } = getSmartLinkState();
			const definitionId = getDefinitionId(details);
			if (fg('platform_smartlink_inline_resolve_optimization')) {
				if (definitionId) {
					getByDefinitionId(definitionId, getState()).map((reloadUrl) =>
						resolveNew({ url: reloadUrl, isReloading: true, appearance }),
					);
				} else {
					resolveNew({ url, isReloading: true, appearance });
				}
			} else {
				if (definitionId) {
					getByDefinitionId(definitionId, getState()).map((reloadUrl) =>
						resolve(reloadUrl, true),
					);
				} else {
					resolve(url, true);
				}
			}
		},
		[getSmartLinkState, url, getState, resolve, resolveNew],
	);

	/**
	 * Load metadata for hover card preview.
	 * This always requests 'block' appearance to get full data including summary.
	 *
	 * Inline optimized and SSR-resolved links keep metadataStatus pending until hover
	 * requests the full block response.
	 */
	const loadMetadata = useCallback(() => {
		const { metadataStatus } = getSmartLinkState();
		const needsBlockData = metadataStatus === undefined || (metadataStatus === 'pending' && fg('platform_smartlink_inline_resolve_optimization'));

		if (needsBlockData) {
			setMetadataStatus('pending');
			if (fg('platform_smartlink_inline_resolve_optimization')) {
				// Always request 'block' appearance for hover card metadata to get full data
				return resolveNew({ url, isMetadataRequest: true, appearance: 'block' });
			}
			return resolve(url, false, true);
		}
	}, [getSmartLinkState, resolve, resolveNew, setMetadataStatus, url]);

	const authorize = useCallback(
		(appearance: CardInnerAppearance) => {
			const { details, status } = getSmartLinkState();
			const definitionId = getDefinitionId(details);
			const extensionKey = getExtensionKey(details);
			const isSupportedPostAuthChatExtensionKey = extensionKey === POST_AUTH_CHAT_EXTENSION_KEY;
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
							sendPostAuthChatOpenMessage(url, extractSmartLinkTitle(details));
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
		[getSmartLinkState, id, reload, fireEvent, flags, url],
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
