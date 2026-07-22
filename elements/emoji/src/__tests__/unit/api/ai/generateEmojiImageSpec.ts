import { generateEmojiImage } from '../../../../api/ai/generateEmojiImage';

const okResponse = (body: unknown): Response =>
	({
		ok: true,
		status: 200,
		json: async () => body,
	}) as unknown as Response;

describe('generateEmojiImage', () => {
	let fetchSpy: jest.SpiedFunction<typeof fetch>;

	beforeEach(() => {
		fetchSpy = jest.spyOn(global, 'fetch');
	});

	afterEach(() => {
		fetchSpy.mockRestore();
	});

	it('posts the trimmed prompt with the emoji theme and returns imageData + mediaFileId', async () => {
		fetchSpy.mockResolvedValue(
			okResponse({
				ai_feature_output: { mediaFileId: 'file-123', imageData: 'BASE64DATA' },
			}),
		);

		const result = await generateEmojiImage({
			contentId: 'content-1',
			prompt: '  a cat wearing a hard hat  ',
		});

		expect(result).toEqual({ imageData: 'BASE64DATA', mediaFileId: 'file-123' });
		expect(fetchSpy).toHaveBeenCalledTimes(1);

		const [url, init] = fetchSpy.mock.calls[0] as [string, RequestInit];
		expect(url).toContain('/ai-feature/confluence-header-image-generation');
		expect(init.method).toBe('POST');
		// required convo-ai headers
		const headers = init.headers as Record<string, string>;
		expect(headers['X-Experience-Id']).toBe('confluence-ai-first-creation');
		expect(headers['X-Product']).toBe('confluence');

		const body = JSON.parse(init.body as string);
		expect(body.ai_feature_input.contentId).toBe('content-1');
		expect(body.ai_feature_input.useRawPrompt).toBe(false);
		expect(body.ai_feature_input.theme).toBe('emoji');
		expect(body.ai_feature_input.aspectRatio).toBe('1:1');
		expect(body.ai_feature_input.adfContent).toBe('a cat wearing a hard hat');
	});

	it('throws when the response is not ok', async () => {
		fetchSpy.mockResolvedValue({ ok: false, status: 500, json: async () => ({}) } as Response);

		await expect(generateEmojiImage({ contentId: 'c', prompt: 'rocket' })).rejects.toThrow('500');
	});

	it('throws on a body-level error returned with 200 OK', async () => {
		fetchSpy.mockResolvedValue(
			okResponse({
				ai_feature_output: { error: { error_message: 'blocked by moderation' } },
			}),
		);

		await expect(generateEmojiImage({ contentId: 'c', prompt: 'rocket' })).rejects.toThrow(
			'blocked by moderation',
		);
	});

	it('throws when no image data is returned', async () => {
		fetchSpy.mockResolvedValue(okResponse({ ai_feature_output: { mediaFileId: 'x' } }));

		await expect(generateEmojiImage({ contentId: 'c', prompt: 'rocket' })).rejects.toThrow(
			'did not return image data',
		);
	});

	it('throws when there is no ai_feature_output envelope', async () => {
		fetchSpy.mockResolvedValue(okResponse({}));

		await expect(generateEmojiImage({ contentId: 'c', prompt: 'rocket' })).rejects.toThrow(
			'no content',
		);
	});
});
