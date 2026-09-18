import {
	TRANSFORM_HEADINGS_MENU_SECTION_RANK,
	TRANSFORM_HEADINGS_H1_MENU_ITEM,
	TRANSFORM_HEADINGS_H2_MENU_ITEM,
	TRANSFORM_HEADINGS_H3_MENU_ITEM,
	TRANSFORM_HEADINGS_H4_MENU_ITEM,
	TRANSFORM_HEADINGS_H5_MENU_ITEM,
	TRANSFORM_HEADINGS_H6_MENU_ITEM,
	TRANSFORM_STRUCTURE_QUOTE_MENU_ITEM,
	TRANSFORM_STRUCTURE_PARAGRAPH_MENU_ITEM,
	TRANSFORM_STRUCTURE_MENU_SECTION,
	TRANSFORM_STRUCTURE_MENU_SECTION_RANK,
} from '@atlaskit/editor-common/block-menu';
import {
	TRANSFORM_TEXTFORMATTING_MENU_SECTION,
	TRANSFORM_TEXT_FORMATTING_SMALL_TEXT_MENU_ITEM,
} from '@atlaskit/editor-common/block-menu/key';
import { TRANSFORM_TEXT_FORMATTING_MENU_SECTION_RANK } from '@atlaskit/editor-common/block-menu/rank';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { RegisterBlockMenuComponent } from '@atlaskit/editor-plugin-block-menu';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';

import type { BlockTypePlugin } from '../blockTypePluginType';
import { createHeadingBlockMenuItem } from './HeadingBlockMenuItem';
import { createParagraphBlockMenuItem } from './ParagraphBlockMenuItem';
import { createQuoteBlockMenuItem } from './QuoteBlockMenuItem';
import { createSmallTextBlockMenuItem } from './SmallTextBlockMenuItem';
import type { TextFormattingBlockMenuOptions } from './types';

const HEADING_NODE_NAME = 'heading';
const QUOTE_NODE_NAME = 'blockquote';
const PARAGRAPH_NODE_NAME = 'paragraph';

