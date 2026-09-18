/* eslint-disable @atlaskit/editor/no-re-export -- VOLTC-139 tracks removal of these deprecated compatibility re-export shims. */

import type { BreakoutMarkDefinition } from '../marks';
import type { BlockCardDefinition as BlockCard } from './block-card';
import type { BodiedRuleDefinition as BodiedRule } from './bodied-rule';
import type { CodeBlockDefinition as CodeBlock } from './code-block';
import type { DecisionListDefinition as DecisionList } from './decision-list';
import type { HeadingDefinition as Heading } from './heading';
import type { MediaGroupDefinition as MediaGroup } from './media-group';
import type { MediaSingleDefinition as MediaSingle } from './media-single';
import type { ParagraphDefinition as Paragraph } from './paragraph';
import type { RuleDefinition as Rule } from './rule';
import type { TableDefinition as Table } from './tableNodes';
import type { TaskListDefinition as TaskList } from './task-list';
import type {
	OrderedListDefinition as OrderedList,
	BulletListDefinition as BulletList,
} from './types/list';
import type { MarksObject } from './types/mark';

export enum PanelType {
	INFO = 'info',
	NOTE = 'note',
	TIP = 'tip',
	WARNING = 'warning',
	ERROR = 'error',
	SUCCESS = 'success',
	CUSTOM = 'custom',
}

export interface PanelAttributes {
	localId?: string;
	panelColor?: string;
	panelIcon?: string; // To identify emojis by shortName
	panelIconId?: string; // To uniquely identify emojis by id
	panelIconText?: string; // falling back to Unicode representation of standard emojis when image representation cannot be loaded
	panelType: PanelType;
}

/**
 * @name panel_node
 */
export interface PanelDefinition {
	attrs: PanelAttributes;
	/**
	 // eslint-disable-next-line eslint-plugin-jsdoc/check-tag-names
	 * @minItems 1
	 // eslint-disable-next-line eslint-plugin-jsdoc/check-tag-names
	 * @allowUnsupportedBlock true
	 */
	content: Array<
		| Paragraph
		| Heading
		| OrderedList
		| BulletList
		| BlockCard
		| CodeBlock
		| MediaGroup
		| MediaSingle
		| DecisionList
		| TaskList
		| Rule
		| BodiedRule
	>;
	type: 'panel';
}

/**
 * @name panel_c1_node
 */
export interface PanelC1Definition {
	attrs: PanelAttributes;
	/**
	 // eslint-disable-next-line eslint-plugin-jsdoc/check-tag-names
	 * @minItems 1
	 // eslint-disable-next-line eslint-plugin-jsdoc/check-tag-names
	 * @allowUnsupportedBlock true
	 */
	content: Array<
		| Paragraph
		| Heading
		| OrderedList
		| BulletList
		| BlockCard
		| CodeBlock
		| MediaGroup
		| MediaSingle
		| DecisionList
		| TaskList
		| Rule
		| BodiedRule
		| Table
	>;
	type: 'panel';
}

/**
 * @name panel_root_only_node
 */
export type PanelRootOnlyDefinition = PanelDefinition & MarksObject<BreakoutMarkDefinition>;

export interface DOMAttributes {
	[propName: string]: string;
}

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-re-exports -- Public compatibility re-export.
export { extendedPanel } from './extended-panel';

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-re-exports -- Public compatibility re-export.
export { extendedPanelWithLocalId } from './extended-panel-with-local-id';

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-re-exports -- Public compatibility re-export.
export { extendedPanelC1 } from './extended-panel-c1';

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-re-exports -- Public compatibility re-export.
export { extendedPanelC1WithLocalId } from './extended-panel-c1-with-local-id';

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-re-exports -- Public compatibility re-export.
export { extendedPanelRootOnlyStage0 } from './extended-panel-root-only-stage0';

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-re-exports -- Public compatibility re-export.
export { extendedPanelC1RootOnlyStage0 } from './extended-panel-c1-root-only-stage0';

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-re-exports -- Public compatibility re-export.
export { createPanelNodeSpecOptions } from './create-panel-node-spec-options';

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-re-exports -- Public compatibility re-export.
export { getDomAttrs } from './get-dom-attrs';
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-re-exports -- Public compatibility re-export.
export { getParseDOMAttrs } from './get-parse-dom-attrs';
