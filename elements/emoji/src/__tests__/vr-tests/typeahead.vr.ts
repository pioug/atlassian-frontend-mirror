import { snapshot } from '@af/visual-regression';
import { StandardEmojiTypeAhead } from './typeahead.fixture';

snapshot(StandardEmojiTypeAhead, {
	drawsOutsideBounds: true,
	featureFlags: {
		platform_editor_css_migrate_emoji: [true, false],
	},
});
