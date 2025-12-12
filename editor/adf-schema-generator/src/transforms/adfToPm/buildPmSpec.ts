import type { MarkSpec, NodeSpec } from '@atlaskit/editor-prosemirror/model';
import merge from 'lodash/merge';
import { ADFMark } from '../../adfMark';
import type { ADFMarkSpec } from '../../types/ADFMarkSpec';
import { MarkExcludesAll, MarkExcludesNone } from '../../types/ADFMarkSpec';
import type { ADFAttributes } from '../../types/ADFAttribute';
import type { ContentVisitorReturnType } from './types';
import { buildContentExpression } from './buildContentExpression';
import type { ADFNodeSpec } from '../../types/ADFNodeSpec';

// @DSLCompatibilityException
const excludesLinkMarksNodes = ['doc', 'layoutColumn'];

// @DSLCompatibilityException
const excludesIndentationNodes = ['tableHeader', 'tableCell'];

// @DSLCompatibilityException
const NODES_MARKS_OVERRIDES = {
	bodiedExtension: ['dataConsumer', 'fragment', 'unsupportedMark', 'unsupportedNodeAttribute'],
	codeBlock: ['unsupportedMark', 'unsupportedNodeAttribute'],
	extensionFrame: ['dataConsumer', 'fragment', 'unsupportedMark', 'unsupportedNodeAttribute'],
	multiBodiedExtension: ['unsupportedNodeAttribute', 'unsupportedMark'],
};

export const buildAttrs = (attrs?: ADFAttributes): NodeSpec['attrs'] | MarkSpec['attrs'] => {
	let attributes = attrs;
	if (!attrs) {
		// @ts-expect-error
		return null;
	}
	if (attrs['anyOf']) {
		attributes = merge({}, ...(attrs['anyOf'] as ADFAttributes[]));
	}
	// @ts-expect-error
	return Object.entries(attributes).reduce((acc: Record<string, object>, [key, value]) => {
		if (value.default === undefined && value.optional) {
			return acc;
		}
		return {
			...acc,
			[key]: {
				...acc[key],
				...('default' in value && {
					default: value.default,
				}),
			},
		};
	}, {});
};

export const buildMarkExcludes = (mark: ADFMark<ADFMarkSpec>): string => {
	const originalMarkExcludes = mark.getSpec().excludes;
	if (originalMarkExcludes === undefined) {
		return undefined as unknown as string;
	}
	if (originalMarkExcludes === MarkExcludesAll || originalMarkExcludes === MarkExcludesNone) {
		return originalMarkExcludes;
	}
	return originalMarkExcludes
		.filter((markOrGroup) => {
			if (markOrGroup) {
				return true;
			}
			// eslint-disable-next-line no-console
			console.warn(
				'Excludes markOrGroup is undefined for',
				`"${mark.getType()}".`,
				'Likely caused by a circular dependency.',
			);
			return false;
		})
		.map((markOrGroup) => {
			if (markOrGroup instanceof ADFMark) {
				return markOrGroup.getType();
			} else {
				return markOrGroup.group;
			}
		})
		.join(' ');
};

const filterMarks = (nodeType: string) => (mark: string) => {
	if (mark === 'link') {
		return !excludesLinkMarksNodes.includes(nodeType);
	}
	if (mark === 'indentation') {
		return !excludesIndentationNodes.includes(nodeType);
	}
	return true;
};

export const buildMarkSpec = (mark: ADFMark<ADFMarkSpec>): MarkSpec => {
	const pmMarkSpec: MarkSpec = {};

	pmMarkSpec.attrs = buildAttrs(mark.getSpec().attrs);
	pmMarkSpec.inclusive = mark.getSpec().inclusive;
	pmMarkSpec.excludes = buildMarkExcludes(mark);
	pmMarkSpec.group = mark.getGroup() as MarkSpec['group'];
	pmMarkSpec.spanning = mark.getSpec().spanning;

	return Object.entries(pmMarkSpec).reduce<Record<string, unknown>>((acc, [key, value]) => {
		if (value !== undefined && value !== null) {
			acc[key] = value;
		}
		return acc;
	}, {});
};

export const buildNodeSpec = (
	nodeType: string,
	nodeSpec: ADFNodeSpec,
	nodeGroups: Array<string>,
	content: Array<ContentVisitorReturnType>,
): NodeSpec => {
	const pmNodeSpec: NodeSpec = {};
	let marks: string[] = [];
	const contents = [];
	for (const child of content) {
		contents.push(buildContentExpression(child.expr));
		marks.push(...child.marks);
	}

	if (nodeType in NODES_MARKS_OVERRIDES) {
		marks = NODES_MARKS_OVERRIDES[nodeType as keyof typeof NODES_MARKS_OVERRIDES];
	} else if (nodeSpec.allowAnyChildMark) {
		marks = ['_'];
	} else if (nodeSpec.allowNoChildMark) {
		marks = [''];
	} else {
		marks = Array(...new Set(marks)).filter(filterMarks(nodeType));
	}

	if (content.length) {
		pmNodeSpec.content = Array(...new Set(contents)).join(' ');
	}

	if (marks.length) {
		pmNodeSpec.marks = marks.join(' ');
	}

	if (nodeGroups.length > 0) {
		pmNodeSpec.group = nodeGroups.join(' ');
	}

	pmNodeSpec.inline = nodeSpec.inline;
	pmNodeSpec.atom = nodeSpec.atom;
	pmNodeSpec.attrs = buildAttrs(nodeSpec.attrs);
	pmNodeSpec.selectable = nodeSpec.selectable;
	pmNodeSpec.draggable = nodeSpec.draggable;
	pmNodeSpec.code = nodeSpec.code;
	pmNodeSpec.whitespace = nodeSpec.whitespace;
	pmNodeSpec.definingAsContext = nodeSpec.definingAsContext;
	pmNodeSpec.definingForContent = nodeSpec.definingForContent;
	pmNodeSpec.defining = nodeSpec.defining;
	pmNodeSpec.isolating = nodeSpec.isolating;
	pmNodeSpec.tableRole = nodeSpec.tableRole;
	pmNodeSpec.linebreakReplacement = nodeSpec.linebreakReplacement;

	const overrides = nodeSpec.DANGEROUS_MANUAL_OVERRIDE?.['pm-spec'] || {};
	for (const [key, override] of Object.entries(overrides)) {
		pmNodeSpec[key] = override.value;
	}

	return Object.entries(pmNodeSpec).reduce<Record<string, unknown>>((acc, [key, value]) => {
		if (value !== undefined && value !== null) {
			acc[key] = value;
		}
		return acc;
	}, {});
};
