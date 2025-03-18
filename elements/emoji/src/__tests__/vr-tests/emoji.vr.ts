import { snapshot } from '@af/visual-regression';

import { EmojiSimple } from './emoji.fixture';

const featureFlags = {
	platform_editor_css_migrate_emoji: [true, false],
};

snapshot(EmojiSimple, { featureFlags });
