import type { ParagraphDefinition as Paragraph } from './paragraph';
import type {
	OrderedListDefinition as OrderedList,
	BulletListDefinition as BulletList,
} from './types/list';
import type { HeadingDefinition as Heading } from './heading';
import type { BlockCardDefinition as BlockCard } from './block-card';
import type { CodeBlockDefinition as CodeBlock } from './code-block';
import type { MediaGroupDefinition as MediaGroup } from './media-group';
import type { MediaSingleDefinition as MediaSingle } from './media-single';
import type { DecisionListDefinition as DecisionList } from './decision-list';
import type { TaskListDefinition as TaskList } from './task-list';
import type { RuleDefinition as Rule } from './rule';
import type { NodeSpecOptions } from '../createPMSpecFactory';
import type { PanelNode } from '../../next-schema/generated/nodeTypes';
import { panel as panelFactory } from '../../next-schema/generated/nodeTypes';
import { uuid } from '../../utils/uuid';
import type { NodeSpec } from '@atlaskit/editor-prosemirror/model';

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
	>;
	type: 'panel';
}

export interface DOMAttributes {
	[propName: string]: string;
}

type ParseDOMAttrs = {
	localId?: string;
	panelColor?: string;
	panelIcon?: string;
	panelIconId?: string;
	panelIconText?: string;
	panelType: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getDomAttrs = (nodeAttrs: { [key: string]: any }): DOMAttributes => {
	const attrs: DOMAttributes = {
		'data-panel-type': nodeAttrs.panelType,
		'data-panel-icon': nodeAttrs.panelIcon,
		'data-panel-icon-id': nodeAttrs.panelIconId,
		'data-panel-icon-text': nodeAttrs.panelIconText,
		'data-panel-color': nodeAttrs.panelColor,
		'data-local-id': nodeAttrs?.localId || undefined,
	};

	return attrs;
};

const getParseDOMAttrs = (
	allowCustomPanel: boolean,
	dom: string | globalThis.Node,
	generateLocalId?: boolean,
): ParseDOMAttrs => {
	let parseDOMAttrs: ParseDOMAttrs = {
		// eslint-disable-next-line @atlaskit/editor/no-as-casting, @typescript-eslint/no-non-null-assertion
		panelType: (dom as HTMLElement).getAttribute('data-panel-type')!,
	};

	if (generateLocalId) {
		parseDOMAttrs.localId = uuid.generate();
	}

	if (allowCustomPanel) {
		parseDOMAttrs = {
			...parseDOMAttrs,
			// eslint-disable-next-line @atlaskit/editor/no-as-casting, @typescript-eslint/no-non-null-assertion
			panelIcon: (dom as HTMLElement).getAttribute('data-panel-icon')!,
			// eslint-disable-next-line @atlaskit/editor/no-as-casting, @typescript-eslint/no-non-null-assertion
			panelIconId: (dom as HTMLElement).getAttribute('data-panel-icon-id')!,
			// eslint-disable-next-line @atlaskit/editor/no-as-casting, @typescript-eslint/no-non-null-assertion
			panelIconText: (dom as HTMLElement).getAttribute('data-panel-icon-text')!,
			// eslint-disable-next-line @atlaskit/editor/no-as-casting, @typescript-eslint/no-non-null-assertion
			panelColor: (dom as HTMLElement).getAttribute('data-panel-color')!,
		};
	} else {
		parseDOMAttrs.panelType =
			parseDOMAttrs.panelType === PanelType.CUSTOM
				? PanelType.INFO
				: parseDOMAttrs.panelType;
	}

	return parseDOMAttrs;
};

const createPanelNodeSpecOptions: (
	allowCustomPanel: boolean,
	generateLocalId?: boolean,
) => NodeSpecOptions<PanelNode> = (allowCustomPanel, generateLocalId) => ({
	parseDOM: [
		{
			tag: 'div[data-panel-type]',
			getAttrs: (dom) =>
				getParseDOMAttrs(allowCustomPanel, dom, generateLocalId),
		},
	],
	toDOM(node) {
		const attrs: DOMAttributes = getDomAttrs(node.attrs);

		const contentAttrs: Record<string, string> = {
			'data-panel-content': 'true',
		};

		return ['div', attrs, ['div', contentAttrs, 0]];
	},
});

/**
 * @name extended_panel
 * @description it allows more content to be nested as compared to panel node.
 * Specifically, it allows Media, action, code-block, rule and decision nodes in
 * addition to content allowed inside panel
 */
export const extendedPanel = (allowCustomPanel: boolean): NodeSpec =>
	panelFactory(createPanelNodeSpecOptions(allowCustomPanel));

export const extendedPanelWithLocalId = (allowCustomPanel: boolean): NodeSpec =>
	panelFactory(createPanelNodeSpecOptions(allowCustomPanel, true));
