import type { Socket } from 'socket.io-client';
import { io } from 'socket.io-client';
import { fg } from '@atlaskit/platform-feature-flags';

import { Provider } from './provider';
import type AnalyticsHelper from './analytics/analytics-helper';
import type { Config, ProductInformation, InitAndAuthData, AuthCallback } from './types';
import { EVENT_ACTION, EVENT_STATUS } from './helpers/const';
import { getProduct, getSubProduct } from './helpers/utils';
import { SOCKET_IO_OPTIONS } from './config';

export function createSocketIOSocket(
	url: string,
	auth?: AuthCallback | InitAndAuthData,
	productInfo?: ProductInformation,
	isPresenceOnly?: boolean,
	analyticsHelper?: AnalyticsHelper,
): Socket {
	const { pathname } = new URL(url);
	// Polling first
	let transports = ['polling', 'websocket'];
	// Only limit this change to Presence only
	if (isPresenceOnly && fg('platform-editor-presence-websocket-only')) {
		// https://socket.io/docs/v4/client-options/#transports
		// WebSocket first, if fails, try polling
		transports = ['websocket', 'polling'];
	}
	const client = io(url, {
		reconnectionDelayMax: SOCKET_IO_OPTIONS.RECONNECTION_DELAY_MAX,
		reconnectionDelay: SOCKET_IO_OPTIONS.RECONNECTION_DELAY,
		randomizationFactor: SOCKET_IO_OPTIONS.RANDOMIZATION_FACTOR,
		closeOnBeforeunload: false,
		withCredentials: true,
		transports,
		path: `/${pathname.split('/')[1]}/socket.io`,
		auth,
		extraHeaders: {
			'x-product': getProduct(productInfo),
			'x-subproduct': getSubProduct(productInfo),
		},
	});

	// Only limit this change to Presence only
	if (isPresenceOnly && fg('platform-editor-presence-websocket-only')) {
		// https://socket.io/docs/v4/client-options/#transports
		client.on('connect_error', () => {
			// revert to classic upgrade
			client.io.opts.transports = ['polling', 'websocket'];
			analyticsHelper?.sendActionEvent(EVENT_ACTION.POLLING_FALLBACK, EVENT_STATUS.INFO, {
				url,
			});
		});
	}

	return client;
}

export function createSocketIOCollabProvider(config: Omit<Config, 'createSocket'>) {
	return new Provider({ ...config, createSocket: createSocketIOSocket });
}
