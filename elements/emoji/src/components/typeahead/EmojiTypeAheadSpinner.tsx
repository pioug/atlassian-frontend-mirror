import { componentWithFG } from '@atlaskit/platform-feature-flags-react';
import { EmojiTypeAheadSpinnerEmotion } from './EmojiTypeAheadSpinnerEmotion';
import { EmojiTypeAheadSpinnerCompiled } from './EmojiTypeAheadSpinnerCompiled';

export const EmojiTypeAheadSpinner = componentWithFG(
	'platform_editor_css_migrate_emoji',
	EmojiTypeAheadSpinnerCompiled,
	EmojiTypeAheadSpinnerEmotion,
);
