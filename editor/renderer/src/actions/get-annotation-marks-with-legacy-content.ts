import type { MarkType, Node } from '@atlaskit/editor-prosemirror/model';

type JsonObject = Record<string, unknown>;

const isObject = (value: unknown): value is JsonObject =>
	typeof value === 'object' && value !== null;

export const isLegacyContentExtension = (node: Node): boolean =>
	(node.type.name === 'extension' ||
		node.type.name === 'inlineExtension' ||
		node.type.name === 'bodiedExtension') &&
	node.attrs.extensionType === 'com.atlassian.confluence.migration' &&
	node.attrs.extensionKey === 'legacy-content';

const getNestedContent = (node: Node): JsonObject | undefined => {
	const parameters = node.attrs.parameters;
	if (!isObject(parameters)) {
		return undefined;
	}

	const nestedContent = parameters.nestedContent;
	return isObject(nestedContent) &&
		nestedContent.type === 'doc' &&
		Array.isArray(nestedContent.content)
		? nestedContent
		: undefined;
};

/**
 * Finds inline-comment marks stored in migration legacy-content ADF. These marks are not part of
 * the root ProseMirror tree, so create them with the root schema's mark type for renderer consumers.
 */
export const getAnnotationMarksWithLegacyContent = (
	node: Node,
	annotationMarkType: MarkType,
): ReturnType<MarkType['create']>[] => {
	if (!isLegacyContentExtension(node)) {
		return [];
	}

	const nestedContent = getNestedContent(node);
	if (!nestedContent) {
		return [];
	}

	const marks: ReturnType<MarkType['create']>[] = [];
	const visited = new WeakSet<object>();
	const pending: unknown[] = [nestedContent];

	while (pending.length) {
		const value = pending.pop();
		if (!isObject(value) || visited.has(value)) {
			continue;
		}
		visited.add(value);

		if (Array.isArray(value.marks)) {
			for (const mark of value.marks) {
				if (!isObject(mark) || mark.type !== 'annotation' || !isObject(mark.attrs)) {
					continue;
				}

				const { id, annotationType } = mark.attrs;
				if (annotationType === 'inlineComment' && typeof id === 'string' && id.trim().length > 0) {
					marks.push(annotationMarkType.create({ id, annotationType }));
				}
			}
		}

		if (Array.isArray(value.content)) {
			for (let index = value.content.length - 1; index >= 0; index--) {
				pending.push(value.content[index]);
			}
		}

		const attrs = value.attrs;
		if (
			isObject(attrs) &&
			(value.type === 'extension' ||
				value.type === 'inlineExtension' ||
				value.type === 'bodiedExtension') &&
			attrs.extensionType === 'com.atlassian.confluence.migration' &&
			attrs.extensionKey === 'legacy-content'
		) {
			const parameters = attrs.parameters;
			const childNestedContent = isObject(parameters) ? parameters.nestedContent : undefined;
			if (
				isObject(childNestedContent) &&
				childNestedContent.type === 'doc' &&
				Array.isArray(childNestedContent.content)
			) {
				pending.push(childNestedContent);
			}
		}
	}

	return marks;
};
