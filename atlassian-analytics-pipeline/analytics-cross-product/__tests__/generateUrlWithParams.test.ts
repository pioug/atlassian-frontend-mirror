import { generateUrlWithParams } from '../src/generateUrlWithParams';

describe('generateUrlWithParams', () => {
	test('should generate URL with all parameters', () => {
		const url = 'https://example.com';
		const bridge = 'testBridge';
		const interactionSessionId = '12345';
		const product = 'testProduct';
		const subProduct = 'testSubProduct';

		const result = generateUrlWithParams(url, bridge, interactionSessionId, product, subProduct);
		expect(result).toBe(
			'https://example.com/?xpis=eyJicmlkZ2UiOiJ0ZXN0QnJpZGdlIiwiaWQiOiIxMjM0NSIsInNvdXJjZSI6InRlc3RQcm9kdWN0LXRlc3RTdWJQcm9kdWN0In0%3D',
		);
	});

	test('should generate URL without subProduct if not provided', () => {
		const url = 'https://example.com';
		const bridge = 'testBridge';
		const interactionSessionId = '12345';
		const product = 'testProduct';

		const result = generateUrlWithParams(url, bridge, interactionSessionId, product);
		expect(result).toBe(
			'https://example.com/?xpis=eyJicmlkZ2UiOiJ0ZXN0QnJpZGdlIiwiaWQiOiIxMjM0NSIsInNvdXJjZSI6InRlc3RQcm9kdWN0In0%3D',
		);
	});

	describe('Relative URLs', () => {
		test('should generate parameters for relative URL', () => {
			const url = '/a/partial/url';
			const bridge = 'testBridge';
			const interactionSessionId = '12345';
			const product = 'testProduct';
			const subProduct = 'testSubProduct';

			const result = generateUrlWithParams(url, bridge, interactionSessionId, product, subProduct);
			expect(result).toBe(
				'/a/partial/url?xpis=eyJicmlkZ2UiOiJ0ZXN0QnJpZGdlIiwiaWQiOiIxMjM0NSIsInNvdXJjZSI6InRlc3RQcm9kdWN0LXRlc3RTdWJQcm9kdWN0In0%3D',
			);
		});

		test('should generate parameters for relative URL with existing query parameters', () => {
			const url = '/a/partial/url?existing=param';
			const bridge = 'testBridge';
			const interactionSessionId = '12345';
			const product = 'testProduct';
			const subProduct = 'testSubProduct';

			const result = generateUrlWithParams(url, bridge, interactionSessionId, product, subProduct);
			expect(result).toBe(
				'/a/partial/url?existing=param&xpis=eyJicmlkZ2UiOiJ0ZXN0QnJpZGdlIiwiaWQiOiIxMjM0NSIsInNvdXJjZSI6InRlc3RQcm9kdWN0LXRlc3RTdWJQcm9kdWN0In0%3D',
			);
		});
	});
});
