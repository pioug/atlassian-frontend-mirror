import React from 'react';

/**
 * Allocation-free equivalent of `React.Children.toArray(children).length > 0`.
 *
 * Mirrors `toArray` semantics: `null`, `undefined` and booleans are dropped; arrays are flattened;
 * everything else (strings including `''`, numbers, elements, fragments, portals) counts as a child.
 */
export function hasRenderableChild(children: React.ReactNode): boolean {
	if (children == null || typeof children === 'boolean') {
		return false;
	}

	if (Array.isArray(children)) {
		for (const child of children) {
			if (hasRenderableChild(child)) {
				return true;
			}
		}
		return false;
	}

	return true;
}

/**
 * Renders inline content, substituting a non-breaking space when there is nothing to render so
 * an empty paragraph keeps its height.
 *
 * `plainTextFastPath` is threaded down from `ReactSerializer`, which evaluates the experiment
 * once per instance. This component renders once per paragraph, so it must not evaluate the
 * experiment itself. When the prop is absent the original behaviour is used.
 */
// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Inline(props: any): any {
	const { children, plainTextFastPath } = props;
	const isEmpty = plainTextFastPath
		? !hasRenderableChild(children)
		: React.Children.toArray(children).length === 0;

	if (isEmpty) {
		return <>&nbsp;</>;
	}

	return children;
}
