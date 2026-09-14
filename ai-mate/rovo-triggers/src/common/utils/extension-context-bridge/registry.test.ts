import { type Payload } from '../../../types';

import { BRIDGE_MESSAGE_MARKER, BRIDGE_SOURCE, BRIDGE_TO_EXTENSION } from './constants';
import { getInboundDecision, isRelayableContextKey, shouldRelayToProduct } from './policy';
import { deserializePayload, serializePayload } from './registry';
import { isBridgeMessage } from './transport';

describe('inbound (product → extension) policy', () => {
	it('allows the seeded Confluence-first context types', () => {
		expect(getInboundDecision('editor-context-payload')).toBe('allow');
		expect(getInboundDecision('set-message-context')).toBe('allow');
	});

	it('drops types that are simply not on the allowlist', () => {
		expect(getInboundDecision('browser-context-payload')).toBe('not-allowlisted');
	});

	it.each([
		'message-send',
		'chat-new',
		'chat-open',
		'chat-close',
		'open-smart-creation-modal',
		'open-browse-agent-modal',
		'open-browse-agent-sidebar',
		'open-chat-debug-modal',
		'open-chat-feedback-modal',
		'forge-auth-success',
		'forge-auth-failure',
		'chat-smartlink-3p-post-auth-launch',
	] satisfies Payload['type'][])('denylists the control/auth event %s', (type) => {
		expect(getInboundDecision(type)).toBe('denylisted');
	});

	it('keeps the denylist authoritative over the allowlist', () => {
		// A denylisted type must never resolve to 'allow', regardless of allowlist contents.
		expect(getInboundDecision('chat-open')).not.toBe('allow');
	});
});

describe('inbound set-message-context contextKey policy', () => {
	it('allows the seeded Jira view context key', () => {
		expect(isRelayableContextKey('jira_view_context')).toBe(true);
	});

	it('refuses keys nobody has opted in, so new publishers cannot cross by default', () => {
		expect(isRelayableContextKey('pinned_object_context')).toBe(false);
		expect(isRelayableContextKey('projectContext')).toBe(false);
		expect(isRelayableContextKey('')).toBe(false);
	});

	it('drops a replace-style payload whose contextKey is not allowlisted', () => {
		const payload = {
			type: 'set-message-context',
			source: 'jira',
			data: { contextKey: 'not_opted_in', setContext: () => ({ secret: 'value' }) },
		} as unknown as Payload;

		expect(serializePayload(payload)).toBeNull();
	});

	it('never invokes setContext for a key that is not allowlisted', () => {
		const setContext = jest.fn(() => ({ secret: 'value' }));
		const payload = {
			type: 'set-message-context',
			source: 'jira',
			data: { contextKey: 'not_opted_in', setContext },
		} as unknown as Payload;

		serializePayload(payload);

		expect(setContext).not.toHaveBeenCalled();
	});
});

describe('outbound (extension → product) policy', () => {
	it('allows only the seeded write action', () => {
		expect(shouldRelayToProduct('editor-suggestion')).toBe(true);
	});

	it('blocks context and control types from travelling back to the product', () => {
		expect(shouldRelayToProduct('editor-context-payload')).toBe(false);
		expect(shouldRelayToProduct('chat-open')).toBe(false);
		expect(shouldRelayToProduct('set-message-context')).toBe(false);
	});
});

