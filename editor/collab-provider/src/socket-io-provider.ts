import type { Socket } from 'socket.io-client';
import { io } from 'socket.io-client';
import { fg } from '@atlaskit/platform-feature-flags';

import { Provider } from './provider';
import type AnalyticsHelper from './analytics/analytics-helper';
import type { Config, ProductInformation, InitAndAuthData, AuthCallback } from './types';
import { getProduct, getSubProduct } from './helpers/utils';
import { SOCKET_IO_OPTIONS, SOCKET_IO_OPTIONS_WITH_HIGH_JITTER } from './config';

export function createSocketIOSocket(
	url: string,
	auth?: AuthCallback | InitAndAuthData,
	productInfo?: ProductInformation,
	isPresenceOnly?: boolean,
	analyticsHelper?: AnalyticsHelper,
): Socket {
	const { pathname } = new URL(url);
	let socketIOOptions = SOCKET_IO_OPTIONS;
	// Polling first
	let transports = ['polling', 'websocket'];
	// Limit this change to Presence only
	if (isPresenceOnly) {
		if (fg('platform-editor-presence-websocket-only')) {
			// https://socket.io/docs/v4/client-options/#transports
			// WebSocket first, if fails, try polling
			transports = ['websocket'];
		}
		if (fg('widen_presence_socket_reconnection_jitter')) {
			socketIOOptions = SOCKET_IO_OPTIONS_WITH_HIGH_JITTER;
		}
	}

	const client = io(url, {
		reconnectionDelayMax: socketIOOptions.RECONNECTION_DELAY_MAX,
		reconnectionDelay: socketIOOptions.RECONNECTION_DELAY,
		randomizationFactor: socketIOOptions.RANDOMIZATION_FACTOR,
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

	return client;
}

export function createSocketIOCollabProvider(config: Omit<Config, 'createSocket'>) {
	return new Provider({ ...config, createSocket: createSocketIOSocket });
}
