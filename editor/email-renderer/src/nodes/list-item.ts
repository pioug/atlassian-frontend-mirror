import { createTag } from '../create-tag';
import { createClassName } from '../styles/util';
import type { NodeSerializerOpts } from '../interfaces';

const listTypes = new Set(['bulletList', 'orderedList', 'taskList']);

const wrapperClassName = createClassName('li-wrapper');

export const styles: string = `
.${createClassName('li')} {
  margin-top: 4px;
}
.${createClassName('li')} > p {
  margin-bottom: 0px;
  padding-top: 0px;
}
.${wrapperClassName} {
  list-style-type: none;
}
`;

export default function listItem({ text, node }: NodeSerializerOpts): string {
	let isWrapperItem = node.childCount > 0;
	for (let i = 0; i < node.childCount; i++) {
		if (!listTypes.has(node.child(i).type.name)) {
			isWrapperItem = false;
			break;
		}
	}

	const attrs: { class: string; style?: string } = {
		class: createClassName('li'),
	};

	if (isWrapperItem) {
		attrs.class += ` ${wrapperClassName}`;
		attrs.style = 'list-style-type: none;';
	}

	return createTag('li', attrs, text);
}
