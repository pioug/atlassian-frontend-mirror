import { componentWithFG } from '@atlaskit/platform-feature-flags-react';

import { default as EmotionEmojiPicker } from './components/picker/EmojiPicker';
import { default as CompiledEmojiPicker } from './components/compiled/picker/EmojiPicker';
const EmojiPicker = componentWithFG(
	'platform_editor_css_migrate_emoji',
	CompiledEmojiPicker,
	EmotionEmojiPicker,
);
export { EmojiPicker };
