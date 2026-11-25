import { getQuickInsertProviderMenuItemKey } from '@atlaskit/editor-common/quick-insert/get-provider-menu-item-key';
import { INFO_PANEL_MENU_ITEM } from '@atlaskit/editor-common/quick-insert/keys';
import { UNSAFE_expValNoExposure } from '@atlaskit/platform-feature-experiments/unsafe-exp-val-no-exposure';

const infographicKeys = new Set([
	'remix-slash:infographic',
	getQuickInsertProviderMenuItemKey('remix-slash:infographic'),
]);

export const moveRemixInfographicAfterInfoPanel = <T>(
	items: T[],
	query: string,
	getKey: (item: T) => string | number | undefined,
): T[] => {
	const normalizedQuery = query.trim().toLowerCase();
	if (normalizedQuery !== 'inf' && normalizedQuery !== 'info') {
		return items;
	}

	const infoPanelIndex = items.findIndex((item) => getKey(item) === INFO_PANEL_MENU_ITEM.key);
	const infographicIndex = items.findIndex((item) => {
		const key = getKey(item);
		return typeof key === 'string' && infographicKeys.has(key);
	});
	if (
		infoPanelIndex === -1 ||
		infographicIndex === -1 ||
		infographicIndex === infoPanelIndex + 1 ||
		!UNSAFE_expValNoExposure('cc_remix_slash_commands', 'isEnabled', false)
	) {
		return items;
	}

	const reordered = items.slice();
	const [infographic] = reordered.splice(infographicIndex, 1);
	const insertIndex = reordered.findIndex((item) => getKey(item) === INFO_PANEL_MENU_ITEM.key) + 1;
	reordered.splice(insertIndex, 0, infographic);
	return reordered;
};
