import { listNodeAdf } from '../__fixtures__/full-width-adf';
import { listWithCodeblock } from '../__fixtures__/lists-with-codeblocks';
import { createListAdf } from '../__fixtures__/lists-starting-from-adf';
import listsOlUlAdf from '../__fixtures__/lists-ordered-unordered-adf.json';

import { generateRendererComponent } from '../__helpers/rendererComponents.vr.ap';
import type { ComponentType } from 'react';

export const ListRenderer: ComponentType<any> = generateRendererComponent({
	document: listNodeAdf,
	appearance: 'full-width',
});

export const ListWithCodeblock: ComponentType<any> = generateRendererComponent({
	document: listWithCodeblock,
	appearance: 'full-page',
});

export const CustomStartListOrder1: ComponentType<any> = generateRendererComponent({
	document: createListAdf({ order: 1 }),
	appearance: 'full-page',
});

export const CustomStartListOrder99: ComponentType<any> = generateRendererComponent({
	document: createListAdf({ order: 99 }),
	appearance: 'full-page',
});

export const CustomStartListOrder0: ComponentType<any> = generateRendererComponent({
	document: createListAdf({ order: 0 }),
	appearance: 'full-page',
});

export const CustomStartListOrder3_9: ComponentType<any> = generateRendererComponent({
	document: createListAdf({ order: 3.9 }),
	appearance: 'full-page',
});

export const CustomStartListOrder999: ComponentType<any> = generateRendererComponent({
	document: createListAdf({ order: 999 }),
	appearance: 'full-page',
});

export const CustomStartListOrder9999: ComponentType<any> = generateRendererComponent({
	document: createListAdf({ order: 9999 }),
	appearance: 'full-page',
});

export const CustomStartListOrderMinus3: ComponentType<any> = generateRendererComponent({
	document: createListAdf({ order: -3 }),
	appearance: 'full-page',
});

export const CustomStartListOrderMinus1_9: ComponentType<any> = generateRendererComponent({
	document: createListAdf({ order: -1.9 }),
	appearance: 'full-page',
});

export const RenderUlOlwithSamePadding: ComponentType<any> = generateRendererComponent({
	document: listsOlUlAdf,
	appearance: 'full-page',
});
