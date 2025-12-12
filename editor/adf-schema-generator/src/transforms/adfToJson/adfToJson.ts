import type { ADFNode } from '../../adfNode';
import { traverse } from '../../traverse';
import type { ADFNodeSpec } from '../../types/ADFNodeSpec';
import { buildNode } from './nodeBuilder';
import type {
	ContentVisitorReturnType,
	GroupVisitorReturnType,
	NodeVisitorReturnType,
} from './adfToJsonVisitor';
import { buildVisitor } from './adfToJsonVisitor';

import type { JSONSchema4 } from 'json-schema';
import flow from 'lodash/flow';

export function transform(adf: ADFNode<[string], ADFNodeSpec>, fullSchema: boolean) {
	const result: Record<string, NodeVisitorReturnType> = {};

	traverse<NodeVisitorReturnType, GroupVisitorReturnType, ContentVisitorReturnType>(
		adf,
		buildVisitor(result, buildNode, fullSchema),
	);

	return formatResult(result);
}

function formatResult(result: Record<string, NodeVisitorReturnType>): JSONSchema4 {
	const formattedResult: Record<string, JSONSchema4> = {};

	Object.entries(result)
		.sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
		.forEach(([key, value]) => {
			formattedResult[key] = value.json;
		});

	const finalResult: JSONSchema4 = {
		$ref: '#/definitions/doc_node',
		description: 'Schema for Atlassian Document Format.',
		$schema: 'http://json-schema.org/draft-04/schema#',
		definitions: formattedResult,
	};

	return finalResult;
}

export function adfToJSON(
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	adf: ADFNode<[string], any>,
	shouldGenerateFullSchema = false,
): JSONSchema4 {
	return flow(
		transform,
		fixCommonCompatibilityIssues,
		shouldGenerateFullSchema ? (json) => json : fixCompatibilityIssuesForStageZero,
	)(adf, shouldGenerateFullSchema);
}

