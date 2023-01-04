import { createCommand } from '../pm-plugins/plugin-factory';
import { Node as PMNode } from 'prosemirror-model';
import { removeConnectedNodes } from '@atlaskit/editor-common/utils';

export const removeDescendantNodes = (sourceNode: PMNode) =>
  createCommand(
    {
      type: 'UPDATE_STATE',
      data: { element: undefined },
    },
    (tr, state) => {
      return sourceNode ? removeConnectedNodes(state, sourceNode) : tr;
    },
  );
