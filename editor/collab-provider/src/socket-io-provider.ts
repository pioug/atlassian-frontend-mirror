import type { Socket } from 'socket.io-client';
import { io } from 'socket.io-client';

import { fg } from '@atlaskit/platform-feature-flags/fg';

import type AnalyticsHelper from './analytics/analytics-helper';
import { SOCKET_IO_OPTIONS, SOCKET_IO_OPTIONS_WITH_HIGH_JITTER } from './config';
import { EVENT_ACTION, EVENT_STATUS } from './helpers/const';
import { getProduct, getSubProduct, isGCPtenant } from './helpers/utils';
import { Provider } from './provider';
import type { Config, ProductInformation, InitAndAuthData, AuthCallback } from './types';

/**
 * Creates the Socket.IO client for collab editing or presence, with the transports for that connection case.
 */
export function createSocketIOSocket(
	url: string,
	auth?: AuthCallback | InitAndAuthData,
	productInfo?: ProductInformation,
	isPresenceOnly?: boolean,
	analyticsHelper?: AnalyticsHelper,
	path?: string,
	documentAri?: string,
): Socket {
	const { pathname, hostname } = new URL(url);
	let socketIOOptions = SOCKET_IO_OPTIONS;
	// Default: polling first, with WebSocket upgrade fallback
	let transports: string[] = ['polling', 'websocket'];
	let webSocketFirst = false;

	// Determine transport strategy based on connection type and tenant.
	// https://socket.io/docs/v4/client-options/#transports
	type ConnectionCase = 'presence' | 'gcp-collab' | 'default';

	const getConnectionCase = (): ConnectionCase => {
		if (isPresenceOnly) {
			// Presence connections: all tenants (commercial, GCP, IC, etc.)
			return 'presence';
		} else if (isGCPtenant(hostname)) {
			// Collab editing: GCP tenant
			return 'gcp-collab';
		} else {
			// Collab editing: commercial and all other tenants — polling first, with WebSocket upgrade fallback
			return 'default';
		}
	};

	switch (getConnectionCase()) {
		case 'presence':
			// Presence for all tenants (commercial, GCP, IC, …): WebSocket first, polling only when WebSocket fails
			socketIOOptions = SOCKET_IO_OPTIONS_WITH_HIGH_JITTER;
			if (fg('platform_editor_presence_ws_first_with_fallback')) {
				transports = ['websocket', 'polling'];
				webSocketFirst = true;
			}
			break;

		case 'gcp-collab':
			if (fg('platform_editor_gcp_collab_ws_first')) {
				transports = ['websocket', 'polling'];
				webSocketFirst = true;
			} else if (fg('collab_edit_via_websocket_only_for_gcp')) {
				transports = ['websocket'];
			}
			break;

		default:
			// Default: polling first, with WebSocket upgrade fallback
			break;
	}

	const extraHeaders: Record<string, string> = {
		'x-product': getProduct(productInfo),
		'x-subproduct': getSubProduct(productInfo),
		'x-client-platform': 'web',
	};

	const client = io(url, {
		reconnectionDelayMax: socketIOOptions.RECONNECTION_DELAY_MAX,
		reconnectionDelay: socketIOOptions.RECONNECTION_DELAY,
		randomizationFactor: socketIOOptions.RANDOMIZATION_FACTOR,
		closeOnBeforeunload: false,
		withCredentials: true,
		transports,
		// When WebSocket is rejected while opening, try polling in the same attempt
		tryAllTransports: webSocketFirst,
		path: path ? `${path}/socket.io` : `/${pathname.split('/')[1]}/socket.io`,
		auth,
		extraHeaders,
		query: {
			sourceId: documentAri?.split('/')[1],
			// Browsers cannot send extraHeaders on a WebSocket handshake, so the BE reads these from the query too
			...(webSocketFirst ? extraHeaders : {}),
		},
	});

	if (webSocketFirst) {
		addPollingFallback(
			client,
			url,
			isPresenceOnly ? fg('platform_editor_presence_ws_restore_after_upgrade') : true,
			analyticsHelper,
		);
	}

	return client;
}

// Long enough for the permission token fetch on a slow network. A false trigger only restores polling-first.
export const WEBSOCKET_CONNECT_TIMEOUT_MS = 8000;

/**
 * `tryAllTransports` only covers a WebSocket that fails fast. Some proxies hang the upgrade, or accept it and
 * drop every frame, and then no error fires. Switch to polling-first when WebSocket does not connect in time,
 * or fails at the transport level. A server rejection (error with `data`) proves WebSocket works, so it never
 * triggers the fallback. Once switched, all reconnects of this socket use polling-first.
 *
 * With `restoreAfterUpgrade`, the fallback is no longer sticky and errors no longer
 * trigger it. Errors that reach `connect_error` mean polling failed too (network down), or WebSocket already opened.
 * Once WebSocket carries data, on open or after an upgrade from polling, go back to WebSocket-first.
 */
function addPollingFallback(
	client: Socket,
	url: string,
	restoreAfterUpgrade: boolean,
	analyticsHelper?: AnalyticsHelper,
) {
	let timer: ReturnType<typeof setTimeout> | undefined;
	let webSocketWorks = false;
	const isWebSocketFirst = () => !webSocketWorks && client.io.opts.transports?.[0] === 'websocket';
	const markWebSocketWorks = () => {
		webSocketWorks = true;
		client.io.opts.transports = ['websocket', 'polling'];
		client.io.opts.tryAllTransports = true;
	};

	const fallbackToPolling = (reason: string) => {
		clearTimeout(timer);
		if (!isWebSocketFirst() || (typeof navigator !== 'undefined' && navigator.onLine === false)) {
			return;
		}
		client.io.opts.transports = ['polling', 'websocket'];
		client.io.opts.tryAllTransports = false;
		analyticsHelper?.sendActionEvent(EVENT_ACTION.POLLING_FALLBACK, EVENT_STATUS.INFO, {
			url,
			reason,
		});
		client.disconnect().connect();
	};
	const startTimer = () => {
		clearTimeout(timer);
		if (isWebSocketFirst()) {
			timer = setTimeout(
				() => !client.connected && fallbackToPolling('timeout'),
				WEBSOCKET_CONNECT_TIMEOUT_MS,
			);
		}
	};

	startTimer();
	client.io.on('reconnect_attempt', startTimer);

	if (restoreAfterUpgrade) {
		// The engine opens when the server handshake arrives, so the auth token fetch is not timed
		client.io.on('open', () => {
			clearTimeout(timer);
			const { engine } = client.io;
			if (engine.transport.name === 'websocket') {
				markWebSocketWorks();
			} else {
				engine.once(
					'upgrade',
					(transport) => transport.name === 'websocket' && markWebSocketWorks(),
				);
			}
		});
		return;
	}

	client.on('connect', () => {
		clearTimeout(timer);
		webSocketWorks ||= client.io.engine.transport.name === 'websocket';
	});
	client.on('connect_error', (error: Error & { data?: unknown; type?: string }) => {
		if (error.data) {
			clearTimeout(timer);
			webSocketWorks ||= client.io.opts.transports?.[0] === 'websocket';
		} else if (error.type === 'TransportError' || error.message === 'timeout') {
			fallbackToPolling(error.message);
		}
	});
}

/**
 * Creates a collab provider that connects with Socket.IO.
 */
export function createSocketIOCollabProvider(config: Omit<Config, 'createSocket'>): Provider {
	return new Provider({ ...config, createSocket: createSocketIOSocket });
}
