import { createSpec, validateAttrs } from '@atlaskit/adf-utils/validator';
import type {
	AttributesSpec,
	CreateSpecReturn,
	ValidationError,
	ValidatorSpec,
	ValidatorSpecAttrs,
} from '@atlaskit/adf-utils/validatorTypes';

export type ExpectationContext = {
	/** Attribute the error points at, when it points at one. */
	attrName?: string;
	code: ValidationError['code'];
	/** Type of the entity the validator rejected: a node type, or a mark type for mark errors. */
	entityType?: string;
	meta?: object;
	/** Type of the node holding the rejected mark. */
	nodeType?: string;
	/** Type of the node holding the rejected entity. */
	parentType?: string;
	target: 'attribute' | 'mark' | 'node' | 'property';
};

let cachedSpecs: CreateSpecReturn | undefined;

const getSpecs = (): CreateSpecReturn => {
	if (!cachedSpecs) {
		cachedSpecs = createSpec();
	}
	return cachedSpecs;
};

const specFor = (type?: string): ValidatorSpec | undefined => {
	if (!type) {
		return undefined;
	}
	const spec = getSpecs()[type];
	return spec && typeof spec === 'object' && 'props' in spec ? (spec as ValidatorSpec) : undefined;
};

const isVariant = (value: unknown): value is [string, ValidatorSpec] =>
	Array.isArray(value) &&
	value.length === 2 &&
	typeof value[0] === 'string' &&
	typeof value[1] === 'object' &&
	value[1] !== null;

/**
 * Content and mark lists mix bare type names with `[name, overrideSpec]` tuples, nested a few
 * levels deep, so flatten them into `[name, overrideSpec?]` pairs.
 */
const flattenEntries = (
	items: unknown,
	out: Array<[string, ValidatorSpec | undefined]> = [],
): Array<[string, ValidatorSpec | undefined]> => {
	if (typeof items === 'string') {
		out.push([items, undefined]);
	} else if (isVariant(items)) {
		out.push([items[0], items[1]]);
	} else if (Array.isArray(items)) {
		for (const item of items) {
			flattenEntries(item, out);
		}
	}
	return out;
};

const unique = (values: string[]) => Array.from(new Set(values));

const attrsAlternatives = (spec?: ValidatorSpec): ValidatorSpecAttrs[] => {
	const attrs = spec?.props?.attrs as ValidatorSpecAttrs | ValidatorSpecAttrs[] | undefined;
	if (!attrs) {
		return [];
	}
	return Array.isArray(attrs) ? attrs : [attrs];
};

const describeAttr = (name: string, spec: AttributesSpec): string => {
	const optional = 'optional' in spec && spec.optional ? ' (optional)' : '';
	if ('props' in spec) {
		return `${name}: object with ${Object.keys(spec.props).join(', ')}${optional}`;
	}
	switch (spec.type) {
		case 'enum':
			return `${name}: one of ${spec.values
				.map((value) => JSON.stringify(value))
				.join(', ')}${optional}`;
		case 'number':
		case 'integer':
			return `${name}: ${spec.type} from ${spec.minimum} to ${spec.maximum}${optional}`;
		case 'boolean':
			return `${name}: true or false${optional}`;
		case 'object':
			return `${name}: object${optional}`;
		case 'array':
			return `${name}: array${spec.minItems !== undefined ? `, min ${spec.minItems}` : ''}${
				spec.maxItems !== undefined ? `, max ${spec.maxItems}` : ''
			}${optional}`;
		case 'string': {
			const constraints = [
				spec.minLength !== undefined ? `min length ${spec.minLength}` : undefined,
				spec.pattern ? `matching ${String(spec.pattern)}` : undefined,
				spec.validatorFn ? `passing ${spec.validatorFn}` : undefined,
			].filter(Boolean);
			return `${name}: string${
				constraints.length ? ` (${constraints.join(', ')})` : ''
			}${optional}`;
		}
		default:
			return `${name}: see schema${optional}`;
	}
};

