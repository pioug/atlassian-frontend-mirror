import type { CodeBlockWithMarksDefinition as CodeBlockWithMarks } from './code-block';
import type { ExpandRootOnlyDefinition as ExpandRootOnly } from './expand';
import type { LayoutSectionDefinition as LayoutSection } from './layout-section';
import type { ParagraphWithIndentationDefinition } from './paragraph';
import type { BlockContent } from './types/block-content';
import type { MultiBodiedExtensionDefinition as MultiBodiedExtension } from './multi-bodied-extension';
import { doc as docFactory } from '../../next-schema/generated/nodeTypes';
import type { SyncBlockDefinition as SyncBlock } from './sync-block';
import type { BodiedSyncBlockDefinition as BodiedSyncBlock } from './bodied-sync-block';

/**
 * @name doc_node
 */
export interface DocNode {
	/**
	 * @allowUnsupportedBlock true
	 */
	content: Array<
		| BlockContent
		| LayoutSection
		| CodeBlockWithMarks
		| ExpandRootOnly
		| ParagraphWithIndentationDefinition
		| MultiBodiedExtension
		| BodiedSyncBlock
		| SyncBlock
	>;
	type: 'doc';
	version: 1;
}

export const doc = docFactory({});
