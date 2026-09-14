import type { OnUploadEmoji } from '../src/components/common/EmojiUploadPicker';
import type { EmojiUpload } from '../src/types';
import debug from '../src/util/logger';

export const onUploadEmoji: OnUploadEmoji = (upload: EmojiUpload) =>
	debug('uploaded emoji', upload);
