import React from 'react';

import { setBooleanFeatureFlagResolver } from '@atlaskit/platform-feature-flags/setBooleanFeatureFlagResolver';
import { render } from '@atlassian/testing-library/testing-library/react';

import { usePublish, useSubscribeAll } from '../../../main';
import { type Payload } from '../../../types';

import {
	BRIDGE_FEATURE_GATE,
	BRIDGE_MESSAGE_MARKER,
	BRIDGE_SOURCE,
	BRIDGE_TO_EXTENSION,
	BRIDGE_CONTROL_REQUEST_CONTEXT,
	BRIDGE_TO_PRODUCT,
} from './constants';
import { ExtensionContextBridgeClient } from './ExtensionContextBridgeClient';
import { ExtensionContextBridgeHost } from './ExtensionContextBridgeHost';
import { type BridgeControlMessage, type BridgeMessage, type Transport } from './transport';

/** In-memory transport so tests never touch `postMessage`. */
const createFakeTransport = () => {
	const sent: (BridgeMessage | BridgeControlMessage)[] = [];
	const handlers = new Set<(message: BridgeMessage | BridgeControlMessage) => void>();
	const transport: Transport = {
		send: (message) => {
			sent.push(message);
		},
		subscribe: (handler) => {
			handlers.add(handler);
			return () => handlers.delete(handler);
		},
	};
	return {
		transport,
		sent,
		/** Simulate the extension delivering a message into this runtime. */
		deliver: (message: BridgeMessage) => handlers.forEach((h) => h(message)),
	};
};

/** Publishes onto the real ai-mate bus once on mount. */
const Publisher = ({ payload }: { payload: Payload }) => {
	const publish = usePublish('ai-mate');
	React.useEffect(() => {
		publish(payload);
	}, [publish, payload]);
	return null;
};

/**
 * Mirrors a real Jira view-context publisher: publishes on mount and clears its slot on unmount
 * (`setContext` returning `undefined`), which is how a route change stops showing stale context.
 */
const ClearingPublisher = ({ payload }: { payload: Payload }) => {
	const publish = usePublish('ai-mate');
	React.useEffect(() => {
		publish(payload);
		return () => {
			const { data, ...rest } = payload as unknown as { data: { contextKey: string } };
			publish({
				...rest,
				data: { contextKey: data.contextKey, setContext: () => undefined },
			} as unknown as Payload);
		};
	}, [publish, payload]);
	return null;
};

/** Records everything on the ai-mate bus, to observe the Client's re-publishes. */
const BusRecorder = ({ onPayload }: { onPayload: (payload: Payload) => void }) => {
	useSubscribeAll(onPayload);
	return null;
};

const editorContext = (overrides: Record<string, unknown> = {}) =>
	({
		type: 'editor-context-payload',
		source: 'confluence',
		data: {
			document: { type: 'text/adf', content: '{}' },
			selection: { type: 'text/plain', content: 'hello world' },
			...overrides,
		},
	}) as unknown as Payload;

// Default gate state is ON; gate-off cases opt out explicitly.
const disableBridgeGate = () => setBooleanFeatureFlagResolver(() => false);

beforeEach(() => {
	setBooleanFeatureFlagResolver((key) => key === BRIDGE_FEATURE_GATE);
	jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
	disableBridgeGate();
	jest.restoreAllMocks();
});