const describeAcceptedAttr = (spec: ValidatorSpec | undefined, attrName: string): string[] =>
	unique(
		attrsAlternatives(spec)
			.map((alternative) => alternative.props[attrName])
			.filter(Boolean)
			.map((attrSpec) => describeAttr(attrName, attrSpec)),
	);

const describeAcceptedAttrNames = (spec: ValidatorSpec | undefined): string[] => {
	const alternatives = attrsAlternatives(spec);
	if (alternatives.length === 0) {
		return [];
	}
	return alternatives.map((alternative) =>
		Object.entries(alternative.props)
			.map(([name, attrSpec]) => ('optional' in attrSpec && attrSpec.optional ? `${name}?` : name))
			.join(', '),
	);
};

const acceptedChildTypes = (spec?: ValidatorSpec): string[] =>
	unique(flattenEntries(spec?.props?.content?.items).map(([name]) => name));

/**
 * The mark set a spec declares, read the way the validator reads it: `items: ['a']` and
 * `items: [['a', 'b']]` are both one set, and `items: []` means no mark may go on the node.
 */
const markSetOf = (spec?: ValidatorSpec): string[] | undefined => {
	const marks = spec?.props?.marks;
	if (!marks) {
		return undefined;
	}
	const items = marks.items as unknown[];
	if (items.length === 0) {
		return [];
	}
	return (Array.isArray(items[0]) ? items[0] : items) as string[];
};

/**
 * A node's marks must fit ONE of the branches its parent offers for that node type — `paragraph` in
 * `doc` accepts `fontSize + alignment` or `fontSize + indentation`, but never `alignment` together
 * with `indentation`. Reporting the union of the branches would suggest otherwise, so keep them
 * separate.
 */
const acceptedMarkSets = (nodeType?: string, parentType?: string): string[][] => {
	const fromParent = flattenEntries(specFor(parentType)?.props?.content?.items)
		.filter(([name]) => name === nodeType)
		.map(([, override]) => markSetOf(override) ?? markSetOf(specFor(nodeType)) ?? []);
	const sets = fromParent.length > 0 ? fromParent : [markSetOf(specFor(nodeType)) ?? []];

	const seen = new Set<string>();
	return sets.filter((set) => {
		const key = set.join(',');
		if (seen.has(key)) {
			return false;
		}
		seen.add(key);
		return true;
	});
};

/** Props the validator does check the value of itself. */
const VALIDATED_PROPS = new Set(['attrs', 'content', 'marks', 'text', 'type']);

export type PropIssue = {
	expectations: string[];
	prop: string;
};

/**
 * `validateAttrs` rejects every non-string enum value (`isString(value) && values.indexOf(value)`),
 * and `doc.version` is declared as `{ type: 'enum', values: [1] }`, so enums are compared here and
 * everything else is left to the validator's own check.
 */
const matchesSpec = (spec: AttributesSpec, value: unknown): boolean => {
	if (!('props' in spec) && spec.type === 'enum') {
		return (spec.values as unknown[]).includes(value);
	}
	return validateAttrs(spec, value);
};

/**
 * The validator only ever value-checks `attrs` and `text`; every other prop it merely requires to be
 * present. `doc.version` is currently the only spec prop that falls in that gap, so `"version": 2`
 * passes validation even though the spec declares `{ type: 'enum', values: [1] }`. Check those props
 * here with the validator's own `validateAttrs` so the example does not report such a document clean.
 */
export const findPropIssues = (
	nodeType: string | undefined,
	node: Record<string, unknown>,
): PropIssue[] => {
	const props = specFor(nodeType)?.props;
	if (!props) {
		return [];
	}
	const issues: PropIssue[] = [];
	for (const [prop, propSpec] of Object.entries(props)) {
		if (VALIDATED_PROPS.has(prop) || !(prop in node) || node[prop] === undefined) {
			continue;
		}
		const attrSpec = propSpec as AttributesSpec;
		if (!matchesSpec(attrSpec, node[prop])) {
			issues.push({ prop, expectations: [describeAttr(prop, attrSpec)] });
		}
	}
	return issues;
};

