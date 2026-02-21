import type { ADFNode } from '../../adfNode';
import type { ADFAttributes } from '../../types/ADFAttribute';
import type { ADFNodeSpec } from '../../types/ADFNodeSpec';
import { JSONSchemaTransformerName } from '../transformerNames';
import type { ContentVisitorReturnType } from './adfToJsonVisitor';
import { buildAttrs } from './attrBuilder';
import { buildContent } from './contentBuilder';
import { resolveName } from './nameResolver';
import { buildRequired, buildVariantRequired } from './requiredBuilder';

export const buildNode = (
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	node: ADFNode<any>,
	content: Array<ContentVisitorReturnType>,
	fullSchema: boolean,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
): Record<string, any> => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const json: Record<string, any> = {};
	const isStage0 = !fullSchema && node.hasStage0();
	const nodeSpec: ADFNodeSpec = node.getSpec(isStage0);
	const jsonContent = buildContent(content, node.getName(), nodeSpec, fullSchema);

	const nodeMarks =
		nodeSpec.marks
			?.map((mark) => {
				if (mark.isIgnored(JSONSchemaTransformerName)) {
					return;
				}
				return mark.getType();
			})
			.filter(Boolean) || [];
	const marks = buildNodeMarks(nodeMarks as string[], {
		hasNoMarks: !!nodeSpec.noMarks,
		hasEmptyMarks: !!nodeSpec.hasEmptyMarks,
		marksMaxItems: nodeSpec.marksMaxItems,
	});
	const attrs = buildAttrs(node.getSpec().attrs);

	const version = nodeSpec.version;
	const jsonVersion = version ? { version: { enum: [version] } } : {};
	const required = buildRequired(
		nodeSpec.attrs as ADFAttributes,
		content[0]?.minItems === 1 || Boolean(content[0]?.range?.type),
		node.getName(),
	);

	if (node.getVariant() === 'base' || nodeSpec.noExtend || node.hasAttributeOverride()) {
		json.type = 'object';
		json.properties = {
			type: {
				enum: [node.getType()],
			},
			...marks,
			...attrs,
			...jsonContent,
			...jsonVersion,
		};
		json.additionalProperties = false;
		json.required = required;

		// Text is a special node in PM and it has a text property
		if (node.getName() === 'text') {
			json.properties.text = { minLength: 1, type: 'string' };
			json.required.push('text');
		}
	} else {
		const required = buildVariantRequired(content);
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const allOfItem: Record<string, any> = {
			type: 'object',
			properties: {
				...marks,
				...jsonContent,
			},
			...required,
			additionalProperties: true,
		};

		json.allOf = [
			{
				// @ts-expect-error
				$ref: `#/definitions/${resolveName(node.getBase().getName())}`,
			},
			allOfItem,
		];
	}

	return json;
};

export function buildNodeMarks(
	nodeMarks: string[],
	opts: {
		hasEmptyMarks: boolean;
		hasNoMarks: boolean;
		marksMaxItems?: number;
	},
):
	| {
			marks: {
				items: {
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					anyOf: any[];
				};
				maxItems: number | undefined;
				type: string;
			};
	  }
	| {
			marks: {
				items?: undefined;
				maxItems: number | undefined;
				type: string;
			};
	  }
	| {
			marks?: undefined;
	  }
	| {
			marks: {
				items: {
					$ref: string;
				};
				maxItems: number | undefined;
				type: string;
			};
	  } {
	const { hasNoMarks, hasEmptyMarks, marksMaxItems } = opts;
	if (hasNoMarks) {
		return {
			marks: {
				type: 'array',
				maxItems: marksMaxItems ?? 0,
			},
		};
	}
	if (hasEmptyMarks) {
		return {
			marks: {
				type: 'array',
				maxItems: marksMaxItems,
			},
		};
	}
	if (nodeMarks.length === 0) {
		return {};
	}
	if (nodeMarks.length === 1) {
		return {
			marks: {
				type: 'array',
				items: { $ref: `#/definitions/${nodeMarks[0]}_mark` },
				maxItems: marksMaxItems,
			},
		};
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const markDefinitions: any[] = [];

	nodeMarks.forEach((markName) => {
		markDefinitions.push({ $ref: `#/definitions/${markName}_mark` });
	});

	const jsonMarks = {
		marks: {
			type: 'array',
			items: { anyOf: markDefinitions },
			maxItems: marksMaxItems,
		},
	};

	return jsonMarks;
}
