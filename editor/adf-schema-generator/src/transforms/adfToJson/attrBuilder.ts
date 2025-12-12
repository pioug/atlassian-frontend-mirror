import type { JSONSchema4 } from 'json-schema';
import type { ADFAttribute, ADFAttributes } from '../../types/ADFAttribute';
import { isAnyOf } from '../../utils/isAnyOf';

export function buildAttrs(nodeAttrs: ADFAttributes | undefined): JSONSchema4 {
	if (!nodeAttrs || Object.keys(nodeAttrs).length === 0) {
		return {};
	}
	return { attrs: buildAttributesMap(nodeAttrs) };
}

function buildAttributesMap(nodeAttrs: ADFAttributes | undefined): JSONSchema4 {
	// If anyOf, we need account for each item in the "anyOf" list
	if (nodeAttrs && isAnyOf(nodeAttrs)) {
		const anyOfAttrsSets: JSONSchema4[] = [];
		nodeAttrs.anyOf.forEach((attrsSet) => {
			anyOfAttrsSets.push(buildAttrsSet(attrsSet));
		});
		return { anyOf: anyOfAttrsSets };
	}

	return buildAttrsSet(nodeAttrs as Record<string, ADFAttribute>);
}

export function buildAttrsSet(attrsSet: Record<string, ADFAttribute>): JSONSchema4 {
	const jsonAttrs: JSONSchema4 = {};
	const required: string[] = [];

	Object.entries(attrsSet).forEach(([key, attr]) => {
		// Make a copy so we don't change the original attribute
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const builtAttr: any = { ...attr };

		// Attributes starting with underscores are omitted from the JSON Schema
		if (key[0] === '_') {
			return;
		}

		if (!attr.optional) {
			required.push(key);
		}

		if (builtAttr.type === 'object' && builtAttr.properties) {
			builtAttr.properties = buildAttributesMap(builtAttr.properties).properties;
		}

		if (attr.type === 'array' && attr.items.type === 'object' && attr.items.properties) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(builtAttr as any).items = buildAttributesMap(attr.items.properties);
		}

		// Enum formatting is different in the JSON Schema
		if (builtAttr.type === 'enum') {
			delete builtAttr.type;
			builtAttr['enum'] = builtAttr.values;
			delete builtAttr.values;
		}
		// "validatorFn" is a specific property for the validator only
		// See: https://product-fabric.atlassian.net/wiki/spaces/CPMT/pages/2973303550/ADF+Change+58+bring+back+url+and+link+validation
		else if (builtAttr.type === 'string') {
			delete builtAttr.validatorFn;
		}

		delete builtAttr.optional;
		delete builtAttr.default;

		// Data and parameters attrs do not have type in JSON Schema
		// This also applies for an empty properties object. The general pattern is to return an empty object.
		if (builtAttr.type === 'object' && Object.keys(builtAttr).length === 1) {
			delete builtAttr.type;
		}

		jsonAttrs[key] = builtAttr;
	});

	const json: JSONSchema4 = {
		type: 'object',
		properties: jsonAttrs,
		required,
		additionalProperties: false,
	};

	// delete required entry if there are no required fields
	if (required.length === 0) {
		delete json.required;
	}

	return json;
}
