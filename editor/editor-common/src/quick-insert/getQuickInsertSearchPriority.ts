import { getQuickInsertProviderMenuItemKey } from './getQuickInsertProviderMenuItemKey';
import {
	ACTION_MENU_ITEM,
	ASK_ROVO_MENU_ITEM,
	ASSETS_MENU_ITEM,
	BLOCKQUOTE_MENU_ITEM,
	BRAINSTORMING_MENU_ITEM,
	CODE_BLOCK_MENU_ITEM,
	CUSTOM_PANEL_MENU_ITEM,
	DATABASE_MENU_ITEM,
	DATE_MENU_ITEM,
	DECISION_MENU_ITEM,
	EMOJI_MENU_ITEM,
	ERROR_PANEL_MENU_ITEM,
	EXPAND_MENU_ITEM,
	FIVE_COLUMNS_LAYOUT_MENU_ITEM,
	FLOWCHART_MENU_ITEM,
	FOUR_COLUMNS_LAYOUT_MENU_ITEM,
	HEADING_1_MENU_ITEM,
	HEADING_2_MENU_ITEM,
	HEADING_3_MENU_ITEM,
	HEADING_4_MENU_ITEM,
	HEADING_5_MENU_ITEM,
	HEADING_6_MENU_ITEM,
	HYPERLINK_MENU_ITEM,
	INFO_PANEL_MENU_ITEM,
	JIRA_ISSUE_MENU_ITEM,
	JIRA_WORK_ITEMS_MENU_ITEM,
	LOOM_MENU_ITEM,
	MEDIA_INSERT_MENU_ITEM,
	NOTE_PANEL_MENU_ITEM,
	ORDERED_LIST_MENU_ITEM,
	ROADMAP_MENU_ITEM,
	RETROSPECTIVE_MENU_ITEM,
	RULE_MENU_ITEM,
	STATUS_MENU_ITEM,
	SUCCESS_PANEL_MENU_ITEM,
	SYNCED_BLOCK_MENU_ITEM,
	TABLE_MENU_ITEM,
	TABS_MENU_ITEM,
	THREE_COLUMNS_LAYOUT_MENU_ITEM,
	TWO_COLUMNS_LAYOUT_MENU_ITEM,
	WARNING_PANEL_MENU_ITEM,
	WHITEBOARD_MENU_ITEM,
} from './keys';

const SKILL_MENU_ITEM_KEY_PREFIX = getQuickInsertProviderMenuItemKey('skill:');

