import { snapshot } from '@af/visual-regression';

import { StandardEmojiTypeAhead } from './typeahead.fixture.vr.ap';

snapshot(StandardEmojiTypeAhead, {
	drawsOutsideBounds: true,
});
