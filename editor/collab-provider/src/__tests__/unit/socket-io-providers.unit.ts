import { SOCKET_IO_OPTIONS, SOCKET_IO_OPTIONS_WITH_HIGH_JITTER } from '../../config';
import { createSocketIOSocket } from '../../socket-io-provider';
import { type InitAndAuthData } from '../../types';
import { fg } from '@atlaskit/platform-feature-flags';

jest.mock('@atlaskit/platform-feature-flags', () => ({
	fg: jest.fn(),
}));
const fgMock = fg as jest.Mock;

describe('Socket io provider', () => {
	const url = 'http://localhost:8080/ccollab/sessionId/123';

	it('return io with correct path', () => {
		const socket = createSocketIOSocket(url);

		expect((socket as any).io.engine.opts.path).toEqual('/ccollab/socket.io/');
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
		it('should set the product header on the socket.io client', () => {
			const socket = createSocketIOSocket(url);

			expect(socket?.io?.opts.extraHeaders).toEqual({
				'x-product': 'unknown',
				'x-subproduct': 'unknown',
			});
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
