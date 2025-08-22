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
	icon?: ReactElement;
	LEGACY_icon?: ReactElement;
	level?: HeadingLevelsAndNormalText;
	name: string;
	nodeName: string;
	tagName?: string;
	title: MessageDescriptor;
}
export interface BlockTypeWithRank extends BlockType {
	toolbarKey: string;
	toolbarRank: number;
}
export interface BlockTypeNode {
	name: AllowedBlockTypes;
	node: NodeSpec;
}

export interface BlockTypePluginOptions {
	allowBlockType?: { exclude?: Array<AllowedBlockTypes> };
	includeBlockQuoteAsTextstyleOption?: boolean;
	isUndoRedoButtonsEnabled?: boolean;
	lastNodeMustBeParagraph?: boolean;
}
