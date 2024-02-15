import { FunctionComponent } from 'react';

import { AttributeSpec } from '@atlaskit/editor-prosemirror/model';

import { NodeViewProps } from '../util/react-node-view';

export type JQLNodeSpec<Props> = {
  component: FunctionComponent<NodeViewProps<Props>>;
  attrs: { [name: string]: AttributeSpec };
};
