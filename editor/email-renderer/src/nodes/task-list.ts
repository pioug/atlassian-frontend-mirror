import { type NodeSerializerOpts } from '../interfaces';
import { createTag } from '../create-tag';
import { createClassName } from '../styles/util';

const className = createClassName('taskList');
const nestedClassName = createClassName('nestedTaskList');

export const styles: string = `
.${className} {
  margin-top: 12px;
}

.${nestedClassName} {
  margin-top: 0px;
  margin-left: 48px;
}
`;

export default function taskList({ text, parent }: NodeSerializerOpts): string {
	// Apply nested styling when parent is a taskList (direct nesting).
	// When parent is a listItem, the list item already provides indentation,
	// so we don't apply the nested class to avoid double-indentation.
	const isNested = parent && parent.type.name === 'taskList';

	return createTag(
		'div',
		{
			class: [className, isNested && nestedClassName].filter(Boolean).join(' '),
		},
		text,
	);
}
