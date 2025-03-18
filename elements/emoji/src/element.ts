import { componentWithFG } from '@atlaskit/platform-feature-flags-react';

import { default as CompiledEmojiPlaceholder } from './components/compiled/common/EmojiPlaceholder';
import { default as EmotionEmojiPlaceholder } from './components/common/EmojiPlaceholder';
const EmojiPlaceholder = componentWithFG(
	'platform_editor_css_migrate_emoji',
	CompiledEmojiPlaceholder,
	EmotionEmojiPlaceholder,
);
export { EmojiPlaceholder };

import { default as CompiledEmoji } from './components/compiled/common/Emoji';
import { default as EmotionEmoji } from './components/common/Emoji';
const Emoji = componentWithFG('platform_editor_css_migrate_emoji', CompiledEmoji, EmotionEmoji);
export { Emoji };

export { default as ResourcedEmoji } from './components/common/ResourcedEmoji';
