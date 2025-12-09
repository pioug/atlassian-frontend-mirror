import type { Socket } from 'socket.io-client';
import { io } from 'socket.io-client';
import { fg } from '@atlaskit/platform-feature-flags';
import { isIsolatedCloud } from '@atlaskit/atlassian-context';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import { Provider } from './provider';
import type { Config, ProductInformation, InitAndAuthData, AuthCallback } from './types';
import { getProduct, getSubProduct } from './helpers/utils';
import { SOCKET_IO_OPTIONS, SOCKET_IO_OPTIONS_WITH_HIGH_JITTER } from './config';
import type AnalyticsHelper from './analytics/analytics-helper';

export function createSocketIOSocket(
	url: string,
	auth?: AuthCallback | InitAndAuthData,
	productInfo?: ProductInformation,
	isPresenceOnly?: boolean,
	analyticsHelper?: AnalyticsHelper,
	path?: string,
): Socket {
	const { pathname } = new URL(url);
	let socketIOOptions = SOCKET_IO_OPTIONS;
	// Polling first
	let transports = ['polling', 'websocket'];
	let usePMR = false;

	// Limit this change to Presence only
	if (isPresenceOnly) {
		if (fg('platform-editor-presence-websocket-only')) {
			// https://socket.io/docs/v4/client-options/#transports
			// WebSocket first, if fails, try polling
			transports = ['websocket'];
		}
		socketIOOptions = SOCKET_IO_OPTIONS_WITH_HIGH_JITTER;

		if (
			(isIsolatedCloud() &&
				expValEquals('platform_editor_use_pmr_for_collab_presence_in_ic', 'isEnabled', true, false)) ||
			(!isIsolatedCloud() &&
				expValEquals('platform_editor_use_pmr_for_collab_presence_non_ic', 'isEnabled', true, false))
		) {
			usePMR = true;
		}
	}

	const client = io(url, {
		reconnectionDelayMax: socketIOOptions.RECONNECTION_DELAY_MAX,
		reconnectionDelay: socketIOOptions.RECONNECTION_DELAY,
		randomizationFactor: socketIOOptions.RANDOMIZATION_FACTOR,
		closeOnBeforeunload: false,
		withCredentials: true,
		transports,
		path: usePMR && path ? `${path}/socket.io` : `/${pathname.split('/')[1]}/socket.io`,
		auth,
		extraHeaders: {
			'x-product': getProduct(productInfo),
			'x-subproduct': getSubProduct(productInfo),
		},
	});

	return client;
}

export function createSocketIOCollabProvider(config: Omit<Config, 'createSocket'>) {
	return new Provider({ ...config, createSocket: createSocketIOSocket });
}
