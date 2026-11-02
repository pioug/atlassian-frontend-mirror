import { snapshot } from '@af/visual-regression';

import {
	EmojiDeletePreview,
	EmojiUploadPickerWithoutName,
	EmojiUploadPickerWithName,
} from './common.fixture.vr.ap';

snapshot(EmojiDeletePreview);
snapshot(EmojiUploadPickerWithoutName);
snapshot(EmojiUploadPickerWithName);
