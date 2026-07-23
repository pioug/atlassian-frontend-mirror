import getPayloadSize from './get-payload-size';

describe('getPayloadSize', () => {
	it('should calculate size for empty object', () => {
		const payload = {};
		const result = getPayloadSize(payload);

		// Empty object JSON is "{}", which is 2 bytes
		expect(result).toBe(Math.round(2 / 1024));
	});

	it('should calculate size for simple object', () => {
		const payload = { key: 'value' };
		const result = getPayloadSize(payload);

		const jsonString = JSON.stringify(payload);
		const expectedSize = Math.round(new TextEncoder().encode(jsonString).length / 1024);
		expect(result).toBe(expectedSize);
	});

	it('should calculate size for complex nested object', () => {
		const payload = {
			string: 'test',
			number: 123,
			boolean: true,
			array: [1, 2, 3],
			nested: {
				deep: {
					value: 'nested',
				},
			},
			nullValue: null,
		};

		const result = getPayloadSize(payload);

		const jsonString = JSON.stringify(payload);
		const expectedSize = Math.round(new TextEncoder().encode(jsonString).length / 1024);
		expect(result).toBe(expectedSize);
	});

	it('should handle large objects', () => {
		const largePayload = {
			data: new Array(1000).fill('x').join(''),
			items: new Array(100).fill({ id: 1, name: 'test item' }),
		};

		const result = getPayloadSize(largePayload);

		expect(result).toBeGreaterThan(0);
		expect(typeof result).toBe('number');
	});

	it('should handle objects with special characters', () => {
		const payload = {
			unicode: '🚀🎉',
			special: 'line\nbreak\ttab"quote',
			emoji: '👍',
		};

		const result = getPayloadSize(payload);

		const jsonString = JSON.stringify(payload);
		const expectedSize = Math.round(new TextEncoder().encode(jsonString).length / 1024);
		expect(result).toBe(expectedSize);
	});

	it('should return integer value', () => {
		const payload = { test: 'value' };
		const result = getPayloadSize(payload);

		expect(Number.isInteger(result)).toBe(true);
	});

	describe('safe serializer', () => {
		it('calculates size metadata for circular payloads', () => {
			const payload: { circular?: unknown } = {};
			payload.circular = payload;

			const result = getPayloadSize(payload, { includeMetadata: true });

			expect(result).toEqual({
				sizeInKb: expect.any(Number),
				usedSafeSerializer: true,
				serializationFailed: false,
			});
			expect(result.sizeInKb).toBe(getPayloadSize(payload));
		});

		it('replaces DOM nodes and React internal properties when calculating size', () => {
			const element = document.createElement('a') as HTMLAnchorElement & {
				__reactFiber$test?: unknown;
			};
			const fiber = { stateNode: element };
			element.__reactFiber$test = fiber;

			const result = getPayloadSize({ element }, { includeMetadata: true });

			expect(result.usedSafeSerializer).toBe(true);
			expect(result.serializationFailed).toBe(false);
			expect(result.sizeInKb).toBeGreaterThanOrEqual(0);
		});

		it('replaces BigInt values when calculating size', () => {
			const result = getPayloadSize({ value: BigInt(123) }, { includeMetadata: true });

			expect(result.usedSafeSerializer).toBe(true);
			expect(result.serializationFailed).toBe(false);
			expect(result.sizeInKb).toBeGreaterThanOrEqual(0);
		});

		it('returns an over-budget fallback if safe JSON serialization still fails', () => {
			const payload = {
				toJSON() {
					throw new Error('serialization failed');
				},
			};

			const result = getPayloadSize(payload, { includeMetadata: true });

			expect(result).toEqual({
				sizeInKb: 1024,
				usedSafeSerializer: true,
				serializationFailed: true,
			});
		});
	});
});
