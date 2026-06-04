import type { IntlShape } from 'react-intl';

import type {
	TypeAheadHandler,
	TypeAheadItem,
	TypeAheadSection,
} from '@atlaskit/editor-common/types';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { TypeAheadResolvedSection } from '../../types';

export const buildSectionedResult = ({
	items,
	triggerHandler,
	intl,
}: {
	intl: IntlShape | null;
	items: Array<TypeAheadItem>;
	triggerHandler: TypeAheadHandler;
}): { items: Array<TypeAheadItem>; sections: Array<TypeAheadResolvedSection> } => {
	if (!editorExperiment('platform_editor_agent_mentions', true) || !intl) {
		return { items, sections: [] };
	}

	const sectionDefinitions = triggerHandler.getSections?.({ intl });

	if (!sectionDefinitions || sectionDefinitions.length === 0) {
		return { items, sections: [] };
	}

	// Track which item indexes have been claimed by a section, or excluded (matched a section but
	// cut by that section's limit). Items excluded by limit should not appear anywhere in the output.
	const assignedToSection = new Set<number>();
	const excludedByLimit = new Set<number>();

	const groupedBySection = new Map<string, { indexes: number[]; section: TypeAheadSection }>();

	for (const section of sectionDefinitions) {
		const matchingIndexes: number[] = [];
		for (let i = 0; i < items.length; i++) {
			if (assignedToSection.has(i) || excludedByLimit.has(i)) {
				continue;
			}
			if (section.filter(items[i])) {
				matchingIndexes.push(i);
			}
		}

		const acceptedIndexes =
			section.limit !== undefined ? matchingIndexes.slice(0, section.limit) : matchingIndexes;
		const rejectedByLimit = matchingIndexes.slice(acceptedIndexes.length);

		for (const i of acceptedIndexes) {
			assignedToSection.add(i);
		}
		for (const i of rejectedByLimit) {
			excludedByLimit.add(i);
		}

		if (acceptedIndexes.length === 0) {
			continue;
		}

		groupedBySection.set(section.id, { indexes: acceptedIndexes, section });
	}

	const flattenedItems: TypeAheadItem[] = [];
	const sections: TypeAheadResolvedSection[] = [];

	for (const section of sectionDefinitions) {
		const grouped = groupedBySection.get(section.id);
		if (!grouped) {
			continue;
		}

		const startIndex = flattenedItems.length;
		flattenedItems.push(...grouped.indexes.map((i) => items[i]));
		const endIndex = flattenedItems.length - 1;
		sections.push({
			endIndex,
			id: section.id,
			startIndex,
			title: section.title,
		});
	}

	// Append items not claimed by any section and not excluded by a limit
	for (let i = 0; i < items.length; i++) {
		if (!assignedToSection.has(i) && !excludedByLimit.has(i)) {
			flattenedItems.push(items[i]);
		}
	}

	return {
		items: flattenedItems,
		sections,
	};
};
