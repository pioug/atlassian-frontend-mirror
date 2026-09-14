import { BRIDGE_MESSAGE_MARKER, BRIDGE_TO_EXTENSION } from './constants';
import { type BridgeMessage, createWindowTransport } from './transport';

const PEER_ORIGIN = 'chrome-extension://abcdefghijklmnopabcdefghijklmnop';
const UNRELATED_ORIGIN = 'https://not-the-peer.example.com';

const bridgeMessage = (): BridgeMessage => ({
	[BRIDGE_MESSAGE_MARKER]: true,
	direction: BRIDGE_TO_EXTENSION,
	payload: {
		type: 'editor-context-payload',
		data: { document: { type: 'text/adf', content: '{}' } },
	},
});

/**
 * Dispatched rather than posted: jsdom's `postMessage` does not let a test choose `event.origin`,
 * which is the whole subject here.
 */
const deliver = (origin: string, data: unknown): void => {
	window.dispatchEvent(new MessageEvent('message', { data, origin }));
};

const fakeTargetWindow = () => ({ postMessage: jest.fn() }) as unknown as Window;

describe('createWindowTransport send', () => {
	it('posts to the target window at the target origin', () => {
		const targetWindow = fakeTargetWindow();
		const message = bridgeMessage();

		createWindowTransport({ targetWindow, self: window, targetOrigin: PEER_ORIGIN }).send(message);

		expect(targetWindow.postMessage).toHaveBeenCalledWith(message, PEER_ORIGIN);
	});

	it('defaults the target origin to the sending window, for the same-window product relay', () => {
		const targetWindow = fakeTargetWindow();

		createWindowTransport({ targetWindow, self: window }).send(bridgeMessage());

		expect(targetWindow.postMessage).toHaveBeenCalledWith(
			expect.anything(),
			window.location.origin,
		);
	});
});

describe('createWindowTransport subscribe', () => {
	it('dispatches a bridge message that came from the accepted origin', () => {
		const handler = jest.fn();
		const transport = createWindowTransport({
			targetWindow: fakeTargetWindow(),
			self: window,
			targetOrigin: PEER_ORIGIN,
		});
		const unsubscribe = transport.subscribe(handler);

		deliver(PEER_ORIGIN, bridgeMessage());

		expect(handler).toHaveBeenCalledTimes(1);
		unsubscribe();
	});

	it('drops a well-formed bridge message from any other origin', () => {
		const handler = jest.fn();
		const transport = createWindowTransport({
			targetWindow: fakeTargetWindow(),
			self: window,
			targetOrigin: PEER_ORIGIN,
		});
		const unsubscribe = transport.subscribe(handler);

		// Shape alone used to be enough to reach the ai-mate bus; it must not be.
		deliver(UNRELATED_ORIGIN, bridgeMessage());

		expect(handler).not.toHaveBeenCalled();
		unsubscribe();
	});

	it('accepts an explicit acceptOrigin that differs from the send target', () => {
		const handler = jest.fn();
		const transport = createWindowTransport({
			targetWindow: fakeTargetWindow(),
			self: window,
			targetOrigin: PEER_ORIGIN,
			acceptOrigin: UNRELATED_ORIGIN,
		});
		const unsubscribe = transport.subscribe(handler);

		deliver(UNRELATED_ORIGIN, bridgeMessage());
		deliver(PEER_ORIGIN, bridgeMessage());

		expect(handler).toHaveBeenCalledTimes(1);
		unsubscribe();
	});

	it('falls back to the current window origin when neither origin is supplied', () => {
		const handler = jest.fn();
		const transport = createWindowTransport({
			targetWindow: fakeTargetWindow(),
			self: window,
		});
		const unsubscribe = transport.subscribe(handler);

		deliver(window.location.origin, bridgeMessage());
		deliver(UNRELATED_ORIGIN, bridgeMessage());

		expect(handler).toHaveBeenCalledTimes(1);
		unsubscribe();
	});

	it('never binds a listener when acceptOrigin is the wildcard', () => {
		const handler = jest.fn();
		const transport = createWindowTransport({
			targetWindow: fakeTargetWindow(),
			self: window,
			targetOrigin: '*',
		});
		const unsubscribe = transport.subscribe(handler);

		deliver(PEER_ORIGIN, bridgeMessage());
		deliver(UNRELATED_ORIGIN, bridgeMessage());

		expect(handler).not.toHaveBeenCalled();
		// Still honours the unsubscribe contract, so callers need no special case.
		expect(() => unsubscribe()).not.toThrow();
	});

	it('still ignores unrelated traffic arriving from the accepted origin', () => {
		const handler = jest.fn();
		const transport = createWindowTransport({
			targetWindow: fakeTargetWindow(),
			self: window,
			targetOrigin: PEER_ORIGIN,
		});
		const unsubscribe = transport.subscribe(handler);

		deliver(PEER_ORIGIN, { some: 'other app message' });

		expect(handler).not.toHaveBeenCalled();
		unsubscribe();
	});

	it('stops dispatching once unsubscribed', () => {
		const handler = jest.fn();
		const transport = createWindowTransport({
			targetWindow: fakeTargetWindow(),
			self: window,
			targetOrigin: PEER_ORIGIN,
		});

		transport.subscribe(handler)();
		deliver(PEER_ORIGIN, bridgeMessage());

		expect(handler).not.toHaveBeenCalled();
	});
});