// Compatibility issues are grouped by nodes
function fixCommonCompatibilityIssues(json: JSONSchema4) {
	// Extra properties
	// @DSLCompatibilityException Despite being oneplus, doc has no minItems field
	delete json.definitions?.doc_node.properties?.content.minItems;
	/**
	 * @DSLCompatibilityException Skips including this node in content for the node or groups specified in JSON Schema.
	 * The following nodes are present in the content for the PM Spec but not in the JSON Schema. During cleanup we need to align the JSON
	 * Schema with the PM Spec to remove these exceptions.
	 */
	// @ts-expect-error anyOf is not on items in the JSON Schema type but is available in the JSON schema
	json.definitions.doc_node.properties.content.items.anyOf =
		// @ts-expect-error anyOf is not on items in the JSON Schema type but is available in the JSON schema
		json.definitions.doc_node.properties.content.items.anyOf.filter(
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(v: any) =>
				![
					'bodiedExtension_node',
					'extension_node',
					'heading_node',
					'layoutSection_node',
					'mediaSingle_node',
					'paragraph_node',
				]
					.map((v) => `#/definitions/${v}`)
					.includes(v.$ref),
		);

	// @DSLCompatibilityException These needs to be added to the JSON Schema to match PM Spec
	if (
		json.definitions &&
		json.definitions.inline_node &&
		Array.isArray(json.definitions.inline_node.anyOf)
	) {
		json.definitions.inline_node.anyOf = json.definitions.inline_node.anyOf.filter(
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(v: any) =>
				![
					'#/definitions/confluenceJiraIssue_node',
					'#/definitions/confluenceUnsupportedInline_node',
					'#/definitions/image_node',
					'#/definitions/inlineExtension_node',
					'#/definitions/text_link_inline_node',
					'#/definitions/text_node',
					'#/definitions/unsupportedInline_node',
				].includes(v.$ref),
		);
	}

	// @DSLCompatibilityException layoutSection in JSON schema is a "base" spec,
	// where majority of the restrictions are applied in variants which extend the base spec.
	// Hence things like minItems and maxItems are actually lifted to variants and need to be removed
	// from the base spec. Need to get rid of the base + extends pattern for layout.
	delete json.definitions?.layoutSection_node.properties?.content.minItems;
	delete json.definitions?.layoutSection_node.properties?.content.maxItems;

	// @DSLCompatibilityException Despite having required attributes, mediaSingle has no attrs required
	if (json.definitions && json.definitions.mediaSingle_node) {
		json.definitions.mediaSingle_node.required = (
			json.definitions.mediaSingle_node.required as string[]
		).filter((v) => v !== 'attrs');
		// @DSLCompatibilityException Find out why mediaSingle has additionalproperties
		json.definitions.mediaSingle_node.additionalProperties = true;
	}

	// @DSLCompatibilityException mediaInline node does not have url in JSON Schema. Should add it into JSON Schema
	delete json.definitions?.mediaInline_node.properties?.attrs.properties?.url;
	// @DSLCompatibilityException Find out why mediaInline has data in json but not in pm spec
	if (json.definitions?.mediaInline_node?.properties?.attrs?.properties) {
		json.definitions.mediaInline_node.properties.attrs.properties.data = {};
	}

	// @DSLCompatibilityException nestedExpand_content is the content for nestedExpand but as a separate entry
	if (json.definitions && Array.isArray(json.definitions.nestedExpand_content.allOf)) {
		const objectDef = json.definitions.nestedExpand_content.allOf.find((v) => v.type === 'object');
		if (objectDef && objectDef.properties && objectDef.properties.content) {
			json.definitions.nestedExpand_content = objectDef.properties.content;
		}
	}

	// @DSLCompatibilityException nested expand references nestedExpand_content in JSON schema
	if (json.definitions?.nestedExpand_node.properties) {
		json.definitions.nestedExpand_node.properties.content = {
			$ref: '#/definitions/nestedExpand_content',
		};
	}
	// @DSLCompatibilityException Despite having no required attributes, nestedExpand has attrs required
	if (json.definitions) {
		(json.definitions.nestedExpand_node.required as string[]).push('attrs');
	}

	// @DSLCompatibilityException table header and table cell refers to table cell content
	// However, the list of references are duplicated in the DSL. We should follow the DSL and replace this reference with its content
	if (json.definitions && json.definitions.table_cell_content?.properties) {
		json.definitions.table_cell_content = json.definitions.table_cell_content.properties.content;
	}

	// @DSLCompatibilityException nestedExpand.use('content') is not an actual node, but used as a reference for nestedExpand*
	// Since this is only used in tableCell and tableHeader, we put it in table cell content so the definition is generated alongside where it's used.
	// @ts-expect-error anyOf is not on items in the JSON Schema type but is available in the JSON schema
	json.definitions.table_cell_content.items.anyOf =
		// @ts-expect-error anyOf is not on items in the JSON Schema type but is available in the JSON schema
		json.definitions.table_cell_content.items.anyOf.filter(
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(v: any) => v.$ref !== '#/definitions/nestedExpand_content',
		);

	if (json.definitions?.table_cell_node?.properties) {
		json.definitions.table_cell_node.properties.content = {
			$ref: `#/definitions/table_cell_content`,
		};
	}
	if (json.definitions?.table_header_node?.properties) {
		json.definitions.table_header_node.properties.content = {
			$ref: `#/definitions/table_cell_content`,
		};
	}
	// @DSLCompatibilityException Table cell content is not an actual content of table row
	// Only used as a ref for table header and cell node.
	// Once table cell content is no longer used, we can remove this.
	// @ts-expect-error anyOf is not on items in the JSON Schema type but is available in the JSON schema
	json.definitions.table_row_node.properties.content.items.anyOf =
		// @ts-expect-error anyOf is not on items in the JSON Schema type but is available in the JSON schema
		json.definitions.table_row_node.properties.content.items.anyOf.filter(
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(v: any) => v.$ref !== '#/definitions/table_cell_content',
		);

	// @DSLCompatibilityException Despite being oneplus, tableRow has no minItems field
	delete json.definitions?.table_row_node.properties?.content.minItems;

	return json;
}

function fixCompatibilityIssuesForStageZero(json: JSONSchema4) {
	// @DSLCompatibilityException Despite being oneplus, multiBodiedExtension_node has no minItems field
	delete json.definitions?.multiBodiedExtension_node.properties?.content.minItems;

	return json;
}
