import { componentWithFG } from '@atlaskit/platform-feature-flags-react';

import EmojiUploadComponentEmotion from './EmojiUploadComponentEmotion';
import EmojiUploadComponentCompiled from './EmojiUploadComponentCompiled';

const EmojiUploadComponent = componentWithFG(
	'platform_editor_css_migrate_emoji',
	EmojiUploadComponentCompiled,
	EmojiUploadComponentEmotion,
);

export default EmojiUploadComponent;
