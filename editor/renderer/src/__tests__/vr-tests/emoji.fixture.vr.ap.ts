import type { ComponentType } from 'react';
import { emojiADF } from '../__fixtures__/emoji.adf';

import { generateRendererComponent } from '../__helpers/rendererComponents.vr.ap';

export const EmojiRenderer: ComponentType<any> = generateRendererComponent({
	document: emojiADF,
	appearance: 'full-width',
});
