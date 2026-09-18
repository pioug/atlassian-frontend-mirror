import type { ComponentType } from 'react';

import { generateRendererComponent } from '../__helpers/rendererComponents.vr.ap';
import { adfTableWithParagraph, adfTableWithUnequalTableRows } from './__fixtures__';

export const BrokenTable: ComponentType<any> = generateRendererComponent({
	document: adfTableWithUnequalTableRows,
	appearance: 'full-page',
	UNSTABLE_allowTableAlignment: true,
	UNSTABLE_allowTableResizing: true,
});

export const TableWithParagraph: ComponentType<any> = generateRendererComponent({
	document: adfTableWithParagraph,
	appearance: 'full-page',
	allowColumnSorting: true,
});
