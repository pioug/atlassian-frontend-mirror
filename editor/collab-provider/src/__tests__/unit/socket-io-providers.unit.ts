import { SOCKET_IO_OPTIONS, SOCKET_IO_OPTIONS_WITH_HIGH_JITTER } from '../../config';
import { createSocketIOSocket } from '../../socket-io-provider';
import { type InitAndAuthData } from '../../types';
import { fg } from '@atlaskit/platform-feature-flags';
import { isIsolatedCloud } from '@atlaskit/atlassian-context';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

jest.mock('@atlaskit/platform-feature-flags', () => ({
	fg: jest.fn(),
}));
const fgMock = fg as jest.Mock;

jest.mock('@atlaskit/atlassian-context', () => ({
	isIsolatedCloud: jest.fn(),
}));
const isIsolatedCloudMock = isIsolatedCloud as jest.Mock;

jest.mock('@atlaskit/tmp-editor-statsig/exp-val-equals', () => ({
	expValEquals: jest.fn(),
}));
const expValEqualsMock = expValEquals as jest.Mock;

describe('Socket io provider', () => {
	const url = 'http://localhost:8080/ccollab/sessionId/123';
	const presenceUrl = 'http://localhost:8080/collab-presence-confluence/sessionId/123';
	const presencePath = '/ncs-presence/mock-cloud-id/mock-activation-id/confluence';
	const editPath = '/ncs/mock-cloud-id/mock-activation-id/confluence';

	describe('Socket io client path', () => {
		it('return io with correct path for ccollab', () => {
			const socket = createSocketIOSocket(url);

			expect((socket as any).io.engine.opts.path).toEqual('/ccollab/socket.io/');
		});

		describe('PMR routing for presence traffic', () => {
			describe.each([true, false])(
				'return io with correct path outside IC for FG states for presence only %s',
				(isPresenceOnly) => {
					const permutations = [
						[true, true, true],
						[true, false, true],
						[false, true, false],
						[false, false, false],
					];

					beforeEach(() => {
						isIsolatedCloudMock.mockReturnValue(false);
					});

					afterEach(() => {
						jest.restoreAllMocks();
					});

					it.each(permutations)(
						'when nonIc FG %s and ic FG %s, PMR url should be used %s',
						(nonIcFG, icFG, shouldUsePMR) => {
							expValEqualsMock.mockImplementation(
								(flag: string) =>
									(nonIcFG && flag === 'platform_editor_use_pmr_for_collab_presence_non_ic') ||
									(icFG && flag === 'platform_editor_use_pmr_for_collab_presence_in_ic'),
							);

							const socket = createSocketIOSocket(
								presenceUrl,
								undefined,
								undefined,
								isPresenceOnly,
								undefined,
								presencePath,
							);

							expect((socket as any).io.engine.opts.path).toEqual(
								isPresenceOnly && shouldUsePMR
									? '/ncs-presence/mock-cloud-id/mock-activation-id/confluence/socket.io/'
									: '/collab-presence-confluence/socket.io/',
							);
						},
					);
				},
			);

			describe.each([true, false])(
				'return io with correct path inside IC for FG states for presence only %s',
				(isPresenceOnly) => {
					const permutations = [
						[true, true, true],
						[true, false, false],
						[false, true, true],
						[false, false, false],
					];

					beforeEach(() => {
						isIsolatedCloudMock.mockReturnValue(true);
					});

					afterEach(() => {
						jest.restoreAllMocks();
					});

					it.each(permutations)(
						'when nonIc FG %s and ic FG %s, PMR url should be used %s',
						(nonIcFG, icFG, shouldUsePMR) => {
							expValEqualsMock.mockImplementation(
								(flag: string) =>
									(nonIcFG && flag === 'platform_editor_use_pmr_for_collab_presence_non_ic') ||
									(icFG && flag === 'platform_editor_use_pmr_for_collab_presence_in_ic'),
							);

							const socket = createSocketIOSocket(
								presenceUrl,
								undefined,
								undefined,
								isPresenceOnly,
								undefined,
								presencePath,
							);

							expect((socket as any).io.engine.opts.path).toEqual(
								isPresenceOnly && shouldUsePMR
									? '/ncs-presence/mock-cloud-id/mock-activation-id/confluence/socket.io/'
									: '/collab-presence-confluence/socket.io/',
							);
						},
					);
				},
			);
		});

		describe('PMR routing for edit traffic', () => {
			it('should use PMR for edit traffic when experiment is enabled and path is provided', () => {
				expValEqualsMock.mockImplementation(
					(flag: string) => flag === 'platform_editor_to_use_pmr_for_collab_edit_none_ic',
				);

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

			it('should not use PMR for edit traffic when experiment is disabled', () => {
				expValEqualsMock.mockReturnValue(false);

				const socket = createSocketIOSocket(
					url,
					undefined,
					undefined,
					false, // isPresenceOnly = false for edit traffic
					undefined,
					editPath,
				);

				expect((socket as any).io.engine.opts.path).toEqual('/ccollab/socket.io/');
			});

			it('should not use PMR for edit traffic when path is not provided', () => {
				expValEqualsMock.mockReturnValue(true);

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

			it('should not use PMR for edit traffic when isPresenceOnly is undefined and experiment is disabled', () => {
				expValEqualsMock.mockReturnValue(false);

				const socket = createSocketIOSocket(
					url,
					undefined,
					undefined,
					undefined, // isPresenceOnly is undefined (defaults to edit traffic)
					undefined,
					editPath,
				);

				expect((socket as any).io.engine.opts.path).toEqual('/ccollab/socket.io/');
			});

			it('should use PMR for edit traffic when isPresenceOnly is undefined and experiment is enabled', () => {
				expValEqualsMock.mockImplementation(
					(flag: string) => flag === 'platform_editor_to_use_pmr_for_collab_edit_none_ic',
				);

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
		beforeEach(() => {
			// default to OFF for these tests unless explicitly enabled
			expValEqualsMock.mockReturnValue(false);
		});

		it('should omit x-client-platform header when platform_editor_send_client_platform_header is OFF', () => {
			const socket = createSocketIOSocket(url);
			expect(socket?.io?.opts.extraHeaders).not.toHaveProperty('x-client-platform');
		});

		it('should set x-client-platform header when platform_editor_send_client_platform_header is ON', () => {
			expValEqualsMock.mockImplementation(
				(experimentName: string, param: string) =>
					experimentName === 'platform_editor_send_client_platform_header'
			);
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
			fgMock.mockReturnValue(true);
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
