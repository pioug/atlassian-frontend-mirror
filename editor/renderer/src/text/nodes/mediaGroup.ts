import { type Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { type NodeReducer } from './';

const mediaGroup: NodeReducer = (node: PMNode) => {
	// count children which are media files
	// ignore card links
	let childMediaFilesCount = 0;

	node.content.forEach((childNode) => {
		if (childNode.attrs.type === 'file') {
			childMediaFilesCount += 1;
		}
	});

	if (childMediaFilesCount) {
		const postfix = childMediaFilesCount > 1 ? 'Files' : 'File';
		return `📎 ${childMediaFilesCount} ${postfix}`;
	}

	return '';
};

export default mediaGroup;
