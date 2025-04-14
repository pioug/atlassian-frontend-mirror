import React from 'react';

import { blockTypeMessages as messages } from '@atlaskit/editor-common/messages';
import TextHeadingFiveIcon from '@atlaskit/icon-lab/core/text-heading-five';
import TextHeadingFourIcon from '@atlaskit/icon-lab/core/text-heading-four';
import TextHeadingOneIcon from '@atlaskit/icon-lab/core/text-heading-one';
import TextHeadingSixIcon from '@atlaskit/icon-lab/core/text-heading-six';
import TextHeadingThreeIcon from '@atlaskit/icon-lab/core/text-heading-three';
import TextHeadingTwoIcon from '@atlaskit/icon-lab/core/text-heading-two';
import TextIcon from '@atlaskit/icon/core/text';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { BlockType } from './types';
import { Text, H1, H2, H3, H4, H5, H6 } from './ui/ToolbarBlockType/icons';

export const NORMAL_TEXT: BlockType = {
	name: 'normal',
	title: messages.normal,
	nodeName: 'paragraph',
	tagName: 'p',
	icon: <TextIcon label="" />,
	LEGACY_icon: <Text />,
};
export const HEADING_1: BlockType = {
	name: 'heading1',
	title: messages.heading1,
	nodeName: 'heading',
	tagName: 'h1',
	level: 1,
	icon: <TextHeadingOneIcon label="" />,
	LEGACY_icon: <H1 />,
};
export const HEADING_2: BlockType = {
	name: 'heading2',
	title: messages.heading2,
	nodeName: 'heading',
	tagName: 'h2',
	level: 2,
	icon: <TextHeadingTwoIcon label="" />,
	LEGACY_icon: <H2 />,
};
export const HEADING_3: BlockType = {
	name: 'heading3',
	title: messages.heading3,
	nodeName: 'heading',
	tagName: 'h3',
	level: 3,
	icon: <TextHeadingThreeIcon label="" />,
	LEGACY_icon: <H3 />,
};
export const HEADING_4: BlockType = {
	name: 'heading4',
	title: messages.heading4,
	nodeName: 'heading',
	tagName: 'h4',
	level: 4,
	icon: <TextHeadingFourIcon label="" />,
	LEGACY_icon: <H4 />,
};
export const HEADING_5: BlockType = {
	name: 'heading5',
	title: messages.heading5,
	nodeName: 'heading',
	tagName: 'h5',
	level: 5,
	icon: <TextHeadingFiveIcon label="" />,
	LEGACY_icon: <H5 />,
};
export const HEADING_6: BlockType = {
	name: 'heading6',
	title: messages.heading6,
	nodeName: 'heading',
	tagName: 'h6',
	level: 6,
	icon: <TextHeadingSixIcon label="" />,
	LEGACY_icon: <H6 />,
};
export const BLOCK_QUOTE: BlockType = {
	name: 'blockquote',
	title: messages.blockquote,
	nodeName: 'blockquote',
	tagName: 'blockquote',
};
export const CODE_BLOCK: BlockType = {
	name: 'codeblock',
	title: messages.codeblock,
	nodeName: 'codeBlock',
};
export const PANEL: BlockType = {
	name: 'panel',
	title: messages.infoPanel,
	nodeName: 'panel',
};
export const OTHER: BlockType = {
	name: 'other',
	title: messages.other,
	nodeName: '',
};

export const TEXT_BLOCK_TYPES = [
	NORMAL_TEXT,
	HEADING_1,
	HEADING_2,
	HEADING_3,
	HEADING_4,
	HEADING_5,
	HEADING_6,
];

export type TextBlockTypes =
	| 'normal'
	| 'heading1'
	| 'heading2'
	| 'heading3'
	| 'heading4'
	| 'heading5'
	| 'heading6';

export const FORMATTING_NODE_TYPES = ['heading', 'blockquote'];
export const FORMATTING_MARK_TYPES = [
	'em',
	'code',
	'strike',
	'strong',
	'underline',
	'textColor',
	'subsup',
	'backgroundColor',
];

export const WRAPPER_BLOCK_TYPES = [BLOCK_QUOTE, CODE_BLOCK, PANEL];
export const ALL_BLOCK_TYPES = TEXT_BLOCK_TYPES.concat(WRAPPER_BLOCK_TYPES);

export const getBlockTypesInDropdown = (includeBlockQuoteAsTextstyleOption?: boolean) => {
	return editorExperiment('platform_editor_blockquote_in_text_formatting_menu', true, {
		exposure: true,
	}) && includeBlockQuoteAsTextstyleOption
		? [...TEXT_BLOCK_TYPES, BLOCK_QUOTE]
		: TEXT_BLOCK_TYPES;
};

export const HEADINGS_BY_LEVEL = TEXT_BLOCK_TYPES.reduce<Record<number, BlockType>>(
	(acc, blockType) => {
		if (blockType.level && blockType.nodeName === 'heading') {
			acc[blockType.level] = blockType;
		}

		return acc;
	},
	{},
);

export const HEADINGS_BY_NAME = TEXT_BLOCK_TYPES.reduce(
	(acc, blockType) => {
		if (blockType.level && blockType.nodeName === 'heading') {
			acc[blockType.name] = blockType;
		}

		return acc;
	},
	{} as { [blockType: string]: BlockType },
);
