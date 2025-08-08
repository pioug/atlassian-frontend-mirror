// The names of the blocks don't map precisely to schema nodes, because
// of concepts like "paragraph" <-> "Normal text" and "Unknown".
//
// (there are also different blocks for different types of panel, when
// they're really all just a panel node)
//
// Rather than half-match half-not, this plugin introduces its own
// nomenclature for what 'block type' is active.
import type { ReactElement } from 'react';

import type { MessageDescriptor } from 'react-intl-next';

import type { AllowedBlockTypes, HeadingLevelsAndNormalText } from '@atlaskit/editor-common/types';
import type { NodeSpec } from '@atlaskit/editor-prosemirror/model';

export type BlockTypeName =
	| 'normal'
	| 'heading1'
	| 'heading2'
	| 'heading3'
	| 'heading4'
	| 'heading5'
	| 'heading6'
	| 'blockquote'
	| 'codeblock'
	| 'panel'
	| 'notePanel'
	| 'successPanel'
	| 'warningPanel'
	| 'errorPanel'
	| 'other';

export interface BlockType {
	name: string;
	title: MessageDescriptor;
	nodeName: string;
	tagName?: string;
	level?: HeadingLevelsAndNormalText;
	icon?: ReactElement;
	LEGACY_icon?: ReactElement;
}
export interface BlockTypeWithRank extends BlockType {
	toolbarRank: number;
	toolbarKey: string;
}
export interface BlockTypeNode {
	name: AllowedBlockTypes;
	node: NodeSpec;
}

export interface BlockTypePluginOptions {
	lastNodeMustBeParagraph?: boolean;
	allowBlockType?: { exclude?: Array<AllowedBlockTypes> };
	isUndoRedoButtonsEnabled?: boolean;
	includeBlockQuoteAsTextstyleOption?: boolean;
}
