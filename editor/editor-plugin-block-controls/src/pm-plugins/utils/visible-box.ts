// Matches the anchor selectors in `ui/global-styles.tsx`. A table's `.pm-table-resizer-container`
// wraps its cells too, so only a direct child `.resizer-item` is the table's own box, not the
// resizer of media inside a cell.
const VISIBLE_BOX_SELECTORS: Partial<Record<string, string>> = {
	table: '.pm-table-resizer-container > .resizer-item',
	mediaSingle: '.resizer-item',
	embedCard: '.rich-media-item',
	extension: '.extension-container[data-layout]',
	bodiedExtension: '.extension-container[data-layout]',
	multiBodiedExtension: '.extension-container[data-layout]',
	blockCard: '.datasourceView-content-inner-wrap',
};

/**
 * The box a block's controls anchor to under sparse surfaces. For some blocks this is an inner
 * element, which can be wider than the block itself.
 */
export const getVisibleBox = (dom: Element, nodeType: string): Element => {
	const selector = VISIBLE_BOX_SELECTORS[nodeType];
	return (selector && dom.querySelector(selector)) || dom;
};
