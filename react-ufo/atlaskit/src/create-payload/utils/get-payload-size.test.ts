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
});
