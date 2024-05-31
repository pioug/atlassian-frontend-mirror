import { listNodeAdf } from '../__fixtures__/full-width-adf';
import { listWithCodeblock } from '../__fixtures__/lists-with-codeblocks';
import { createListAdf } from '../__fixtures__/lists-starting-from-adf';
import listsOlUlAdf from '../__fixtures__/lists-ordered-unordered-adf.json';

import { generateRendererComponent } from '../__helpers/rendererComponents';

export const ListRenderer = generateRendererComponent({
	document: listNodeAdf,
	appearance: 'full-width',
});

export const ListWithCodeblock = generateRendererComponent({
	document: listWithCodeblock,
	appearance: 'full-page',
});

export const CustomStartListOrder1 = generateRendererComponent({
	document: createListAdf({ order: 1 }),
	appearance: 'full-page',
});

export const CustomStartListOrder99 = generateRendererComponent({
	document: createListAdf({ order: 99 }),
	appearance: 'full-page',
});

export const CustomStartListOrder0 = generateRendererComponent({
	document: createListAdf({ order: 0 }),
	appearance: 'full-page',
});

export const CustomStartListOrder3_9 = generateRendererComponent({
	document: createListAdf({ order: 3.9 }),
	appearance: 'full-page',
});

export const CustomStartListOrder999 = generateRendererComponent({
	document: createListAdf({ order: 999 }),
	appearance: 'full-page',
});

export const CustomStartListOrder9999 = generateRendererComponent({
	document: createListAdf({ order: 9999 }),
	appearance: 'full-page',
});

export const CustomStartListOrderMinus3 = generateRendererComponent({
	document: createListAdf({ order: -3 }),
	appearance: 'full-page',
});

export const CustomStartListOrderMinus1_9 = generateRendererComponent({
	document: createListAdf({ order: -1.9 }),
	appearance: 'full-page',
});

export const RenderUlOlwithSamePadding = generateRendererComponent({
	document: listsOlUlAdf,
	appearance: 'full-page',
});
