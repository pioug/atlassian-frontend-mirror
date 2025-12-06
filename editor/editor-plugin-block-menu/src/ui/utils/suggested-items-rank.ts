/**
 * Suggested transformations mapping for each block type.
 * Based on the Block Menu Compatibility Matrix:
 * https://hello.atlassian.net/wiki/spaces/egcuc/pages/5868774224/Block+Menu+Compatibility+Matrix#Suggested-for-each-block-type
 *
 * This mapping defines which transform items should appear in the TRANSFORM_SUGGESTED_MENU_SECTION
 * for each block type, ranked by priority (lower rank = higher priority).
 *
 * Structure:
 * {
 *   [sourceNodeType]: {
 *     [targetMenuItemKey]: rank
 *   }
 * }
 */

import {
	TRANSFORM_STRUCTURE_PANEL_MENU_ITEM,
	TRANSFORM_STRUCTURE_EXPAND_MENU_ITEM,
	TRANSFORM_STRUCTURE_LAYOUT_MENU_ITEM,
	TRANSFORM_STRUCTURE_QUOTE_MENU_ITEM,
	TRANSFORM_STRUCTURE_CODE_BLOCK_MENU_ITEM,
	TRANSFORM_STRUCTURE_BULLETED_LIST_MENU_ITEM,
	TRANSFORM_STRUCTURE_NUMBERED_LIST_MENU_ITEM,
	TRANSFORM_STRUCTURE_TASK_LIST_MENU_ITEM,
	TRANSFORM_HEADINGS_H2_MENU_ITEM,
	TRANSFORM_HEADINGS_H3_MENU_ITEM,
	TRANSFORM_STRUCTURE_PARAGRAPH_MENU_ITEM,
} from '@atlaskit/editor-common/block-menu';

import type { NodeTypeName } from '../../editor-commands/transform-node-utils/types';

/**
 * Node type keys that map to ProseMirror node types from the ADF schema.
 * These values must match the NodeTypeName type.
 *
 * TypeScript will enforce that all values are valid NodeTypeName values.
 * If a new node type is added, it must be added to NodeTypeName first.
 *
 * Reference: packages/editor/editor-plugin-block-menu/src/editor-commands/transform-node-utils/types.ts
 *
 * Note: 'heading' represents all heading levels (1-6) as a single node type.
 * The specific level is determined by the node's `attrs.level` property at runtime.
 *
 * @example
 * // Usage:
 * const nodeType = BLOCK_MENU_NODE_TYPES.PARAGRAPH; // Type: "paragraph"
 */
export const BLOCK_MENU_NODE_TYPES = {
	PARAGRAPH: 'paragraph',
	EXPAND: 'expand',
	BLOCKQUOTE: 'blockquote',
	LAYOUT_SECTION: 'layoutSection',
	PANEL: 'panel',
	CODE_BLOCK: 'codeBlock',
	DECISION: 'decisionList',
	BULLET_LIST: 'bulletList',
	ORDERED_LIST: 'orderedList',
	HEADING: 'heading',
	TASK_LIST: 'taskList',
	MEDIA_SINGLE: 'mediaSingle',
	EXTENSION: 'extension',
	BODIED_EXTENSION: 'bodiedExtension',
	BLOCK_CARD: 'blockCard',
	EMBED_CARD: 'embedCard',
	TABLE: 'table',
} as const satisfies Record<string, NodeTypeName>;

/**
 * Type for node type values extracted from BLOCK_MENU_NODE_TYPES
 */
export type BlockMenuNodeType = (typeof BLOCK_MENU_NODE_TYPES)[keyof typeof BLOCK_MENU_NODE_TYPES];

/**
 * Type for the suggested items rank mapping
 */
export type SuggestedItemsRankMap = {
	[nodeType: string]: {
		[menuItemKey: string]: number;
	};
};

/**
 * Mapping of source node types to suggested transformation menu items with their ranks.
 * Lower rank number = higher priority in the suggested menu section.
 */