const RECOMMENDED_ITEM_KEYS_BY_QUERY: [string, readonly string[]][] = [
	['a', [ASK_ROVO_MENU_ITEM.key, ACTION_MENU_ITEM.key, ASSETS_MENU_ITEM.key]],
	[
		'b',
		[
			getQuickInsertProviderMenuItemKey('blog-posts:blog-posts'),
			getQuickInsertProviderMenuItemKey('snippet-extension:block-template'),
			getQuickInsertProviderMenuItemKey(BRAINSTORMING_MENU_ITEM.key),
		],
	],
	[
		'c',
		[
			CODE_BLOCK_MENU_ITEM.key,
			getQuickInsertProviderMenuItemKey('cards:quick-insert'),
			getQuickInsertProviderMenuItemKey(JIRA_ISSUE_MENU_ITEM.key),
		],
	],
	['d', [DATE_MENU_ITEM.key, DECISION_MENU_ITEM.key, RULE_MENU_ITEM.key]],
	[
		'e',
		[
			EMOJI_MENU_ITEM.key,
			EXPAND_MENU_ITEM.key,
			getQuickInsertProviderMenuItemKey('third-party-quick-insert-embeds:embed'),
		],
	],
	[
		'f',
		[
			INFO_PANEL_MENU_ITEM.key,
			getQuickInsertProviderMenuItemKey(FLOWCHART_MENU_ITEM.key),
			getQuickInsertProviderMenuItemKey('third-party-quick-insert-embeds:third-party-embed-figma'),
		],
	],
	[
		'g',
		[
			WARNING_PANEL_MENU_ITEM.key,
			getQuickInsertProviderMenuItemKey(
				'third-party-quick-insert-embeds:third-party-embed-google-drive',
			),
		],
	],
	['h', [HEADING_2_MENU_ITEM.key, HEADING_3_MENU_ITEM.key, HEADING_4_MENU_ITEM.key]],
	[
		'i',
		[
			MEDIA_INSERT_MENU_ITEM.key,
			INFO_PANEL_MENU_ITEM.key,
			getQuickInsertProviderMenuItemKey('iframe:iframe'),
		],
	],
	[
		'j',
		[
			JIRA_WORK_ITEMS_MENU_ITEM.key,
			getQuickInsertProviderMenuItemKey('jirachart:jirachart'),
			getQuickInsertProviderMenuItemKey(JIRA_ISSUE_MENU_ITEM.key),
		],
	],
	['l', [LOOM_MENU_ITEM.key, HYPERLINK_MENU_ITEM.key, TWO_COLUMNS_LAYOUT_MENU_ITEM.key]],
	['n', [ORDERED_LIST_MENU_ITEM.key, NOTE_PANEL_MENU_ITEM.key, SYNCED_BLOCK_MENU_ITEM.key]],
	[
		'p',
		[
			INFO_PANEL_MENU_ITEM.key,
			SUCCESS_PANEL_MENU_ITEM.key,
			WARNING_PANEL_MENU_ITEM.key,
			NOTE_PANEL_MENU_ITEM.key,
			CUSTOM_PANEL_MENU_ITEM.key,
		],
	],
	[
		'q',
		[
			BLOCKQUOTE_MENU_ITEM.key,
			getQuickInsertProviderMenuItemKey('questionslist-macro-native:questionslist-macro-native'),
		],
	],
	[
		'r',
		[
			getQuickInsertProviderMenuItemKey(RETROSPECTIVE_MENU_ITEM.key),
			getQuickInsertProviderMenuItemKey(ROADMAP_MENU_ITEM.key),
			getQuickInsertProviderMenuItemKey('skill:response-draft'),
		],
	],
	[
		's',
		[
			STATUS_MENU_ITEM.key,
			SUCCESS_PANEL_MENU_ITEM.key,
			getQuickInsertProviderMenuItemKey('spotlight:quick-insert'),
		],
	],
	[
		't',
		[
			TABLE_MENU_ITEM.key,
			getQuickInsertProviderMenuItemKey(TABS_MENU_ITEM.key),
			getQuickInsertProviderMenuItemKey('toc:toc'),
		],
	],
	[
		'w',
		[
			getQuickInsertProviderMenuItemKey(WHITEBOARD_MENU_ITEM.key),
			WARNING_PANEL_MENU_ITEM.key,
			getQuickInsertProviderMenuItemKey('skill:write-prd'),
		],
	],
	[
		'x',
		[
			EXPAND_MENU_ITEM.key,
			getQuickInsertProviderMenuItemKey('excerpt:excerpt'),
			getQuickInsertProviderMenuItemKey('skill:explain-workflow'),
		],
	],
	[
		'y',
		[
			SYNCED_BLOCK_MENU_ITEM.key,
			TWO_COLUMNS_LAYOUT_MENU_ITEM.key,
			THREE_COLUMNS_LAYOUT_MENU_ITEM.key,
		],
	],
	[
		'co',
		[
			CODE_BLOCK_MENU_ITEM.key,
			TWO_COLUMNS_LAYOUT_MENU_ITEM.key,
			THREE_COLUMNS_LAYOUT_MENU_ITEM.key,
			FOUR_COLUMNS_LAYOUT_MENU_ITEM.key,
			FIVE_COLUMNS_LAYOUT_MENU_ITEM.key,
		],
	],
	[
		'pa',
		[
			INFO_PANEL_MENU_ITEM.key,
			NOTE_PANEL_MENU_ITEM.key,
			ERROR_PANEL_MENU_ITEM.key,
			SUCCESS_PANEL_MENU_ITEM.key,
			CUSTOM_PANEL_MENU_ITEM.key,
			EXPAND_MENU_ITEM.key,
		],
	],
	[
		'pan',
		[
			INFO_PANEL_MENU_ITEM.key,
			NOTE_PANEL_MENU_ITEM.key,
			ERROR_PANEL_MENU_ITEM.key,
			SUCCESS_PANEL_MENU_ITEM.key,
			CUSTOM_PANEL_MENU_ITEM.key,
			EXPAND_MENU_ITEM.key,
		],
	],
	[
		'ex',
		[
			EXPAND_MENU_ITEM.key,
			getQuickInsertProviderMenuItemKey('excerpt:excerpt'),
			getQuickInsertProviderMenuItemKey('skill:explain-workflow'),
		],
	],
	[
		'la',
		[
			TWO_COLUMNS_LAYOUT_MENU_ITEM.key,
			THREE_COLUMNS_LAYOUT_MENU_ITEM.key,
			FOUR_COLUMNS_LAYOUT_MENU_ITEM.key,
			FIVE_COLUMNS_LAYOUT_MENU_ITEM.key,
		],
	],
	[
		'he',
		[
			HEADING_4_MENU_ITEM.key,
			HEADING_6_MENU_ITEM.key,
			HEADING_1_MENU_ITEM.key,
			HEADING_2_MENU_ITEM.key,
			HEADING_3_MENU_ITEM.key,
			HEADING_5_MENU_ITEM.key,
		],
	],
	[
		'ac',
		[
			ACTION_MENU_ITEM.key,
			getQuickInsertProviderMenuItemKey(
				'com.atlassian.streams.streams-jira-plugin:activitystream-gadget',
			),
		],
	],
	[
		'act',
		[
			ACTION_MENU_ITEM.key,
			getQuickInsertProviderMenuItemKey(
				'com.atlassian.streams.streams-jira-plugin:activitystream-gadget',
			),
		],
	],
	['che', [ACTION_MENU_ITEM.key]],
	[
		'em',
		[
			EMOJI_MENU_ITEM.key,
			getQuickInsertProviderMenuItemKey('third-party-quick-insert-embeds:embed'),
			getQuickInsertProviderMenuItemKey('database-extension:reference-database'),
		],
	],
	[
		'fi',
		[
			MEDIA_INSERT_MENU_ITEM.key,
			getQuickInsertProviderMenuItemKey('third-party-quick-insert-embeds:third-party-embed-figma'),
			getQuickInsertProviderMenuItemKey('skill:find-similar-incidents'),
		],
	],
	[
		'fil',
		[
			MEDIA_INSERT_MENU_ITEM.key,
			getQuickInsertProviderMenuItemKey('com.atlassian.jira.gadgets:filter-results-gadget'),
		],
	],
	['at', [MEDIA_INSERT_MENU_ITEM.key]],
	[
		'ji',
		[JIRA_WORK_ITEMS_MENU_ITEM.key, getQuickInsertProviderMenuItemKey(JIRA_ISSUE_MENU_ITEM.key)],
	],
	['jira', [JIRA_WORK_ITEMS_MENU_ITEM.key]],
	[
		'db',
		[
			getQuickInsertProviderMenuItemKey(DATABASE_MENU_ITEM.key),
			getQuickInsertProviderMenuItemKey('skill:search-feedback'),
		],
	],
	['wb', [getQuickInsertProviderMenuItemKey(WHITEBOARD_MENU_ITEM.key)]],
	[
		'te',
		[
			getQuickInsertProviderMenuItemKey('snippet-extension:block-template'),
			getQuickInsertProviderMenuItemKey('create-from-template:create-from-template'),
		],
	],
	[
		'tem',
		[
			getQuickInsertProviderMenuItemKey('snippet-extension:block-template'),
			getQuickInsertProviderMenuItemKey('create-from-template:create-from-template'),
		],
	],
];

