import { snapshot } from '@af/visual-regression';
import { StandardEmojiTypeAhead } from './typeahead.fixture';

snapshot(StandardEmojiTypeAhead, {
	drawsOutsideBounds: true,
});
