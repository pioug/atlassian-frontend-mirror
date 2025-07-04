import { type Fragment } from '@atlaskit/editor-prosemirror/model';

import type { MetricsState } from '../main';

function countNodesByType(fragment: Fragment) {
	const counts: Record<string, number> = {};
	fragment.forEach((node) => {
		counts[node.type.name] = (counts[node.type.name] || 0) + 1;
	});
	return counts;
}

export const getNodeChanges = ({
	currentContent,
	pluginState,
}: {
	currentContent: Fragment;
	pluginState?: MetricsState;
}): Record<string, number> => {
	if (pluginState?.initialContent) {
		const initialCounts = countNodesByType(pluginState.initialContent);
		const currentCounts = countNodesByType(currentContent);
		const netChanges = Object.keys({ ...initialCounts, ...currentCounts })
			.filter((value) => !['paragraph', 'heading'].includes(value))
			.reduce(
				(changes, nodeType) => {
					const change = (currentCounts[nodeType] || 0) - (initialCounts[nodeType] || 0);
					if (change !== 0) {
						changes[nodeType] = change;
					}
					return changes;
				},
				{} as Record<string, number>,
			);

		return netChanges;
	}
	return {};
};
