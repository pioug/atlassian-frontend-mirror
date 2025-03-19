import { componentWithFG } from '@atlaskit/platform-feature-flags-react';

import { EmojiTypeAheadListContainerEmotion } from './EmojiTypeAheadListContainerEmotion';
import { EmojiTypeAheadListContainerCompiled } from './EmojiTypeAheadListContainerCompiled';

export const EmojiTypeAheadListContainer = componentWithFG(
	'platform_editor_css_migrate_emoji',
	EmojiTypeAheadListContainerCompiled,
	EmojiTypeAheadListContainerEmotion,
);
