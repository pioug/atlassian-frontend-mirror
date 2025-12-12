import type { ADFNode } from '../adfNode';
import type { ADFMark } from '../adfMark';
import type { TransformerNames } from '../transforms/transformerNames';
import type { ADFAttributes } from './ADFAttribute';
import type { ADFNodeGroup } from './ADFNodeGroup';
import type { ADFMarkSpec } from './ADFMarkSpec';

export type ADFNodeSpec = ADFCommonNodeSpec | ADFTextNodeSpec;

export type ADFCommonNodeSpec = {
	/**
	 *  https://prosemirror.net/docs/ref/#model.NodeSpec.marks
	 *
	 *  If true, it's equivalent to marks: '_'. Which means allow any mark on a child node.
	 */
	allowAnyChildMark?: boolean;

	/**
	 *  https://prosemirror.net/docs/ref/#model.NodeSpec.marks
	 *
	 *  If true, it's equivalent to marks: ''. Which means disallow any mark on a child node.
	 */
	allowNoChildMark?: boolean;

	/**
	 * https://prosemirror.net/docs/ref/#model.NodeSpec.atom
	 *
	 * Can be set to true to indicate that, though this isn't a leaf node, it doesn't have directly editable content and should be treated as a single unit in the view.
	 */
	atom?: boolean;

	/**
	 * Node attributes.
	 */
	attrs?: ADFAttributes;

	/**
	 * https://prosemirror.net/docs/ref/#model.NodeSpec.code
	 *
	 * Can be used to indicate that this node contains code, which causes some commands to behave differently.
	 */
	code?: boolean;

	/**
	 * Defines the content that is allowed to be nested inside this node.
	 *
	 * Content is positional, meaning that the order of the content items is significant.
	 */
	content?: Array<ADFNodeContentSpec>;

	/**
	 * JSON Schema and Validator Spec only.
	 *
	 * Maximum number of items that are allowed in the content.
	 * Replaces @maxItems annotation in schema types.
	 */
	contentMaxItems?: number;

	/**
	 * JSON Schema and Validator Spec only.
	 *
	 * Minimum number of items that are allowed in the content.
	 * Replaces @minItems annotation in schema types.
	 */
	contentMinItems?: number;

	/**
	 * PLEASE DO NOT USE THIS PROPERTY.
	 *
	 * Dangerous manual override allows to hardcode values of the node properties
	 * that are otherwise impossible to generate with the DSL.
	 *
	 * There are cases where nodes have content expressions or marks that are inconsistent across
	 * multiple schemas and need to be massaged to match the expected output.
	 *
	 * This is a temporary solution until the DSL is improved to handle these cases or nodes are aligned across different output formats.
	 */
	DANGEROUS_MANUAL_OVERRIDE?: {
		'pm-spec'?: DangerousManualOverride;
		'validator-spec'?: DangerousManualOverride;
	};

	/**
	 * https://prosemirror.net/docs/ref/#model.NodeSpec.defining
	 *
	 * When enabled, enables both definingAsContext and definingForContent.
	 */
	defining?: boolean;

	/**
	 * https://prosemirror.net/docs/ref/#model.NodeSpec.definingAsContext
	 *
	 * Determines whether this node is considered an important parent node during replace operations (such as paste).
	 * Non-defining (the default) nodes get dropped when their entire content is replaced,
	 * whereas defining nodes persist and wrap the inserted content.
	 */
	definingAsContext?: boolean;

	/**
	 * https://prosemirror.net/docs/ref/#model.NodeSpec.definingForContent
	 *
	 * In inserted content the defining parents of the content are preserved when possible.
	 * Typically, non-default-paragraph textblock types, and possibly list items, are marked as defining.
	 */
	definingForContent?: boolean;

	/**
	 * https://prosemirror.net/docs/ref/#model.NodeSpec.draggable
	 *
	 * Determines whether nodes of this type can be dragged without being selected. Defaults to false.
	 */
	draggable?: boolean;

	/**
	 * https://prosemirror.net/docs/ref/#model.NodeSpec.group
	 *
	 * The group that the node belongs to.
	 */
	group?: ADFNodeGroup;

	/**
	 * This is specifically for Validator Spec and JSON Spec.
	 *
	 * If true, node has marks in the spec, but doesn't allow any items.
	 *
	 * TODO: https://product-fabric.atlassian.net/browse/ED-27093
	 * This doesn't actually work. Need to combine with `marksMaxItems: 0`
	 */
	hasEmptyMarks?: boolean;

	/**
	 * A list of transformers that should ignore this node.
	 */
	ignore?: Array<TransformerNames>;

	/**
	 * https://prosemirror.net/docs/ref/#model.NodeSpec.inline
	 *
	 * Should be set to true for inline nodes. .
	 */
	inline?: true;

	/**
	 * https://prosemirror.net/docs/ref/#model.NodeSpec.isolating
	 *
	 * When enabled (default is false), the sides of nodes of this type count as boundaries that regular editing operations,
	 * like backspacing or lifting, won't cross. An example of a node that should probably have this enabled is a table cell.
	 */
	isolating?: boolean;

	/**
	 * https://prosemirror.net/docs/ref/#model.NodeSpec.linebreakReplacement
	 *
	 * A single inline node in a schema can be set to be a linebreak equivalent. When converting between block types that support the node
	 * and block types that don't but have whitespace set to "pre", setBlockType will convert between newline characters to or from linebreak nodes as appropriate.
	 */
	linebreakReplacement?: boolean;

	/**
	 * The marks that are allowed on this node.
	 */
	marks?: Array<ADFMark<ADFMarkSpec>>;

	/**
	 * JSON Schema and Validator Spec only.
	 *
	 * Maximum number of items that are allowed in the marks array.
	 * Replaces @maxItems annotation in schema types.
	 */
	marksMaxItems?: number;

	/**
	 * Some transformers implement an "extends" mechanism. This allows to avoid full
	 * node duplication and only override the necessary properties.
	 *
	 * The logic to decide when extends is appropriate can't be 100% sound
	 * and may require manual intervention.
	 *
	 * This flag allows to opt-out of the extends mechanism.
	 *
	 * Currently only supported by json-schema transformation.
	 */
	noExtend?: boolean;

	/**
	 * This is specifically for the JSON Schema and Validator Spec
	 *
	 * If true, it means marks are not allowed on this node.
	 * This is different to simply having an empty mark list.
	 */
	noMarks?: boolean;

	/**
	 * Marks a node as the top-level node of a document.
	 * Parsing and constructing ADF DSL data structures will start from this node.
	 * Only one root node is allowed in a document.
	 */
	root?: boolean;

	/**
	 * https://prosemirror.net/docs/ref/#model.NodeSpec.selectable
	 *
	 * Controls whether nodes of this type can be selected as a node selection. Defaults to true for non-text nodes.
	 */
	selectable?: boolean;

	/**
	 * Stage 0 schema is an experimental super-set of the full schema.
	 * It is used to test new features and is not guaranteed to be stable.
	 *
	 * WARNING: Confluence uses stage 0 schema in production.
	 *
	 * - stage0: true - means that the node is available in stage 0 schema only.
	 * - stage0: ADFNodeSpec - creates an override for the existing node for stage 0 schema.
	 */
	stage0?: true | (ADFNodeSpec & { stage0?: never });

	/**
	 * Non-standard attributes that are used to define the role of the node in the document.
	 * These attributes don't exist in the ProseMirror schema docs. And were migrated from the prosemirror-tables package.
	 */
	tableRole?: 'table' | 'cell' | 'header_cell' | 'row';

	/**
	 * Version of the ADF Schema. Will be on the doc, or root node.
	 * This exists for historical reasons and is only ever 1.
	 * It would be good to remove this in future.
	 */
	version?: 1;

	/**
	 * https://prosemirror.net/docs/ref/#model.NodeSpec.whitespace
	 *
	 * Controls way whitespace in this node is parsed. The default is "normal", which causes the DOM parser to collapse whitespace in normal mode,
	 * and normalize it (replacing newlines and such with spaces) otherwise. "pre" causes the parser to preserve spaces inside the node.
	 * When this option isn't given, but code is true, whitespace will default to "pre".
	 * Note that this option doesn't influence the way the node is rendered—that should be handled by toDOM and/or styling.
	 */
	whitespace?: 'pre' | 'normal';
};

export type DangerousManualOverride = Record<
	string,
	| {
			reason: string;
			remove?: never;
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			value: any;
	  }
	| {
			reason: string;
			remove: boolean;
			value?: never;
	  }
>;

type ADFTextNodeSpec = never;

export type ADFNodeContentSpec =
	| ADFNodeContentOneOrMoreSpec
	| ADFNodeContentZeroOrMoreSpec
	| ADFNodeContentRangeSpec
	| ADFNodeContentOrSpec;

export type ADFNodeContentOneOrMoreSpec = {
	content: ADFNodeContentSpec;
	type: '$one+';
};

export type ADFNodeContentZeroOrMoreSpec = {
	content: ADFNodeContentSpec;
	type: '$zero+';
};

export type ADFNodeContentOrSpec = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	content: Array<ADFNode<any> | ADFNodeGroup>;
	type: '$or';
};

export type ADFNodeContentRangeSpec = {
	content: ADFNodeContentSpec;
	max: number;
	min: number;
	type: '$range';
};
