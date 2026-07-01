/**
 * Calls the Confluence "header image" AI backend to generate an emoji-style
 * image (base64) from a text description.
 */

import { wrapEmojiPrompt } from '../../util/ai-emoji';
import debug from '../../util/logger';

const HEADER_IMAGE_GENERATION_ENDPOINT =
	'/gateway/api/assist/api/ai/v2/ai-feature/confluence-header-image-generation';

/** Emojis are square, so we always request a 1:1 image from the BE. */
const EMOJI_ASPECT_RATIO = '1:1';

export interface GenerateEmojiImageResult {
	/** Base64-encoded image data, used for preview and emoji upload. */
	imageData: string;
	/** Media Service file id (informational; not used for registration). */
	mediaFileId?: string;
}

/** Shape of the `ai_feature_output` envelope returned by the BE. */
interface HeaderImageGenerationOutput {
	imageData?: string;
	mediaFileId?: string;
	error?: {
		error_message?: string;
		error_reason?: string;
	};
}

interface HeaderImageGenerationEnvelope {
	ai_feature_output?: HeaderImageGenerationOutput;
}

export interface GenerateEmojiImageOptions {
	/**
	 * The current Confluence page content id. Required by the header image BE so
	 * generation is scoped/attributed to a piece of content.
	 */
	contentId: string;
	/**
	 * The raw text description typed by the user (e.g. "a cat wearing a hard hat").
	 * It is wrapped with the emoji-style prefix before being sent to the backend.
	 */
	prompt: string;
}

/**
 * Generate an emoji-style image and return its base64 image data.
 *
 * @throws Error if the request fails, the BE returns a body-level error, or no
 * image data is returned.
 */
export const generateEmojiImage = async ({
	contentId,
	prompt,
}: GenerateEmojiImageOptions): Promise<GenerateEmojiImageResult> => {
	const wrappedPrompt = wrapEmojiPrompt(prompt);

	const response = await fetch(HEADER_IMAGE_GENERATION_ENDPOINT, {
		method: 'POST',
		headers: {
			'content-type': 'application/json;charset=UTF-8',
			'X-Experience-Id': 'confluence-ai-first-creation',
			'X-Product': 'confluence',
		},
		body: JSON.stringify({
			ai_feature_input: {
				adfContent: wrappedPrompt,
				contentId,
				useRawPrompt: true,
				// Emojis are square — request a 1:1 image from the BE.
				aspectRatio: EMOJI_ASPECT_RATIO,
			},
		}),
	});

	if (!response.ok) {
		debug('generateEmojiImage failed', response.status);
		throw new Error(`Emoji image generation failed with status ${response.status}`);
	}

	const json = (await response.json()) as HeaderImageGenerationEnvelope;
	const output = json?.ai_feature_output;

	if (!output) {
		throw new Error('Emoji image generation returned no content');
	}

	// The BE can return 200 OK with an error in the body (e.g. moderation).
	if (output.error) {
		throw new Error(
			output.error.error_message || output.error.error_reason || 'Emoji image generation failed',
		);
	}

	if (!output.imageData) {
		throw new Error('Emoji image generation did not return image data');
	}

	return { imageData: output.imageData, mediaFileId: output.mediaFileId };
};
