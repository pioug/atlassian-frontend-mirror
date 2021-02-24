// The names of the blocks don't map precisely to schema nodes, because
// of concepts like "paragraph" <-> "Normal text" and "Unknown".
//
// (there are also different blocks for different types of panel, when
// they're really all just a panel node)
//
// Rather than half-match half-not, this plugin introduces its own
// nomenclature for what 'block type' is active.
import { AllowedBlockTypes } from '../../types/allowed-block-types';
import { MessageDescriptor } from '../../types/i18n';
import { NodeSpec } from 'prosemirror-model';
import { messages } from './messages';

export const NORMAL_TEXT: BlockType = {
  name: 'normal',
  title: messages.normal,
  nodeName: 'paragraph',
  tagName: 'p',
};
export const HEADING_1: BlockType = {
  name: 'heading1',
  title: messages.heading1,
  nodeName: 'heading',
  tagName: 'h1',
  level: 1,
};
export const HEADING_2: BlockType = {
  name: 'heading2',
  title: messages.heading2,
  nodeName: 'heading',
  tagName: 'h2',
  level: 2,
};
export const HEADING_3: BlockType = {
  name: 'heading3',
  title: messages.heading3,
  nodeName: 'heading',
  tagName: 'h3',
  level: 3,
};
export const HEADING_4: BlockType = {
  name: 'heading4',
  title: messages.heading4,
  nodeName: 'heading',
  tagName: 'h4',
  level: 4,
};
export const HEADING_5: BlockType = {
  name: 'heading5',
  title: messages.heading5,
  nodeName: 'heading',
  tagName: 'h5',
  level: 5,
};
export const HEADING_6: BlockType = {
  name: 'heading6',
  title: messages.heading6,
  nodeName: 'heading',
  tagName: 'h6',
  level: 6,
};
export const BLOCK_QUOTE: BlockType = {
  name: 'blockquote',
  title: messages.blockquote,
  nodeName: 'blockquote',
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

export const WRAPPER_BLOCK_TYPES = [BLOCK_QUOTE, CODE_BLOCK, PANEL];
export const ALL_BLOCK_TYPES = TEXT_BLOCK_TYPES.concat(WRAPPER_BLOCK_TYPES);

export const HEADINGS_BY_LEVEL = TEXT_BLOCK_TYPES.reduce<
  Record<number, BlockType>
>((acc, blockType) => {
  if (blockType.level && blockType.nodeName === 'heading') {
    acc[blockType.level] = blockType;
  }

  return acc;
}, {});

export const HEADINGS_BY_NAME = TEXT_BLOCK_TYPES.reduce((acc, blockType) => {
  if (blockType.level && blockType.nodeName === 'heading') {
    acc[blockType.name] = blockType;
  }

  return acc;
}, {} as { [blockType: string]: BlockType });

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
}

export type HeadingLevels = 1 | 2 | 3 | 4 | 5 | 6;
export type NormalTextLevel = 0;
export type HeadingLevelsAndNormalText = HeadingLevels | NormalTextLevel;

export interface BlockTypeNode {
  name: AllowedBlockTypes;
  node: NodeSpec;
}

export interface BlockTypePluginOptions {
  lastNodeMustBeParagraph?: boolean;
  allowBlockType?: { exclude?: Array<AllowedBlockTypes> };
  isUndoRedoButtonsEnabled?: boolean;
}
