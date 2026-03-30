import type { Node as PMNode, Schema } from '@atlaskit/editor-prosemirror/model';
import { getText } from '../../utils';
import type { NodeReducer } from './';
import { fg } from '@atlaskit/platform-feature-flags';

const status: NodeReducer = (node: PMNode, _schema: Schema) => {
	return node.attrs.text
		? node.attrs.style === 'mixedCase' && fg('platform-dst-lozenge-tag-badge-visual-uplifts')
			? `[ ${node.attrs.text} ]`
			: `[ ${node.attrs.text.toUpperCase()} ]`
		: getText(node);
};

export default status;
