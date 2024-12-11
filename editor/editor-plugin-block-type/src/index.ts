// Disable no-re-export rule for entry point files
/* eslint-disable @atlaskit/editor/no-re-export */

export { blockTypePlugin } from './blockTypePlugin';
export type { BlockTypePlugin } from './blockTypePluginType';
export type { BlockTypePluginOptions, BlockType } from './pm-plugins/types';
export type { BlockTypeState } from './pm-plugins/main';
export type { InputMethod } from './pm-plugins/commands/block-type';
export type { DropdownItem } from './pm-plugins/ui/ToolbarBlockType';
export type { TextBlockTypes } from './pm-plugins/block-types';
