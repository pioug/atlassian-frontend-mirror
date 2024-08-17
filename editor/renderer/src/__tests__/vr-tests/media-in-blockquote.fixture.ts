import {
	mediaSingleInBlockquoteADF,
	mediaGroupInBlockquoteADF,
} from '../__fixtures__/media-inside-blockquote.adf';

import { generateRendererComponent } from '../__helpers/rendererComponents';

export const MediaSingleInBlockquote = generateRendererComponent({
	document: mediaSingleInBlockquoteADF(),
	appearance: 'full-width',
});

export const MediaGroupInBlockquote = generateRendererComponent({
	document: mediaGroupInBlockquoteADF(),
	appearance: 'full-width',
});
