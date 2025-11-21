import { emojiADF } from '../__fixtures__/emoji.adf';

import { generateRendererComponent } from '../__helpers/rendererComponents';

export const EmojiRenderer = generateRendererComponent({
	document: emojiADF,
	appearance: 'full-width',
});