type SearchRecommendation = { priorityGroup: number; score: number };
type RecommendationResolver = (itemKey: string) => SearchRecommendation | undefined;

const createRecommendationResolver =
	(itemKeys: readonly string[]): RecommendationResolver =>
	(itemKey) => {
		const index = itemKeys.indexOf(itemKey);
		return index === -1 ? undefined : { priorityGroup: 0, score: index / itemKeys.length };
	};

// The "sk" query should place every skill ahead of ordinary search results, after Ask Rovo.
const resolveSkillRecommendation: RecommendationResolver = (itemKey) => {
	if (itemKey === ASK_ROVO_MENU_ITEM.key) {
		return { priorityGroup: 0, score: 0 };
	}
	return itemKey.startsWith(SKILL_MENU_ITEM_KEY_PREFIX)
		? { priorityGroup: 0, score: 1 }
		: undefined;
};

const RECOMMENDATIONS_BY_QUERY = new Map<string, RecommendationResolver>([
	...RECOMMENDED_ITEM_KEYS_BY_QUERY.map(([query, itemKeys]): [string, RecommendationResolver] => [
		query,
		createRecommendationResolver(itemKeys),
	]),
	['sk', resolveSkillRecommendation],
]);

export const getQuickInsertSearchPriority = ({
	itemKey,
	query,
}: {
	itemKey: string;
	query: string;
}): { priorityGroup: number; score: number } | undefined => {
	const normalizedQuery = query.trim().toLowerCase();
	return RECOMMENDATIONS_BY_QUERY.get(normalizedQuery)?.(itemKey);
};