// Both bridge components are headless (they render `null` and only mirror bus
// traffic), so there is no UI surface to assert accessibility against.
describe('ExtensionContextBridgeHost', () => {
	it('relays an allowlisted product payload to the extension', () => {
		const { transport, sent } = createFakeTransport();

		render(
			<>
				<ExtensionContextBridgeHost transport={transport} />
				<Publisher payload={editorContext()} />
			</>,
		);

		expect(sent).toHaveLength(1);
		const [message] = sent as BridgeMessage[];
		expect(message[BRIDGE_MESSAGE_MARKER]).toBe(true);
		expect(message.direction).toBe(BRIDGE_TO_EXTENSION);
		expect(message.payload.type).toBe('editor-context-payload');
	});

	it('sends nothing when the gate is off', () => {
		disableBridgeGate();
		const { transport, sent } = createFakeTransport();

		render(
			<>
				<ExtensionContextBridgeHost transport={transport} />
				<Publisher payload={editorContext()} />
			</>,
		);

		expect(sent).toHaveLength(0);
	});

	it('does not relay a denylisted control event', () => {
		const { transport, sent } = createFakeTransport();
		const chatOpen = {
			type: 'chat-open',
			source: 'confluence',
			data: { channelId: 'c1' },
		} as unknown as Payload;

		render(
			<>
				<ExtensionContextBridgeHost transport={transport} />
				<Publisher payload={chatOpen} />
			</>,
		);

		expect(sent).toHaveLength(0);
	});

	it('does not relay a payload that is merely absent from the allowlist', () => {
		const { transport, sent } = createFakeTransport();
		const browserContext = {
			type: 'browser-context-payload',
			source: 'confluence',
			data: {},
		} as unknown as Payload;

		render(
			<>
				<ExtensionContextBridgeHost transport={transport} />
				<Publisher payload={browserContext} />
			</>,
		);

		expect(sent).toHaveLength(0);
	});

	it('ignores payloads the bridge itself injected, so nothing ping-pongs', () => {
		const { transport, sent } = createFakeTransport();
		const mirrored = {
			...editorContext(),
			interactionSource: BRIDGE_SOURCE,
		} as unknown as Payload;

		render(
			<>
				<ExtensionContextBridgeHost transport={transport} />
				<Publisher payload={mirrored} />
			</>,
		);

		expect(sent).toHaveLength(0);
	});

	it('stamps the registered content target id onto editor-context-payload when the product supplied none', () => {
		const { transport, sent } = createFakeTransport();

		render(
			<>
				<ExtensionContextBridgeHost transport={transport} getContentId={() => '999888'} />
				<Publisher payload={editorContext()} />
			</>,
		);

		const [message] = sent as BridgeMessage[];
		const data = message.payload.data as { contentMauiId?: string };
		expect(data.contentMauiId).toBe('999888');
	});

	it('does not overwrite a contentMauiId the product already supplied', () => {
		const { transport, sent } = createFakeTransport();

		render(
			<>
				<ExtensionContextBridgeHost transport={transport} getContentId={() => '999888'} />
				<Publisher payload={editorContext({ contentMauiId: 'real-maui-id' })} />
			</>,
		);

		const [message] = sent as BridgeMessage[];
		const data = message.payload.data as { contentMauiId?: string };
		expect(data.contentMauiId).toBe('real-maui-id');
	});

	it('relays nothing when the consumer reports the viewer is not entitled to AI', () => {
		const { transport, sent } = createFakeTransport();

		render(
			<>
				<ExtensionContextBridgeHost transport={transport} isAiEnabled={false} />
				<Publisher payload={editorContext()} />
			</>,
		);

		expect(sent).toHaveLength(0);
	});

	it.each([
		['entitlement is confirmed', true],
		['the consumer expressed no opinion', undefined],
	])('relays when %s', (_label, isAiEnabled) => {
		const { transport, sent } = createFakeTransport();

		render(
			<>
				<ExtensionContextBridgeHost transport={transport} isAiEnabled={isAiEnabled} />
				<Publisher payload={editorContext()} />
			</>,
		);

		expect(sent).toHaveLength(1);
	});

	it('leaves contentMauiId unset when no content target is registered', () => {
		const { transport, sent } = createFakeTransport();

		render(
			<>
				<ExtensionContextBridgeHost transport={transport} />
				<Publisher payload={editorContext()} />
			</>,
		);

		const [message] = sent as BridgeMessage[];
		const data = message.payload.data as { contentMauiId?: string };
		expect(data.contentMauiId).toBeUndefined();
	});
});

