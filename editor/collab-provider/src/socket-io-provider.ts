import type { Socket } from 'socket.io-client';
import { io } from 'socket.io-client';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { Provider } from './provider';
import type { Config, ProductInformation, InitAndAuthData, AuthCallback } from './types';
import { getProduct, getSubProduct, isGCPtenant } from './helpers/utils';
import { SOCKET_IO_OPTIONS, SOCKET_IO_OPTIONS_WITH_HIGH_JITTER } from './config';
import type AnalyticsHelper from './analytics/analytics-helper';

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
			// Presence for all tenants (commercial, GCP, IC, …): WebSocket only when flag is enabled
			socketIOOptions = SOCKET_IO_OPTIONS_WITH_HIGH_JITTER;
			if (fg('platform-editor-presence-websocket-only')) {
				transports = ['websocket'];
			}
			break;

		case 'gcp-collab':
			// GCP: use WebSocket for all collab editing as well
			if (fg('collab_edit_via_websocket_only_for_gcp')) {
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
		path: path ? `${path}/socket.io` : `/${pathname.split('/')[1]}/socket.io`,
		auth,
		extraHeaders,
		query: {
			sourceId: documentAri?.split('/')[1],
		},
	});

	return client;
}

export function createSocketIOCollabProvider(config: Omit<Config, 'createSocket'>): Provider {
	return new Provider({ ...config, createSocket: createSocketIOSocket });
}
