import type { NodeSpec } from '@atlaskit/editor-prosemirror/model';

import { doc as docFactory } from '../../next-schema/generated/nodeTypes';
import type { BodiedExtensionRootOnlyDefinition as BodiedExtensionRootOnly } from './bodied-extension';
import type { BodiedRuleRootOnlyDefinition as BodiedRuleRootOnly } from './bodied-rule';
import type { BodiedSyncBlockDefinition as BodiedSyncBlock } from './bodied-sync-block';
import type { CodeBlockWithMarksDefinition as CodeBlockWithMarks } from './code-block';
import type { ExpandRootOnlyDefinition as ExpandRootOnly } from './expand';
import type {
	ExtensionRootOnlyDefinition as ExtensionRootOnly,
	ExtensionRootOnlyWithAnnotationDefinition as ExtensionRootOnlyWithAnnotation,
} from './extension';
import type { LayoutSectionDefinition as LayoutSection } from './layout-section';
import type { MultiBodiedExtensionRootOnlyDefinition as MultiBodiedExtensionRootOnly } from './multi-bodied-extension';
import type { PanelRootOnlyDefinition as PanelRootOnly } from './panel';
import type { ParagraphWithIndentationDefinition } from './paragraph';
import type { RuleRootOnlyDefinition as RuleRootOnly } from './rule';
import type { SyncBlockDefinition as SyncBlock } from './sync-block';
import type { BlockContent } from './types/block-content';

/**
 * @name doc_node
 */
export interface DocNode {
	/**
	 // eslint-disable-next-line eslint-plugin-jsdoc/check-tag-names
	 * @allowUnsupportedBlock true
	 */
	content: Array<
		| BlockContent
		| LayoutSection
		| CodeBlockWithMarks
		| ExpandRootOnly
		| PanelRootOnly
		| RuleRootOnly
		| BodiedRuleRootOnly
		| ExtensionRootOnly
		| ExtensionRootOnlyWithAnnotation
		| BodiedExtensionRootOnly
		| ParagraphWithIndentationDefinition
		| MultiBodiedExtensionRootOnly
		| BodiedSyncBlock
		| SyncBlock
	>;
	type: 'doc';
	version: 1;
}

export const doc: NodeSpec = docFactory({});
