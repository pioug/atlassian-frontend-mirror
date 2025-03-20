import { snapshot } from '@af/visual-regression';

import {
	EmojiDeletePreviewCompiled,
	EmojiDeletePreviewEmotion,
	EmojiUploadPreviewCompiled,
	EmojiUploadPreviewEmotion,
	EmojiUploadPickerCompiled,
	EmojiUploadPickerEmotion,
	EmojiUploadPickerWithNameCompiled,
	EmojiUploadPickerWithNameEmotion,
} from './common.fixture';

snapshot(EmojiDeletePreviewCompiled);
snapshot(EmojiDeletePreviewEmotion);

snapshot(EmojiUploadPreviewCompiled);
snapshot(EmojiUploadPreviewEmotion);

snapshot(EmojiUploadPickerCompiled);
snapshot(EmojiUploadPickerEmotion);

snapshot(EmojiUploadPickerWithNameCompiled);
snapshot(EmojiUploadPickerWithNameEmotion);
