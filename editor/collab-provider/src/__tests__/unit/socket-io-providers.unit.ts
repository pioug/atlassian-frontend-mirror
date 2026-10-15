import { passGate, failGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { SOCKET_IO_OPTIONS, SOCKET_IO_OPTIONS_WITH_HIGH_JITTER } from '../../config';
import { createSocketIOSocket, WEBSOCKET_CONNECT_TIMEOUT_MS } from '../../socket-io-provider';
import type { InitAndAuthData } from '../../types';

describe('Socket io provider', () => {
	const url = 'http://localhost:8080/ccollab/sessionId/123';
	const gcpUrl = 'http://test-gcp-cdp-bb0.jira-dev.com/ccollab/sessionId/123';
	const presenceUrl = 'http://localhost:8080/collab-presence-confluence/sessionId/123';
	const presencePath = '/ncs-presence/mock-cloud-id/mock-activation-id/confluence';
	const editPath = '/ncs/mock-cloud-id/mock-activation-id/confluence';

	describe('Socket io client path', () => {
		it('return io with correct path for ccollab', () => {
			const socket = createSocketIOSocket(url);

			expect((socket as any).io.engine.opts.path).toEqual('/ccollab/socket.io/');
		});

		describe('Transports', () => {
			it('use polling and websocket transports when collab editing', () => {
				const socket = createSocketIOSocket(url);

				expect((socket as any).io.opts.transports).toEqual(['polling', 'websocket']);
			});

			it('use websocket first with polling fallback for presence and FG on', () => {
				passGate('platform_editor_presence_ws_first_with_fallback');
				const socket = createSocketIOSocket(url, undefined, { product: 'confluence' }, true);

				expect((socket as any).io.opts.transports).toEqual(['websocket', 'polling']);
				expect((socket as any).io.opts.tryAllTransports).toBe(true);
				expect((socket as any).io.opts.query).toMatchObject({
					'x-product': 'confluence',
					'x-client-platform': 'web',
				});
			});

			it('use polling and websocket transports for presence and FG off', () => {
				failGate('platform_editor_presence_ws_first_with_fallback');
				const socket = createSocketIOSocket(url, undefined, undefined, true);

				expect((socket as any).io.opts.transports).toEqual(['polling', 'websocket']);
				expect((socket as any).io.opts.tryAllTransports).toBe(false);
			});

			it('use only websocket transport for collab editing on GCP and FG on', () => {
				passGate('collab_edit_via_websocket_only_for_gcp');
				const socket = createSocketIOSocket(gcpUrl);

				expect((socket as any).io.opts.transports).toEqual(['websocket']);
			});

			it('use polling and websocket transports for collab editing on GCP and FG off', () => {
				failGate('collab_edit_via_websocket_only_for_gcp');
				const socket = createSocketIOSocket(gcpUrl);

				expect((socket as any).io.opts.transports).toEqual(['polling', 'websocket']);
			});

			it('use websocket first for presence on GCP and FG on', () => {
				passGate('platform_editor_presence_ws_first_with_fallback');
				const socket = createSocketIOSocket(gcpUrl, undefined, undefined, true);

				expect((socket as any).io.opts.transports).toEqual(['websocket', 'polling']);
			});

			it('use polling and websocket transports for presence on GCP and FG off', () => {
				failGate('platform_editor_presence_ws_first_with_fallback');
				const socket = createSocketIOSocket(gcpUrl, undefined, undefined, true);

				expect((socket as any).io.opts.transports).toEqual(['polling', 'websocket']);
			});
		});

		describe('Presence polling fallback', () => {
			const analyticsHelper = { sendActionEvent: jest.fn() };
			const createPresenceSocket = () => {
				passGate('platform_editor_presence_ws_first_with_fallback');
				const socket = createSocketIOSocket(
					url,
					undefined,
					undefined,
					true,
					analyticsHelper as any,
				);
				// Stop the real connection attempt, so only the events emitted below drive the fallback
				jest.spyOn(socket, 'disconnect').mockReturnValue(socket);
				jest.spyOn(socket, 'connect').mockReturnValue(socket);
				return socket as any;
			};
			const transportError = () =>
				Object.assign(new Error('websocket error'), { type: 'TransportError' });

			beforeEach(() => {
				jest.useFakeTimers();
				analyticsHelper.sendActionEvent.mockClear();
			});
			afterEach(() => {
				jest.useRealTimers();
			});

			it('switch to polling first on a websocket transport error', () => {
				const socket = createPresenceSocket();
				socket.emitReserved('connect_error', transportError());

				expect(socket.io.opts.transports).toEqual(['polling', 'websocket']);
				expect(socket.disconnect).toHaveBeenCalled();
				expect(socket.connect).toHaveBeenCalled();
				expect(analyticsHelper.sendActionEvent).toHaveBeenCalledWith('pollingFallback', 'INFO', {
					url,
					reason: 'websocket error',
				});
			});

			it('switch to polling first when websocket does not connect in time', () => {
				const socket = createPresenceSocket();
				jest.advanceTimersByTime(WEBSOCKET_CONNECT_TIMEOUT_MS);

				expect(socket.io.opts.transports).toEqual(['polling', 'websocket']);
				expect(analyticsHelper.sendActionEvent).toHaveBeenCalledWith('pollingFallback', 'INFO', {
					url,
					reason: 'timeout',
				});
			});

			it('keep websocket first when the server rejects the connection', () => {
				const socket = createPresenceSocket();
				socket.emitReserved(
					'connect_error',
					Object.assign(new Error('No permission'), { data: { status: 401 } }),
				);
				jest.advanceTimersByTime(WEBSOCKET_CONNECT_TIMEOUT_MS);
				socket.emitReserved('connect_error', transportError());

				expect(socket.io.opts.transports).toEqual(['websocket', 'polling']);
				expect(analyticsHelper.sendActionEvent).not.toHaveBeenCalled();
			});

			it('fall back only once', () => {
				const socket = createPresenceSocket();
				socket.emitReserved('connect_error', transportError());
				socket.emitReserved('connect_error', transportError());
				jest.advanceTimersByTime(WEBSOCKET_CONNECT_TIMEOUT_MS);

				expect(analyticsHelper.sendActionEvent).toHaveBeenCalledTimes(1);
			});
		});

		it('return io with correct pmr path for presence', () => {
			const socket = createSocketIOSocket(
				presenceUrl,
				undefined,
				undefined,
				true,
				undefined,
				presencePath,
			);
			expect((socket as any).io.engine.opts.path).toEqual(
				'/ncs-presence/mock-cloud-id/mock-activation-id/confluence/socket.io/',
			);
		});

		describe('PMR routing for edit traffic', () => {
			it('should use PMR for edit traffic when path is provided', () => {
				const socket = createSocketIOSocket(
					url,
					undefined,
					undefined,
					false, // isPresenceOnly = false for edit traffic
					undefined,
					editPath,
				);

				expect((socket as any).io.engine.opts.path).toEqual(
					'/ncs/mock-cloud-id/mock-activation-id/confluence/socket.io/',
				);
			});

			it('should not use PMR for edit traffic when path is not provided', () => {
				const socket = createSocketIOSocket(
					url,
					undefined,
					undefined,
					false, // isPresenceOnly = false for edit traffic
					undefined,
					undefined, // no path provided
				);

				expect((socket as any).io.engine.opts.path).toEqual('/ccollab/socket.io/');
			});

			it('should use PMR for edit traffic when isPresenceOnly is undefined', () => {
				const socket = createSocketIOSocket(
					url,
					undefined,
					undefined,
					undefined, // isPresenceOnly is undefined (defaults to edit traffic)
					undefined,
					editPath,
				);

				expect((socket as any).io.engine.opts.path).toEqual(
					'/ncs/mock-cloud-id/mock-activation-id/confluence/socket.io/',
				);
			});
		});
	});

	it('attach `auth` tokenRefresh if tokenRefresh function exist', (done) => {
		const mockToken = 'a-token-for-embedded-confluence';
		const permissionTokenRefresh = async () => mockToken;
		const socket = createSocketIOSocket(url, (cb: (data: InitAndAuthData) => void) => {
			permissionTokenRefresh().then((token: string) => {
				cb({ token, initialized: false });
			});
		});
		expect((socket as any).io.engine.opts.path).toEqual('/ccollab/socket.io/');
		expect((socket as any).io.opts.auth).toBeDefined();
		(socket as any).io.opts.auth((token: string) => {
			expect(token).toEqual({ token: mockToken, initialized: false });
			done();
		});
	});

	describe('Product Information headers', () => {
		it('should set x-client-platform header', () => {
			const socket = createSocketIOSocket(url);
			expect(socket?.io?.opts.extraHeaders).toHaveProperty('x-client-platform', 'web');
		});

		// Ignored via go/ees005
		// eslint-disable-next-line jest/no-identical-title
		it('should set the product header on the socket.io client', () => {
			const socket = createSocketIOSocket(url, undefined, {
				product: 'confluence',
			});

			expect(socket?.io?.opts.extraHeaders).toEqual({
				'x-client-platform': 'web',
				'x-product': 'confluence',
				'x-subproduct': 'none',
			});
		});

		it('should set the product and sub-product headers on the socket.io client', () => {
			const socket = createSocketIOSocket(url, undefined, {
				product: 'embeddedConfluence',
				subProduct: 'JSM',
			});

			expect(socket?.io?.opts.extraHeaders).toEqual({
				'x-client-platform': 'web',
				'x-product': 'embeddedConfluence',
				'x-subproduct': 'JSM',
			});
		});
	});

	describe('Reconnection options', () => {
		it('should set default reconnection options if not presence client', () => {
			const socket = createSocketIOSocket(url);

			expect(socket?.io?.opts.reconnectionDelayMax).toEqual(
				SOCKET_IO_OPTIONS.RECONNECTION_DELAY_MAX,
			);
			expect(socket?.io?.opts.reconnectionDelay).toEqual(SOCKET_IO_OPTIONS.RECONNECTION_DELAY);
			expect(socket?.io?.opts.randomizationFactor).toEqual(SOCKET_IO_OPTIONS.RANDOMIZATION_FACTOR);
		});

		it('should set high jitter reconnection options if presence client', () => {
			const socket = createSocketIOSocket(url, undefined, undefined, true);

			expect(socket?.io?.opts.reconnectionDelayMax).toEqual(
				SOCKET_IO_OPTIONS_WITH_HIGH_JITTER.RECONNECTION_DELAY_MAX,
			);
			expect(socket?.io?.opts.reconnectionDelay).toEqual(
				SOCKET_IO_OPTIONS_WITH_HIGH_JITTER.RECONNECTION_DELAY,
			);
			expect(socket?.io?.opts.randomizationFactor).toEqual(
				SOCKET_IO_OPTIONS_WITH_HIGH_JITTER.RANDOMIZATION_FACTOR,
			);
		});
	});
});