export const TRANSFORM_SUGGESTED_ITEMS_RANK: SuggestedItemsRankMap = {
	// Paragraph suggestions
	[BLOCK_MENU_NODE_TYPES.PARAGRAPH]: {
		[TRANSFORM_STRUCTURE_PANEL_MENU_ITEM.key]: 100, // Turn into Panel
		[TRANSFORM_HEADINGS_H2_MENU_ITEM.key]: 200, // Turn into Heading 2
		[TRANSFORM_HEADINGS_H3_MENU_ITEM.key]: 300, // Turn into Heading 3
	},

	// Expand suggestions
	[BLOCK_MENU_NODE_TYPES.EXPAND]: {
		[TRANSFORM_STRUCTURE_PANEL_MENU_ITEM.key]: 100, // Turn into Panel (wrap content)
		[TRANSFORM_STRUCTURE_LAYOUT_MENU_ITEM.key]: 200, // Turn into Layout
		[TRANSFORM_STRUCTURE_PARAGRAPH_MENU_ITEM.key]: 300, // Turn into Paragraph
	},

	// Quote block (blockquote) suggestions
	[BLOCK_MENU_NODE_TYPES.BLOCKQUOTE]: {
		[TRANSFORM_STRUCTURE_PANEL_MENU_ITEM.key]: 100, // Turn into Panel
		[TRANSFORM_STRUCTURE_PARAGRAPH_MENU_ITEM.key]: 200, // Turn into Paragraph
		[TRANSFORM_STRUCTURE_LAYOUT_MENU_ITEM.key]: 300, // Turn into Layout
	},

	// Layout suggestions
	[BLOCK_MENU_NODE_TYPES.LAYOUT_SECTION]: {
		[TRANSFORM_STRUCTURE_PANEL_MENU_ITEM.key]: 100, // Wrap layout in panel
		[TRANSFORM_STRUCTURE_EXPAND_MENU_ITEM.key]: 200, // Make layout collapsible
		[TRANSFORM_HEADINGS_H2_MENU_ITEM.key]: 300, // doesn't meet compatibility matrix, needs to be updated
	},

	// Panel suggestions
	[BLOCK_MENU_NODE_TYPES.PANEL]: {
		[TRANSFORM_STRUCTURE_PARAGRAPH_MENU_ITEM.key]: 100, // Turn into Paragraph
		[TRANSFORM_STRUCTURE_QUOTE_MENU_ITEM.key]: 200, // Turn into Blockquote
		[TRANSFORM_STRUCTURE_CODE_BLOCK_MENU_ITEM.key]: 300, // Turn into Code Block
	},

	// Code block suggestions
	[BLOCK_MENU_NODE_TYPES.CODE_BLOCK]: {
		[TRANSFORM_STRUCTURE_EXPAND_MENU_ITEM.key]: 100, // Turn into Expand
		[TRANSFORM_STRUCTURE_LAYOUT_MENU_ITEM.key]: 200, // Turn into Layout
		[TRANSFORM_STRUCTURE_PANEL_MENU_ITEM.key]: 300, // Turn into Panel
	},

	// Decision suggestions
	[BLOCK_MENU_NODE_TYPES.DECISION]: {
		[TRANSFORM_STRUCTURE_PANEL_MENU_ITEM.key]: 100, // Wrap in Panel (Decision style)
		[TRANSFORM_STRUCTURE_PARAGRAPH_MENU_ITEM.key]: 200, // Turn into Paragraph
		[TRANSFORM_STRUCTURE_TASK_LIST_MENU_ITEM.key]: 300, // Convert to Task List
	},

	// Bulleted list suggestions
	[BLOCK_MENU_NODE_TYPES.BULLET_LIST]: {
		[TRANSFORM_STRUCTURE_NUMBERED_LIST_MENU_ITEM.key]: 100, // Turn into Numbered list
		[TRANSFORM_STRUCTURE_QUOTE_MENU_ITEM.key]: 200, // Turn into Blockquote
		[TRANSFORM_STRUCTURE_PARAGRAPH_MENU_ITEM.key]: 300, // Turn into Paragraph
	},

	// Numbered list (ordered list) suggestions
	[BLOCK_MENU_NODE_TYPES.ORDERED_LIST]: {
		[TRANSFORM_STRUCTURE_BULLETED_LIST_MENU_ITEM.key]: 100, // Turn into Bulleted list
		[TRANSFORM_STRUCTURE_TASK_LIST_MENU_ITEM.key]: 200, // Turn into Task List
		[TRANSFORM_STRUCTURE_PARAGRAPH_MENU_ITEM.key]: 300, // Turn into Paragraph
	},

	// Heading suggestions
	// Note: For headings, the specific heading level would need to be determined at runtime
	// This provides a general mapping, but actual implementation should consider current heading level
	[BLOCK_MENU_NODE_TYPES.HEADING]: {
		[TRANSFORM_STRUCTURE_PARAGRAPH_MENU_ITEM.key]: 100, // Turn into Paragraph
		[TRANSFORM_HEADINGS_H2_MENU_ITEM.key]: 200, // Turn into Heading 2
		[TRANSFORM_STRUCTURE_PANEL_MENU_ITEM.key]: 300, // Wrap in Panel
	},

	// Task list suggestions
	[BLOCK_MENU_NODE_TYPES.TASK_LIST]: {
		[TRANSFORM_STRUCTURE_PARAGRAPH_MENU_ITEM.key]: 100, // Turn into Paragraph
		[TRANSFORM_STRUCTURE_NUMBERED_LIST_MENU_ITEM.key]: 200, // Turn into Ordered list
		[TRANSFORM_STRUCTURE_CODE_BLOCK_MENU_ITEM.key]: 300, // Turn into Code Block (for technical TODOs)
	},

	// Media (mediaSingle) suggestions
	[BLOCK_MENU_NODE_TYPES.MEDIA_SINGLE]: {
		[TRANSFORM_STRUCTURE_PANEL_MENU_ITEM.key]: 100, // Wrap in Panel
		[TRANSFORM_STRUCTURE_LAYOUT_MENU_ITEM.key]: 200, // Place into Layout
		[TRANSFORM_STRUCTURE_PARAGRAPH_MENU_ITEM.key]: 300, // doesn't meet compatibility matrix, needs to be updated
	},

	// Extension (app/macro) suggestions
	[BLOCK_MENU_NODE_TYPES.EXTENSION]: {
		[TRANSFORM_STRUCTURE_PANEL_MENU_ITEM.key]: 100, // Wrap in Panel
		[TRANSFORM_STRUCTURE_PARAGRAPH_MENU_ITEM.key]: 200, // doesn't meet compatibility matrix, needs to be updated
		[TRANSFORM_STRUCTURE_EXPAND_MENU_ITEM.key]: 300, // Collapse in Expand
	},

	// Bodied Extension suggestions (same as Extension)
	[BLOCK_MENU_NODE_TYPES.BODIED_EXTENSION]: {
		[TRANSFORM_STRUCTURE_PANEL_MENU_ITEM.key]: 100, // Wrap in Panel
		[TRANSFORM_STRUCTURE_PARAGRAPH_MENU_ITEM.key]: 200, // doesn't meet compatibility matrix, needs to be updated
		[TRANSFORM_STRUCTURE_EXPAND_MENU_ITEM.key]: 300, // Collapse in Expand
	},

	// Smart link Card suggestions
	[BLOCK_MENU_NODE_TYPES.BLOCK_CARD]: {
		// Note: Smart link card conversion would be rank 100 (demote to card)
		[TRANSFORM_STRUCTURE_PANEL_MENU_ITEM.key]: 100, // Wrap in Panel
		[TRANSFORM_STRUCTURE_PARAGRAPH_MENU_ITEM.key]: 200, // doesn't meet compatibility matrix, needs to be updated
	},

	// Smart link Embed suggestions
	[BLOCK_MENU_NODE_TYPES.EMBED_CARD]: {
		// Note: Smart link embed conversion would be rank 100 (promote to embed)
		[TRANSFORM_STRUCTURE_PANEL_MENU_ITEM.key]: 100, // Wrap in Panel
		[TRANSFORM_STRUCTURE_PARAGRAPH_MENU_ITEM.key]: 200, // doesn't meet compatibility matrix, needs to be updated
	},

	// Table suggestions
	[BLOCK_MENU_NODE_TYPES.TABLE]: {
		[TRANSFORM_STRUCTURE_EXPAND_MENU_ITEM.key]: 100, // Turn into Expand
		[TRANSFORM_STRUCTURE_LAYOUT_MENU_ITEM.key]: 200, // Turn into Layout
	},
};

/**
 * Get suggested menu items for a given node type
 * @param nodeType - The source node type (e.g., 'paragraph', 'heading')
 * @returns Object mapping menu item keys to their ranks, or undefined if no suggestions
 */
export const getSuggestedItemsForNodeType = (
	nodeType: string,
): { [menuItemKey: string]: number } | undefined => {
	return TRANSFORM_SUGGESTED_ITEMS_RANK[nodeType];
};

/**
 * Get sorted suggested menu item keys for a given node type
 * @param nodeType - The source node type
 * @returns Array of menu item keys sorted by rank (highest priority first)
 */
export const getSortedSuggestedItems = (nodeType: string): string[] => {
	const suggestions = getSuggestedItemsForNodeType(nodeType);
	if (!suggestions) {
		return [];
	}

	return Object.entries(suggestions)
		.sort(([, rankA], [, rankB]) => rankA - rankB)
		.map(([key]) => key);
};
