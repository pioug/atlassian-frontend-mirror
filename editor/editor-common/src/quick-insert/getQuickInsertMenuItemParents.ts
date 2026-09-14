import {
	BLOCK_TEMPLATES_SECTION,
	DATA_AND_CHARTS_SECTION,
	EMBED_SECTION,
	MEDIA_SECTION,
	OTHER_SECTION,
	ROVO_SECTION,
	STRUCTURE_SECTION,
	TEXT_FORMATTING_SECTION,
} from './keys';
import { getActiveQuickInsertCategories } from './getActiveQuickInsertCategories';

type MenuSection = {
	key: string;
	type: 'menu-section';
};

const categorySections: Record<string, MenuSection> = {
	admin: STRUCTURE_SECTION,
	ai: ROVO_SECTION,
	'block-templates': BLOCK_TEMPLATES_SECTION,
	communication: MEDIA_SECTION,
	'confluence-content': STRUCTURE_SECTION,
	'data-and-charts': DATA_AND_CHARTS_SECTION,
	development: DATA_AND_CHARTS_SECTION,
	embed: EMBED_SECTION,
	'external-content': EMBED_SECTION,
	formatting: STRUCTURE_SECTION,
	media: MEDIA_SECTION,
	navigation: STRUCTURE_SECTION,
	other: OTHER_SECTION,
	reporting: DATA_AND_CHARTS_SECTION,
	skills: ROVO_SECTION,
	structure: STRUCTURE_SECTION,
	'text-formatting': TEXT_FORMATTING_SECTION,
	visuals: MEDIA_SECTION,
};

export const getQuickInsertMenuItemParents = ({
	category,
	legacyCategories,
	rank,
}: {
	category?: string;
	legacyCategories?: string[];
	rank: number;
}): Array<MenuSection & { rank: number }> => {
	const sections = new Map<string, MenuSection>();

	for (const itemCategory of getActiveQuickInsertCategories(category, legacyCategories)) {
		const section = categorySections[itemCategory.trim().toLowerCase()];
		if (section) {
			sections.set(section.key, section);
		}
	}

	if (sections.size === 0) {
		sections.set(OTHER_SECTION.key, OTHER_SECTION);
	}

	return Array.from(sections.values(), (section) => ({ ...section, rank }));
};
