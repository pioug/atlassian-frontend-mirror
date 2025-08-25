import { type FunctionComponent } from 'react';

import { type AttributeSpec } from '@atlaskit/editor-prosemirror/model';

import { type NodeViewProps } from '../util/react-node-view';

export type JQLNodeSpec<Props> = {
	attrs: { [name: string]: AttributeSpec };
	component: FunctionComponent<NodeViewProps<Props>>;
};
