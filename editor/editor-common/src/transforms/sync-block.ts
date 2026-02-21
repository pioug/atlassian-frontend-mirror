import { BreakoutCssClassName } from '../styles';
import { SyncBlockRendererDataAttributeName } from '../sync-block';

/**
 * Remove breakout mark from renderer sync block.
 *
 * When copying from renderer, we want to paste the content and not the sync block.
 *
 * If the renderer sync block is interpreted as a sync block node by Prosemirror's parser,
 * then since syncBlock is a leaf node, it will stop looking for any nested content and so the content inside the sync block,
 * and so what we actually want will be gone from the pasted slice
 *
 * So we make sure the sync block is not interpreted as a sync block node, by using data-sync-block-renderer instead of data-sync-block
 * However, sync blocks can have breakout marks. When Prosemirror skips over the sync block node, it will then apply that breakout mark to the next node (incorrectly)
 *
 * So we need to strip out all of the breakout marks around renderer sync blocks beforehand while parsing the HTML.
 */
export const removeBreakoutFromRendererSyncBlockHTML = (html: string): string => {
	const parser = new DOMParser();
	const doc = parser.parseFromString(html, 'text/html');

	doc.querySelectorAll(`div.${BreakoutCssClassName.BREAKOUT_MARK}`).forEach((breakoutDiv) => {
		// Check if this breakout div directly contains a renderer sync block
		const rendererDiv = breakoutDiv.querySelector(
			`:scope > div[${SyncBlockRendererDataAttributeName}]`,
		);

		if (rendererDiv) {
			breakoutDiv.replaceWith(rendererDiv);
		}
	});

	return doc.body.innerHTML;
};
