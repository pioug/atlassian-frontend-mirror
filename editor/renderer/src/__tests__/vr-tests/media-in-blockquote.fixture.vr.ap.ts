import type { ComponentType } from 'react';
import {
	mediaSingleInBlockquoteADF,
	mediaGroupInBlockquoteADF,
} from '../__fixtures__/media-inside-blockquote.adf';

import { generateRendererComponent } from '../__helpers/rendererComponents.vr.ap';

export const MediaSingleInBlockquote: ComponentType<any> = generateRendererComponent({
	document: mediaSingleInBlockquoteADF(),
	appearance: 'full-width',
});

export const MediaGroupInBlockquote: ComponentType<any> = generateRendererComponent({
	document: mediaGroupInBlockquoteADF(),
	appearance: 'full-width',
});
