import { snapshot } from '@af/visual-regression';

import {
	EmojiDeletePreview,
	EmojiUploadPreview,
	EmojiUploadPickerWithoutName,
	EmojiUploadPickerWithName,
} from './common.fixture';

snapshot(EmojiDeletePreview);
snapshot(EmojiUploadPreview);
snapshot(EmojiUploadPickerWithoutName);
snapshot(EmojiUploadPickerWithName);
