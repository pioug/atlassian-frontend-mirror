/**
 * @jest-environment node
 */

import { capturePayload } from '../payload-capture';
import { mutableValidPayload, result } from './_utils/test-payload-helper';

describe('capturePayload', () => {
	it('deep clones and recursively freezes the payload without freezing provider-owned objects', () => {
		const requestContext = {
			identifiers: { AtlassianAccountId: 'before' },
			attributes: { plan: 'free' } as Record<string, string>,
		};
		const payload = mutableValidPayload({
			requestContext,
			flags: {
				'flag-a': result({
					returnType: 'JSON',
					value: {
						nested: ['before'],
					},
				}),
			},
		});

		const capturedPayload = capturePayload(payload);
		if (capturedPayload === null) {
			throw new Error('Expected payload capture to succeed');
		}

		requestContext.identifiers.AtlassianAccountId = 'after';
		requestContext.attributes = { plan: 'enterprise' };
		const originalValue = payload.flags['flag-a']?.value;
		if (isNestedValue(originalValue)) {
			originalValue.nested.push('after');
		}

		expect(Object.isFrozen(payload)).toBe(false);
		expect(Object.isFrozen(requestContext)).toBe(false);
		expect(Object.isFrozen(capturedPayload)).toBe(true);
		expect(Object.isFrozen(capturedPayload.requestContext)).toBe(true);
		expect(Object.isFrozen(capturedPayload.flags['flag-a']?.value)).toBe(true);
		expect(capturedPayload.requestContext?.identifiers.AtlassianAccountId).toBe('before');
		expect(capturedPayload.requestContext?.attributes.plan).toBe('free');
		expect(capturedPayload.flags['flag-a']?.value).toEqual({ nested: ['before'] });
	});

	it('captures and freezes per-flag metadata arrays, objects, and their entries', () => {
		const holdoutAllocation = { holdoutKey: 'h1' };
		const targetApps = ['jira-frontend'];
		const payload = mutableValidPayload({
			flags: {
				'flag-a': result({
					metadata: {
						matchReason: 'holdout_match',
						holdoutAllocation,
						segments: [{ segmentKey: 's1' }],
						targetApps,
						flagVersion: '7',
						errorMessage: 'partial evaluation',
					},
				}),
			},
		});

		const capturedMetadata = capturePayload(payload)?.flags['flag-a']?.metadata;
		holdoutAllocation.holdoutKey = 'h2';
		targetApps.push('confluence-frontend');

		expect(capturedMetadata?.holdoutAllocation).toEqual({ holdoutKey: 'h1' });
		expect(capturedMetadata?.targetApps).toEqual(['jira-frontend']);
		expect(capturedMetadata?.flagVersion).toBe('7');
		expect(capturedMetadata?.errorMessage).toBe('partial evaluation');
		expect(Object.isFrozen(capturedMetadata?.holdoutAllocation)).toBe(true);
		expect(Object.isFrozen(capturedMetadata?.segments)).toBe(true);
		expect(Object.isFrozen(capturedMetadata?.targetApps)).toBe(true);
	});
});

describe('capturePayload with prepare', () => {
	it('prepares the private copy before freezing it and leaves the original untouched', () => {
		const original = { identifiers: { user: 'abc' } };
		const prepare = jest.fn((copy: typeof original) => ({ ...copy, attributes: {} }));

		const captured = capturePayload(original, prepare);

		expect(prepare).toHaveBeenCalledTimes(1);
		expect(prepare.mock.calls[0]?.[0]).not.toBe(original);
		expect(captured).toEqual({ identifiers: { user: 'abc' }, attributes: {} });
		expect(Object.isFrozen(captured)).toBe(true);
		expect(Object.isFrozen(captured?.attributes)).toBe(true);
		expect(original).toEqual({ identifiers: { user: 'abc' } });
		expect(Object.isFrozen(original)).toBe(false);
	});

	it('does not call prepare when the payload cannot be copied', () => {
		const prepare = jest.fn();
		const uncopyable = { self: undefined as unknown, fn: () => undefined };
		uncopyable.self = uncopyable;

		expect(capturePayload(uncopyable, prepare)).toBeNull();
		expect(prepare).not.toHaveBeenCalled();
	});
});

function isNestedValue(value: unknown): value is { nested: string[] } {
	return (
		typeof value === 'object' &&
		value !== null &&
		'nested' in value &&
		Array.isArray((value as { nested: unknown }).nested)
	);
}