describe('serializePayload', () => {
	it('round-trips a plain context payload and preserves envelope fields', () => {
		const payload = {
			type: 'editor-context-payload',
			source: 'confluence',
			product: 'confluence',
			data: { document: { type: 'text/adf', content: '{}' } },
		} as unknown as Payload;

		const serialized = serializePayload(payload);

		expect(serialized).toEqual({
			type: 'editor-context-payload',
			source: 'confluence',
			product: 'confluence',
			openChat: undefined,
			data: { document: { type: 'text/adf', content: '{}' } },
		});
	});

	it('strips functions from generic payload data rather than throwing', () => {
		const payload = {
			type: 'editor-context-payload',
			source: 'confluence',
			data: { keep: 'yes', drop: () => 'no' },
		} as unknown as Payload;

		expect(serializePayload(payload)?.data).toEqual({ keep: 'yes' });
	});

	it('drops payloads whose data cannot be cloned', () => {
		const circular: Record<string, unknown> = {};
		circular.self = circular;
		const payload = {
			type: 'editor-context-payload',
			source: 'confluence',
			data: circular,
		} as unknown as Payload;

		expect(serializePayload(payload)).toBeNull();
	});

	it('resolves replace-style set-message-context into a cloneable value', () => {
		const payload = {
			type: 'set-message-context',
			source: 'jira',
			data: { contextKey: 'jira_view_context', setContext: () => ({ issueKey: 'ABC-1' }) },
		} as unknown as Payload;

		expect(serializePayload(payload)?.data).toEqual({
			contextKey: 'jira_view_context',
			value: { issueKey: 'ABC-1' },
		});
	});

	it('drops merge-style set-message-context, which cannot cross the boundary', () => {
		const payload = {
			type: 'set-message-context',
			source: 'confluence',
			data: {
				// Allowlisted throughout this block, so each drop is attributable to the shape under test
				// rather than to the contextKey.
				contextKey: 'jira_view_context',
				setContext: (ctx: { a: number }) => ({ ...ctx, b: 2 }),
			},
		} as unknown as Payload;

		expect(serializePayload(payload)).toBeNull();
	});

	it('drops a pure pass-through setContext', () => {
		const payload = {
			type: 'set-message-context',
			source: 'confluence',
			data: {
				contextKey: 'jira_view_context',
				setContext: (ctx: unknown) => ({ ...(ctx as object) }),
			},
		} as unknown as Payload;

		expect(serializePayload(payload)).toBeNull();
	});

	it('does not leak the merge probe into a resolved replace-style value', () => {
		const payload = {
			type: 'set-message-context',
			source: 'jira',
			data: { contextKey: 'jira_view_context', setContext: () => ({ issueKey: 'ABC-1' }) },
		} as unknown as Payload;

		expect(JSON.stringify(serializePayload(payload)?.data)).not.toContain('MergeProbe');
	});

	it('drops set-message-context whose setContext throws', () => {
		const payload = {
			type: 'set-message-context',
			source: 'confluence',
			data: {
				contextKey: 'jira_view_context',
				setContext: () => {
					throw new Error('needs real context');
				},
			},
		} as unknown as Payload;

		expect(serializePayload(payload)).toBeNull();
	});
});

describe('deserializePayload', () => {
	it('stamps the loop-guard sentinel so mirrored payloads are not re-mirrored', () => {
		const result = deserializePayload({
			type: 'editor-context-payload',
			source: 'confluence',
			data: { document: { type: 'text/adf', content: '{}' } },
		});

		expect(result?.interactionSource).toBe(BRIDGE_SOURCE);
	});

	it('falls back to the bridge sentinel when no source travelled on the wire', () => {
		const result = deserializePayload({ type: 'editor-context-payload', data: undefined });

		expect(result?.source).toBe(BRIDGE_SOURCE);
	});

	it('rebuilds a callable setContext for set-message-context', () => {
		const result = deserializePayload({
			type: 'set-message-context',
			source: 'jira',
			data: { contextKey: 'jira_view_context', value: { issueKey: 'ABC-1' } },
		}) as unknown as { data: { contextKey: string; setContext: (ctx: unknown) => unknown } };

		expect(result.data.contextKey).toBe('jira_view_context');
		expect(result.data.setContext(undefined)).toEqual({ issueKey: 'ABC-1' });
	});

	it('survives a full serialize → deserialize round trip of set-message-context', () => {
		const payload = {
			type: 'set-message-context',
			source: 'jira',
			data: { contextKey: 'jira_view_context', setContext: () => ({ issueKey: 'ABC-1' }) },
		} as unknown as Payload;

		const serialized = serializePayload(payload);
		const restored = deserializePayload(serialized!) as unknown as {
			data: { setContext: (ctx: unknown) => unknown };
		};

		expect(restored.data.setContext(undefined)).toEqual({ issueKey: 'ABC-1' });
	});
});

describe('isBridgeMessage', () => {
	const validMessage = {
		[BRIDGE_MESSAGE_MARKER]: true,
		direction: BRIDGE_TO_EXTENSION,
		payload: { type: 'editor-context-payload', data: {} },
	};

	it('accepts a well-formed bridge message', () => {
		expect(isBridgeMessage(validMessage)).toBe(true);
	});

	it('rejects a null payload, which `typeof === "object"` would otherwise allow through', () => {
		expect(isBridgeMessage({ ...validMessage, payload: null })).toBe(false);
	});

	it('rejects messages without the bridge marker', () => {
		expect(isBridgeMessage({ direction: BRIDGE_TO_EXTENSION, payload: {} })).toBe(false);
	});

	it('rejects non-object values', () => {
		expect(isBridgeMessage(null)).toBe(false);
		expect(isBridgeMessage(undefined)).toBe(false);
		expect(isBridgeMessage('nope')).toBe(false);
	});
});
