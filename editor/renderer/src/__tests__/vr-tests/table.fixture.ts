import { tableAdf } from '../__fixtures__/full-width-adf';
import { overflowTableFullWidth, overflowTableWide } from '../__fixtures__/overflow.adf';
import tableWithWrappedNodesAdf from '../__fixtures__/table-with-wrapped-nodes.adf.json';
import tableComplexSelectionsAdf from '../__fixtures__/table-complex-selections.adf.json';
import { tableColorAdf } from '../__fixtures__/table-color';

import { generateRendererComponent } from '../__helpers/rendererComponents';

export {
	TableRendererOverflow,
	TableRendererWithInlineComments,
} from '../__helpers/rendererComponents';

export const TableRenderer = generateRendererComponent({
	document: tableAdf,
	appearance: 'full-width',
});

export const WideTableRendererFullWidth = generateRendererComponent({
	document: overflowTableWide,
	appearance: 'full-width',
});

export const FullWidthTableRendererFullWidth = generateRendererComponent({
	document: overflowTableFullWidth,
	appearance: 'full-width',
});

export const TableRendererWideOverflow = generateRendererComponent({
	document: overflowTableWide,
	appearance: 'full-page',
});

export const TableRendererFullWidthOverflow = generateRendererComponent({
	document: overflowTableFullWidth,
	appearance: 'full-page',
});

export const TableRendererWrappedNodes = generateRendererComponent({
	document: tableWithWrappedNodesAdf,
	appearance: 'full-page',
});

export const TableRendererComplexNodes = generateRendererComponent({
	document: tableComplexSelectionsAdf,
	appearance: 'full-page',
});

export const TableRendererBackgroundColor = generateRendererComponent({
	document: tableColorAdf,
	appearance: 'full-page',
});

export const TableRendererFullWidthComment = generateRendererComponent({
	document: overflowTableFullWidth,
	appearance: 'comment',
});

export const TableRendererWideComment = generateRendererComponent({
	document: overflowTableWide,
	appearance: 'comment',
});

export const TableRendererComment = generateRendererComponent({
	document: tableAdf,
	appearance: 'comment',
});

export const TableRendererWithoutAppearance = generateRendererComponent({
	document: tableAdf,
	appearance: undefined,
});

export const TableRendererFullWidthWithoutAppearance = generateRendererComponent({
	document: overflowTableFullWidth,
	appearance: undefined,
});

export const TableRendererWideWithoutAppearance = generateRendererComponent({
	document: overflowTableWide,
	appearance: undefined,
});
