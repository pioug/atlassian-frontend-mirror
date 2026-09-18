import type { Inline } from '@atlaskit/adf-schema/inline-content';
import type { ParagraphDefinition } from '@atlaskit/adf-schema/paragraph';

import { createTextNodes } from '../utils/create-text-nodes';

export const paragraph = (...content: Array<Inline | string>): ParagraphDefinition => ({
	type: 'paragraph',
	content: createTextNodes(content),
});
