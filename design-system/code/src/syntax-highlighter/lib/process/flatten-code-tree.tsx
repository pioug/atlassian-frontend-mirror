import { fg } from '@atlaskit/platform-feature-flags';

import { type RefractorNode } from '../../types';

import createLineElement from './create-line-element';

export default function flattenCodeTree(
	tree: RefractorNode[],
	offset: number = 0,
	className: string[] = [],
): RefractorNode[] {
	let newTree: RefractorNode[] = [];

	for (let i = 0; i < tree.length; i++) {
		const node = tree[i];
		if (node.type === 'text') {
			newTree.push(
				createLineElement({
					children: [node],
					lineNumber: offset,
					className,
				}),
			);
		} else if (node.children) {
			// If this node is a re-highlighted fenced code-block wrapper (added by
			// rehighlightFencedBlocks in get-code-tree.tsx), reset the accumulated
			// class list instead of concatenating onto ancestors.  Without this,
			// every token inside the fenced block inherits all ancestor classes
			// (e.g. "token code token code-block language-jsx token plain-text").
			const nodeClasses: string[] = node.properties.className || [];
			const isCodeBlock =
				fg('platform-code-highlight-markdown-safe') && nodeClasses.includes('code-block');
			// When entering a re-highlighted fenced code-block wrapper, reset the
			// accumulated ancestor classes to empty so children only carry their
			// own token classes (not the full ancestor chain).
			const classNames = isCodeBlock ? [] : className.concat(nodeClasses);
			flattenCodeTree(node.children, offset + 1, classNames).forEach((i) => newTree.push(i));
		}
	}
	return newTree;
}