export const getBlockTypeComponents = (
	api: ExtractInjectionAPI<BlockTypePlugin> | undefined,
	{ allowFontSize }: TextFormattingBlockMenuOptions = {},
): RegisterBlockMenuComponent[] => {
	const isSmallTextExperimentEnabled = isExperimentEnabled('platform_editor_block_menu_small_text');
	const isSmallTextEnabled = Boolean(allowFontSize && isSmallTextExperimentEnabled);
	const textFormattingRank = isSmallTextExperimentEnabled
		? TRANSFORM_TEXT_FORMATTING_MENU_SECTION_RANK
		: TRANSFORM_HEADINGS_MENU_SECTION_RANK;
	const isTransformHeadingDisabled = (level: number) =>
		Boolean(
			api?.blockMenu?.actions.isTransformOptionDisabled(HEADING_NODE_NAME, {
				level,
			}),
		);

	return [
		{
			type: 'block-menu-item',
			key: TRANSFORM_HEADINGS_H1_MENU_ITEM.key,
			parent: {
				type: 'block-menu-section' as const,
				key: TRANSFORM_TEXTFORMATTING_MENU_SECTION.key,
				rank: textFormattingRank[TRANSFORM_HEADINGS_H1_MENU_ITEM.key],
			},
			component: createHeadingBlockMenuItem({ level: 1, api }),
			isHidden: () => isTransformHeadingDisabled(1),
		},
		{
			type: 'block-menu-item',
			key: TRANSFORM_HEADINGS_H2_MENU_ITEM.key,
			parent: {
				type: 'block-menu-section' as const,
				key: TRANSFORM_TEXTFORMATTING_MENU_SECTION.key,
				rank: textFormattingRank[TRANSFORM_HEADINGS_H2_MENU_ITEM.key],
			},
			component: createHeadingBlockMenuItem({ level: 2, api }),
			isHidden: () => isTransformHeadingDisabled(2),
		},

		{
			type: 'block-menu-item',
			key: TRANSFORM_HEADINGS_H3_MENU_ITEM.key,
			parent: {
				type: 'block-menu-section' as const,
				key: TRANSFORM_TEXTFORMATTING_MENU_SECTION.key,
				rank: textFormattingRank[TRANSFORM_HEADINGS_H3_MENU_ITEM.key],
			},
			component: createHeadingBlockMenuItem({ level: 3, api }),
			isHidden: () => isTransformHeadingDisabled(3),
		},
		{
			type: 'block-menu-item',
			key: TRANSFORM_HEADINGS_H4_MENU_ITEM.key,
			parent: {
				type: 'block-menu-section' as const,
				key: TRANSFORM_TEXTFORMATTING_MENU_SECTION.key,
				rank: textFormattingRank[TRANSFORM_HEADINGS_H4_MENU_ITEM.key],
			},
			component: createHeadingBlockMenuItem({ level: 4, api }),
			isHidden: () => isTransformHeadingDisabled(4),
		},
		{
			type: 'block-menu-item',
			key: TRANSFORM_HEADINGS_H5_MENU_ITEM.key,
			parent: {
				type: 'block-menu-section' as const,
				key: TRANSFORM_TEXTFORMATTING_MENU_SECTION.key,
				rank: textFormattingRank[TRANSFORM_HEADINGS_H5_MENU_ITEM.key],
			},
			component: createHeadingBlockMenuItem({ level: 5, api }),
			isHidden: () => isTransformHeadingDisabled(5),
		},
		{
			type: 'block-menu-item',
			key: TRANSFORM_HEADINGS_H6_MENU_ITEM.key,
			parent: {
				type: 'block-menu-section' as const,
				key: TRANSFORM_TEXTFORMATTING_MENU_SECTION.key,
				rank: textFormattingRank[TRANSFORM_HEADINGS_H6_MENU_ITEM.key],
			},
			component: createHeadingBlockMenuItem({ level: 6, api }),
			isHidden: () => isTransformHeadingDisabled(6),
		},
		{
			type: 'block-menu-item',
			key: TRANSFORM_STRUCTURE_QUOTE_MENU_ITEM.key,
			parent: {
				type: 'block-menu-section' as const,
				key: isSmallTextExperimentEnabled
					? TRANSFORM_TEXTFORMATTING_MENU_SECTION.key
					: TRANSFORM_STRUCTURE_MENU_SECTION.key,
				rank: isSmallTextExperimentEnabled
					? TRANSFORM_TEXT_FORMATTING_MENU_SECTION_RANK[TRANSFORM_STRUCTURE_QUOTE_MENU_ITEM.key]
					: TRANSFORM_STRUCTURE_MENU_SECTION_RANK[TRANSFORM_STRUCTURE_QUOTE_MENU_ITEM.key],
			},
			component: createQuoteBlockMenuItem({ api }),
			isHidden: () => Boolean(api?.blockMenu?.actions.isTransformOptionDisabled(QUOTE_NODE_NAME)),
		},
		{
			type: 'block-menu-item',
			key: TRANSFORM_STRUCTURE_PARAGRAPH_MENU_ITEM.key,
			parent: {
				type: 'block-menu-section' as const,
				key: isSmallTextExperimentEnabled
					? TRANSFORM_TEXTFORMATTING_MENU_SECTION.key
					: TRANSFORM_STRUCTURE_MENU_SECTION.key,
				rank: isSmallTextExperimentEnabled
					? TRANSFORM_TEXT_FORMATTING_MENU_SECTION_RANK[TRANSFORM_STRUCTURE_PARAGRAPH_MENU_ITEM.key]
					: TRANSFORM_STRUCTURE_MENU_SECTION_RANK[TRANSFORM_STRUCTURE_PARAGRAPH_MENU_ITEM.key],
			},
			component: createParagraphBlockMenuItem({ api }),
			isHidden: () =>
				Boolean(
					api?.blockMenu?.actions.isTransformOptionDisabled(
						PARAGRAPH_NODE_NAME,
						undefined,
						isSmallTextExperimentEnabled ? { marksToRemove: ['fontSize'] } : undefined,
					),
				),
		},
		...(isSmallTextEnabled
			? [
					{
						type: 'block-menu-item' as const,
						key: TRANSFORM_TEXT_FORMATTING_SMALL_TEXT_MENU_ITEM.key,
						parent: {
							type: 'block-menu-section' as const,
							key: TRANSFORM_TEXTFORMATTING_MENU_SECTION.key,
							rank: TRANSFORM_TEXT_FORMATTING_MENU_SECTION_RANK[
								TRANSFORM_TEXT_FORMATTING_SMALL_TEXT_MENU_ITEM.key
							],
						},
						component: createSmallTextBlockMenuItem({ api }),
						isHidden: () =>
							!api?.core.sharedState.currentState()?.schema?.marks.fontSize ||
							Boolean(
								api?.blockMenu?.actions.isTransformOptionDisabled(PARAGRAPH_NODE_NAME, undefined, {
									marksToAdd: { fontSize: { fontSize: 'small' } },
								}),
							),
					},
				]
			: []),
	];
};