// Both bridge components are headless (they render `null` and only mirror bus
// traffic), so there is no UI surface to assert accessibility against.
describe('ExtensionContextBridgeClient', () => {
	const inbound = (data: unknown): BridgeMessage => ({
		[BRIDGE_MESSAGE_MARKER]: true,
		direction: BRIDGE_TO_EXTENSION,
		payload: { type: 'editor-context-payload', source: 'confluence', data },
	});

	it('re-publishes inbound context onto the iframe bus with the loop-guard sentinel', () => {
		const { transport, deliver } = createFakeTransport();
		const seen: Payload[] = [];

		render(
			<>
				<ExtensionContextBridgeClient transport={transport} />
				<BusRecorder onPayload={(p) => seen.push(p)} />
			</>,
		);

		deliver(inbound({ document: { type: 'text/adf', content: '{}' } }));

		expect(seen).toHaveLength(1);
		expect(seen[0].type).toBe('editor-context-payload');
		expect(seen[0].interactionSource).toBe(BRIDGE_SOURCE);
	});

	it('does not re-publish inbound messages addressed to the product', () => {
		const { transport, deliver } = createFakeTransport();
		const seen: Payload[] = [];

		render(
			<>
				<ExtensionContextBridgeClient transport={transport} />
				<BusRecorder onPayload={(p) => seen.push(p)} />
			</>,
		);

		deliver({ ...inbound({}), direction: BRIDGE_TO_PRODUCT });

		expect(seen).toHaveLength(0);
	});

	const setChatFocused = (focused: boolean) =>
		jest.spyOn(document, 'hasFocus').mockReturnValue(focused);

	const lastSelectionOf = (seen: Payload[]) =>
		(seen[seen.length - 1] as unknown as { data: { selection?: { content: string } } }).data
			.selection;

	it('preserves the last selection when the editor reports none and the chat has focus', () => {
		setChatFocused(true);
		const { transport, deliver } = createFakeTransport();
		const seen: Payload[] = [];

		render(
			<>
				<ExtensionContextBridgeClient transport={transport} />
				<BusRecorder onPayload={(p) => seen.push(p)} />
			</>,
		);

		// 1. Editor reports a selection.
		deliver(
			inbound({
				document: { type: 'text/adf', content: '{}' },
				selection: { type: 'text/plain', content: 'hello world' },
			}),
		);
		// 2. Focus moves to the chat input; Confluence clears the selection.
		deliver(inbound({ document: { type: 'text/adf', content: '{}' } }));

		expect(lastSelectionOf(seen)?.content).toBe('hello world');
	});

	it('drops the selection when the editor reports none and focus is still in the page', () => {
		setChatFocused(false);
		const { transport, deliver } = createFakeTransport();
		const seen: Payload[] = [];

		render(
			<>
				<ExtensionContextBridgeClient transport={transport} />
				<BusRecorder onPayload={(p) => seen.push(p)} />
			</>,
		);

		deliver(
			inbound({
				document: { type: 'text/adf', content: '{}' },
				selection: { type: 'text/plain', content: 'hello world' },
			}),
		);
		// The user deselected rather than moving into the chat, so context must fall back to the page.
		deliver(inbound({ document: { type: 'text/adf', content: '{}' } }));

		expect(lastSelectionOf(seen)).toBeUndefined();
	});

	it('does not resurrect a selection dropped by a real deselection', () => {
		setChatFocused(false);
		const { transport, deliver } = createFakeTransport();
		const seen: Payload[] = [];

		render(
			<>
				<ExtensionContextBridgeClient transport={transport} />
				<BusRecorder onPayload={(p) => seen.push(p)} />
			</>,
		);

		deliver(
			inbound({
				document: { type: 'text/adf', content: '{}' },
				selection: { type: 'text/plain', content: 'hello world' },
			}),
		);
		deliver(inbound({ document: { type: 'text/adf', content: '{}' } }));

		// Focus later moves into the chat. The old selection is gone and must not come back.
		setChatFocused(true);
		deliver(inbound({ document: { type: 'text/adf', content: '{}' } }));

		expect(lastSelectionOf(seen)).toBeUndefined();
	});

	it('forgets the preserved selection once the editor switches to view mode', () => {
		const { transport, deliver } = createFakeTransport();
		const seen: Payload[] = [];

		render(
			<>
				<ExtensionContextBridgeClient transport={transport} />
				<BusRecorder onPayload={(p) => seen.push(p)} />
			</>,
		);

		deliver(
			inbound({
				document: { type: 'text/adf', content: '{}' },
				selection: { type: 'text/plain', content: 'hello world' },
			}),
		);
		deliver(inbound({ document: { type: 'text/adf', content: '{}' }, isViewMode: true }));
		deliver(inbound({ document: { type: 'text/adf', content: '{}' } }));

		const last = seen[seen.length - 1] as unknown as {
			data: { selection?: { content: string } };
		};
		expect(last.data.selection).toBeUndefined();
	});

	it('forwards an allowlisted chat action back to the product', () => {
		const { transport, sent } = createFakeTransport();
		const suggestion = {
			type: 'editor-suggestion',
			source: 'rovo-chat',
			data: { content: { type: 'text/adf', adf: '{}' } },
		} as unknown as Payload;

		render(
			<>
				<ExtensionContextBridgeClient transport={transport} />
				<Publisher payload={suggestion} />
			</>,
		);

		const outbound = (sent as BridgeMessage[])
			.filter((m) => 'payload' in m)
			.filter((m) => m.direction === BRIDGE_TO_PRODUCT);
		expect(outbound).toHaveLength(1);
		expect(outbound[0].payload.type).toBe('editor-suggestion');
	});

	it('does not forward chat-internal chatter to the product', () => {
		const { transport, sent } = createFakeTransport();

		render(
			<>
				<ExtensionContextBridgeClient transport={transport} />
				<Publisher payload={editorContext()} />
			</>,
		);

		// Payload sends only: the mount-time `request-context` handshake carries no payload.
		expect((sent as BridgeMessage[]).filter((m) => 'payload' in m)).toHaveLength(0);
	});

	it('is inert when the gate is off', () => {
		disableBridgeGate();
		const { transport, sent } = createFakeTransport();
		const suggestion = {
			type: 'editor-suggestion',
			source: 'rovo-chat',
			data: {},
		} as unknown as Payload;

		render(
			<>
				<ExtensionContextBridgeClient transport={transport} />
				<Publisher payload={suggestion} />
			</>,
		);

		expect(sent).toHaveLength(0);
	});

	// The Client builds its own `postMessage` transport when the consumer passes none, and pins it to
	// the side panel origin the extension supplies as a URL parameter. No parameter means this
	// document is not framed by the side panel, so there is no peer and no transport.
	describe('default transport origin pinning', () => {
		const SIDE_PANEL_ORIGIN = 'chrome-extension://abcdefghijklmnopabcdefghijklmnop';
		const realLocation = window.location;

		const setSearch = (search: string): void => {
			Object.defineProperty(window, 'location', {
				value: { ...realLocation, search, origin: realLocation.origin },
				writable: true,
				configurable: true,
			});
		};

		const deliverFrom = (origin: string, data: unknown): void => {
			window.dispatchEvent(new MessageEvent('message', { data, origin }));
		};

		afterEach(() => {
			Object.defineProperty(window, 'location', {
				value: realLocation,
				writable: true,
				configurable: true,
			});
		});

		// Defaults to the one known origin, so each case below varies only the thing it is about.
		const renderClient = (allowedOrigins: readonly string[] | undefined = [SIDE_PANEL_ORIGIN]) => {
			const seen: Payload[] = [];
			render(
				<>
					<ExtensionContextBridgeClient allowedOrigins={allowedOrigins} />
					<BusRecorder onPayload={(p) => seen.push(p)} />
				</>,
			);
			return seen;
		};

		it('re-publishes context that arrived from the side panel', () => {
			setSearch(`?extensionOrigin=${encodeURIComponent(SIDE_PANEL_ORIGIN)}`);
			const seen = renderClient();

			deliverFrom(SIDE_PANEL_ORIGIN, inbound({ document: { type: 'text/adf', content: '{}' } }));

			expect(seen).toHaveLength(1);
			expect(seen[0].type).toBe('editor-context-payload');
		});

		it('drops context from an origin other than the side panel', () => {
			setSearch(`?extensionOrigin=${encodeURIComponent(SIDE_PANEL_ORIGIN)}`);
			const seen = renderClient();

			deliverFrom('https://not-the-peer.example.com', inbound({}));

			expect(seen).toHaveLength(0);
		});

		// The parameter only selects which allowed origin is the peer; it can never introduce one. The
		// foreign-extension case is the one that matters: an extension holding `declarativeNetRequest`
		// can strip this app's `frame-ancestors` header, frame the chat itself, and name its own origin
		// here. Matching on the scheme alone would accept that.
		it.each([
			['another extension', 'chrome-extension://mallorymallorymallorymallorymal'],
			['a web origin', 'https://attacker.example.com'],
			['the wildcard', '*'],
			['an empty value', ''],
		])('builds no transport when the parameter names %s', (_label, value) => {
			setSearch(`?extensionOrigin=${encodeURIComponent(value)}`);
			const seen = renderClient();

			deliverFrom(value, inbound({ document: { type: 'text/adf', content: '{}' } }));

			expect(seen).toHaveLength(0);
		});

		it('builds no transport when the parameter is missing', () => {
			setSearch('');
			const seen = renderClient();

			deliverFrom(SIDE_PANEL_ORIGIN, inbound({}));
			deliverFrom(window.location.origin, inbound({}));

			expect(seen).toHaveLength(0);
		});

		it('builds no transport when the list is empty, even with a valid parameter', () => {
			setSearch(`?extensionOrigin=${encodeURIComponent(SIDE_PANEL_ORIGIN)}`);
			const seen = renderClient([]);

			deliverFrom(SIDE_PANEL_ORIGIN, inbound({ document: { type: 'text/adf', content: '{}' } }));

			expect(seen).toHaveLength(0);
		});

		// Omits the prop rather than passing `undefined`, which `renderClient`'s default would absorb.
		it('builds no transport when the consumer supplies no list at all', () => {
			setSearch(`?extensionOrigin=${encodeURIComponent(SIDE_PANEL_ORIGIN)}`);
			const seen: Payload[] = [];
			render(
				<>
					<ExtensionContextBridgeClient />
					<BusRecorder onPayload={(p) => seen.push(p)} />
				</>,
			);

			deliverFrom(SIDE_PANEL_ORIGIN, inbound({ document: { type: 'text/adf', content: '{}' } }));

			expect(seen).toHaveLength(0);
		});

		// `window.parent` is `window` under jsdom, so the outbound `postMessage` lands here. The
		// inbound cases above only prove nothing is received; a transport could exist and still leak
		// outbound. These two cover that half.
		const suggestion = {
			type: 'editor-suggestion',
			source: 'rovo-chat',
			data: { content: { type: 'text/adf', adf: '{}' } },
		} as unknown as Payload;

		const bridgeSends = (spy: jest.SpyInstance) =>
			spy.mock.calls.filter(
				([message]) => (message as Record<string, unknown>)?.[BRIDGE_MESSAGE_MARKER],
			);

		const renderPublishingClient = (allowedOrigins: readonly string[] = [SIDE_PANEL_ORIGIN]) => {
			const postMessage = jest.spyOn(window, 'postMessage').mockImplementation(() => {});
			render(
				<>
					<ExtensionContextBridgeClient allowedOrigins={allowedOrigins} />
					<Publisher payload={suggestion} />
				</>,
			);
			return postMessage;
		};

		it('posts an outbound action to the side panel origin, never the wildcard', () => {
			setSearch(`?extensionOrigin=${encodeURIComponent(SIDE_PANEL_ORIGIN)}`);

			const postMessage = renderPublishingClient();

			// Both sends — the mount-time handshake and the action — must be pinned to the panel origin.
			const sends = bridgeSends(postMessage);
			expect(sends.length).toBeGreaterThan(0);
			sends.forEach(([, origin]: [unknown, string]) => {
				expect(origin).toBe(SIDE_PANEL_ORIGIN);
			});
		});

		it('sends nothing outbound when the side panel origin is unknown', () => {
			setSearch('');

			const postMessage = renderPublishingClient();

			expect(bridgeSends(postMessage)).toHaveLength(0);
		});

		it('sends nothing outbound to an extension that is not on the list', () => {
			setSearch(`?extensionOrigin=${encodeURIComponent('chrome-extension://mallorymallorymal')}`);

			const postMessage = renderPublishingClient();

			expect(bridgeSends(postMessage)).toHaveLength(0);
		});
	});
});

