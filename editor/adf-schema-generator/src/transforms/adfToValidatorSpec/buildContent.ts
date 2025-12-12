import type { ADFNode } from '../../adfNode';
import type { ContentVisitorReturnType } from './adfToValidatorSpec';
import type { ValidatorSpecContent } from './ValidatorSpec';

export function buildContent(
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	node: ADFNode<any>,
	content: Array<ContentVisitorReturnType>,
): ValidatorSpecContent {
	const isTupleLike = content.length > 1;

	if (isTupleLike) {
		return buildTupleLikeContent(node, content);
	}

	return buildRegularContent(content[0]);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildTupleLikeContent(node: ADFNode<any>, content: Array<ContentVisitorReturnType>) {
	const nodeSpec = node.getSpec();
	const hasUnsupportedInline = content.some((item) => item.hasUnsupportedInline);
	const hasUnsupportedBlock = content.some((item) => item.hasUnsupportedBlock);
	const returnContent: ValidatorSpecContent = {
		type: 'array',
		isTupleLike: true,
	};

	const items = [];
	for (const child of content) {
		items.push(buildItems(child.contentTypes));
	}
	returnContent.items = items;

	if ('contentMinItems' in nodeSpec) {
		returnContent.minItems = nodeSpec.contentMinItems;
	}

	if ('contentMaxItems' in nodeSpec) {
		returnContent.maxItems = nodeSpec.contentMaxItems;
	}

	if (hasUnsupportedInline) {
		returnContent.allowUnsupportedInline = true;
	}

	if (hasUnsupportedBlock) {
		returnContent.allowUnsupportedBlock = true;
	}

	return returnContent;
}

function buildRegularContent(content: ContentVisitorReturnType) {
	const returnContent: ValidatorSpecContent = { type: 'array' };

	returnContent.items = [buildItems(content.contentTypes)];

	if (content?.minItems) {
		returnContent.minItems = content?.minItems;
	}

	if (content?.maxItems) {
		returnContent.maxItems = content?.maxItems;
	}

	if (content?.optional) {
		returnContent.optional = content?.optional;
	}

	if (content.hasUnsupportedInline) {
		returnContent.allowUnsupportedInline = true;
	}

	if (content.hasUnsupportedBlock) {
		returnContent.allowUnsupportedBlock = true;
	}

	return returnContent;
}

/**
 * If contentTypes only has one item it will be a single array [],
 * however if it has more than one item it will be an array within an array [[]].
 */
function buildItems(contentTypes: Array<string>) {
	if (contentTypes.length === 1) {
		return contentTypes[0];
	} else {
		return contentTypes;
	}
}
