import { type default as core, type Node } from 'jscodeshift';
import { type Collection } from 'jscodeshift/src/Collection';

// not replacing newlines (which \s does)
const spacesAndTabs: RegExp = /[ \t]{2,}/g;
const lineStartWithSpaces: RegExp = /^[ \t]*/gm;

function clean(value: string): string {
	return (
		value
			.replace(spacesAndTabs, ' ')
			.replace(lineStartWithSpaces, '')
			// using .trim() to clear the any newlines before the first text and after last text
			.trim()
	);
}

export function addCommentBefore({
	j,
	target,
	message,
}: {
	j: core.JSCodeshift;
	target: Collection<Node>;
	message: string;
}): void {
	const content: string = ` TODO: (from codemod) ${clean(message)} `;
	target.forEach((path) => {
		path.value.comments = path.value.comments || [];

		const exists = path.value.comments.find((comment) => comment.value === content);

		// avoiding duplicates of the same comment
		if (exists) {
			return;
		}

		path.value.comments.push(j.commentBlock(content));
	});
}