describe('context handshake', () => {
	/** A Jira-style view context: published once per navigation, REPLACE-style. */
	const viewContext = (jql: string) =>
		({
			type: 'set-message-context',
			source: 'jira-board',
			product: 'jira',
			data: {
				contextKey: 'jira_view_context',
				setContext: () => ({ viewType: 'board', jqlStrings: [jql] }),
			},
		}) as unknown as Payload;

	const requestContext = () =>
		({
			[BRIDGE_MESSAGE_MARKER]: true,
			direction: BRIDGE_TO_PRODUCT,
			control: BRIDGE_CONTROL_REQUEST_CONTEXT,
		}) as unknown as BridgeMessage;

	const payloadSends = (sent: unknown[]) => (sent as BridgeMessage[]).filter((m) => 'payload' in m);

	it('re-sends the last context when the chat asks, so a chat opened later is caught up', () => {
		// The flow this exists for: the board publishes once, then the user opens the side panel.
		const { transport, sent, deliver } = createFakeTransport();

		render(
			<>
				<ExtensionContextBridgeHost transport={transport} />
				<Publisher payload={viewContext('project = KAN')} />
			</>,
		);
		expect(payloadSends(sent)).toHaveLength(1);

		deliver(requestContext());

		const relayed = payloadSends(sent);
		expect(relayed).toHaveLength(2);
		expect(relayed[1].payload.type).toBe('set-message-context');
		expect(relayed[1].payload.data).toEqual({
			contextKey: 'jira_view_context',
			value: { viewType: 'board', jqlStrings: ['project = KAN'] },
		});
	});

	it('re-sends only the newest value for a context slot', () => {
		const { transport, sent, deliver } = createFakeTransport();
		const { rerender } = render(
			<>
				<ExtensionContextBridgeHost transport={transport} />
				<Publisher payload={viewContext('project = KAN')} />
			</>,
		);
		rerender(
			<>
				<ExtensionContextBridgeHost transport={transport} />
				<Publisher payload={viewContext('assignee = currentUser()')} />
			</>,
		);
		const beforeRequest = payloadSends(sent).length;

		deliver(requestContext());

		// One replay, carrying the later JQL — not one per publish.
		const relayed = payloadSends(sent);
		expect(relayed).toHaveLength(beforeRequest + 1);
		expect(relayed[relayed.length - 1].payload.data).toEqual({
			contextKey: 'jira_view_context',
			value: { viewType: 'board', jqlStrings: ['assignee = currentUser()'] },
		});
	});

	it('replays the cleared slot after the view is gone, not the context it used to show', () => {
		// Jira is an SPA and the Host lives in the nav, so it does not unmount between routes.
		// Staleness is prevented by the publisher, which clears its slot on unmount; every Jira
		// view-context publisher does this. This pins that contract: a chat opened on a later
		// route must not be handed the previous board's JQL.
		const { transport, sent, deliver } = createFakeTransport();
		const { rerender } = render(
			<>
				<ExtensionContextBridgeHost transport={transport} />
				<ClearingPublisher payload={viewContext('project = KAN')} />
			</>,
		);
		expect(payloadSends(sent)).toHaveLength(1);

		// Route change: the board unmounts (clearing its slot) and the next view publishes nothing.
		rerender(<ExtensionContextBridgeHost transport={transport} />);

		deliver(requestContext());

		const relayed = payloadSends(sent);
		const replay = relayed[relayed.length - 1];
		expect(replay.payload.data).toEqual({ contextKey: 'jira_view_context' });
		expect(JSON.stringify(replay)).not.toContain('project = KAN');
	});

	it('answers with nothing when the product never published', () => {
		const { transport, sent, deliver } = createFakeTransport();
		render(<ExtensionContextBridgeHost transport={transport} />);

		deliver(requestContext());

		expect(payloadSends(sent)).toHaveLength(0);
	});

	it('ignores a request once the viewer is not entitled to Rovo', () => {
		// Entitlement can change while the page is open, so the check cannot only happen at relay time.
		const { transport, sent, deliver } = createFakeTransport();
		const { rerender } = render(
			<>
				<ExtensionContextBridgeHost transport={transport} isAiEnabled />
				<Publisher payload={viewContext('project = KAN')} />
			</>,
		);
		expect(payloadSends(sent)).toHaveLength(1);

		rerender(
			<>
				<ExtensionContextBridgeHost transport={transport} isAiEnabled={false} />
				<Publisher payload={viewContext('project = KAN')} />
			</>,
		);
		deliver(requestContext());

		expect(payloadSends(sent)).toHaveLength(1);
	});

	it('asks for context as soon as the chat mounts', () => {
		const { transport, sent } = createFakeTransport();

		render(<ExtensionContextBridgeClient transport={transport} />);

		expect(sent).toEqual([
			{
				[BRIDGE_MESSAGE_MARKER]: true,
				direction: BRIDGE_TO_PRODUCT,
				control: BRIDGE_CONTROL_REQUEST_CONTEXT,
			},
		]);
	});

	it('does not ask when the gate is off', () => {
		disableBridgeGate();
		const { transport, sent } = createFakeTransport();

		render(<ExtensionContextBridgeClient transport={transport} />);

		expect(sent).toHaveLength(0);
	});
});