/**
 * What the schema would have accepted where this error was raised, as lines for the problems list.
 */
export const describeExpectations = ({
	attrName,
	code,
	entityType,
	meta,
	nodeType,
	parentType,
	target,
}: ExpectationContext): string[] => {
	const entitySpec = specFor(entityType);
	const parentSpec = specFor(parentType);
	const lines: string[] = [];

	if (target === 'attribute' && attrName) {
		const accepted = describeAcceptedAttr(entitySpec, attrName);
		if (accepted.length > 0) {
			lines.push(...accepted);
		} else {
			lines.push(`${entityType ?? 'node'} has no "${attrName}" attribute`);
			for (const names of describeAcceptedAttrNames(entitySpec)) {
				lines.push(`attributes: ${names || 'none'}`);
			}
		}
		return lines;
	}

	if (target === 'mark') {
		const markSpec = specFor(entityType);
		const markSets = acceptedMarkSets(nodeType, parentType);
		if (code === 'INVALID_ATTRIBUTES' || code === 'REDUNDANT_ATTRIBUTES') {
			for (const alternative of attrsAlternatives(markSpec)) {
				for (const [name, attrSpec] of Object.entries(alternative.props)) {
					lines.push(describeAttr(name, attrSpec));
				}
			}
			if (lines.length === 0) {
				lines.push(`${entityType} accepts no attributes`);
			}
			return unique(lines);
		}
		const usableSets = markSets.filter((set) => set.length > 0);
		lines.push(
			usableSets.length === 0
				? `${nodeType ?? 'node'} accepts no marks in this position`
				: `${nodeType ?? 'node'} accepts one of these mark sets in this position: ${usableSets
						.map((set) => set.join(' + '))
						.join(' | ')}`,
		);
		if (!markSpec) {
			lines.push(`"${entityType}" is not a known mark type`);
		}
		return lines;
	}

	switch (code) {
		case 'INVALID_CONTENT':
		case 'INVALID_TYPE': {
			if (entityType && !entitySpec) {
				lines.push(`"${entityType}" is not a known node type`);
			}
			const accepted = acceptedChildTypes(parentSpec);
			if (accepted.length > 0) {
				lines.push(`${parentType} accepts: ${accepted.join(', ')}`);
			}
			break;
		}
		case 'INVALID_CONTENT_LENGTH': {
			const length = meta as { requiredLength?: number; type?: string } | undefined;
			if (length?.requiredLength !== undefined) {
				lines.push(
					`${entityType} accepts a ${length.type ?? ''} of ${
						length.requiredLength
					} child node(s)`.replace('  ', ' '),
				);
			}
			const accepted = acceptedChildTypes(entitySpec);
			if (accepted.length > 0) {
				lines.push(`children can be: ${accepted.join(', ')}`);
			}
			break;
		}
		case 'MISSING_PROPERTIES': {
			const missing = (meta as { props?: string[] } | undefined)?.props;
			const required = entitySpec?.required ?? [];
			if (required.length > 0) {
				lines.push(`${entityType} requires: ${required.join(', ')}`);
			}
			if (!missing || missing.includes('attrs')) {
				for (const names of describeAcceptedAttrNames(entitySpec)) {
					lines.push(`attrs: ${names || 'no attributes'}`);
				}
			}
			if (missing?.includes('content')) {
				const accepted = acceptedChildTypes(entitySpec);
				if (accepted.length > 0) {
					lines.push(`content can be: ${accepted.join(', ')}`);
				}
			}
			if (missing?.includes('text')) {
				lines.push('text: string with min length 1');
			}
			break;
		}
		case 'REDUNDANT_PROPERTIES': {
			const props = entitySpec?.props ? Object.keys(entitySpec.props) : [];
			if (props.length > 0) {
				lines.push(`${entityType} accepts props: ${props.join(', ')}`);
			}
			break;
		}
		case 'INVALID_TEXT':
			lines.push('text: string with min length 1');
			break;
		default:
			break;
	}

	return lines;
};
