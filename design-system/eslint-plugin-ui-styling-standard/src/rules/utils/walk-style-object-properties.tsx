import type * as ESTree from 'eslint-codemod-utils';

/**
 * Walk one style object's properties at every depth. With `skipTopLevel` the top-level
 * properties are walked into but not visited, which is how a `cssMap` or `keyframes` argument
 * hides its variant or block names. Nested objects are always visited in full. Use this directly
 * for a style object that is not the argument of a style call, such as the value of a `css` prop.
 *
 * `skipSubtree` stops the descent into a property's value, so its children are never visited.
 * A caller needs this when a nested block's keys are not the same kind of thing as its own key:
 * the children of an `@keyframes` block are offsets (`from`, `50%`), not selectors, and a rule
 * that treats them as selectors will report — or worse, fix — a keyframe offset. Declining to
 * visit the at-rule property itself is not enough, because the walk into its value is what
 * exposes the offsets. Omit it and the walk behaves exactly as before.
 */
export function walkStyleObjectProperties(
	object: ESTree.ObjectExpression,
	visitor: (property: ESTree.Property) => void,
	options?: { skipTopLevel?: boolean; skipSubtree?: (property: ESTree.Property) => boolean },
): void {
	walk(object, visitor, Boolean(options?.skipTopLevel), options?.skipSubtree);
}

function walk(
	object: ESTree.ObjectExpression,
	visitor: (property: ESTree.Property) => void,
	skipVisitor: boolean,
	skipSubtree: ((property: ESTree.Property) => boolean) | undefined,
): void {
	for (const property of object.properties) {
		if (property.type !== 'Property') {
			continue;
		}

		if (!skipVisitor) {
			visitor(property);
		}

		if (property.value.type === 'ObjectExpression' && !skipSubtree?.(property)) {
			walk(property.value, visitor, false, skipSubtree);
		}
	}
}
