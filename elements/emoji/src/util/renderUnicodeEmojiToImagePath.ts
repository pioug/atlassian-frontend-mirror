import { isSSR } from './is-ssr';

const unicodeEmojiCanvasSize = 128;
const unicodeEmojiCanvasFontSize = 124;
const unicodeEmojiCanvasTopPadding = 8;

type OffscreenCanvasConstructor = new (
	width: number,
	height: number,
) => {
	convertToBlob: (options?: ImageEncodeOptions) => Promise<Blob>;
	getContext: (contextId: '2d') => OffscreenCanvasRenderingContext2D | null;
};

export const renderUnicodeEmojiToImagePath = async (
	unicodeEmoji: string,
): Promise<string | undefined> => {
	const OffscreenCanvasCtor = (
		globalThis as typeof globalThis & { OffscreenCanvas?: OffscreenCanvasConstructor }
	)['OffscreenCanvas'];

	if (isSSR() || !OffscreenCanvasCtor || typeof URL === 'undefined') {
		return undefined;
	}

	const canvas = new OffscreenCanvasCtor(unicodeEmojiCanvasSize, unicodeEmojiCanvasSize);
	const context = canvas.getContext('2d');
	if (!context) {
		return undefined;
	}

	context.clearRect(0, 0, unicodeEmojiCanvasSize, unicodeEmojiCanvasSize);
	context.textAlign = 'center';
	context.textBaseline = 'middle';
	context.font = `${unicodeEmojiCanvasFontSize}px sans-serif`;
	context.fillText(
		unicodeEmoji,
		unicodeEmojiCanvasSize / 2,
		unicodeEmojiCanvasSize / 2 + unicodeEmojiCanvasTopPadding,
	);

	const blob = await canvas.convertToBlob({ type: 'image/png' });
	return URL.createObjectURL(blob);
};
