import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { Selection } from '@atlaskit/editor-prosemirror/state';

export type SelectionPreservationPluginState = {
	preservedSelection?: Selection;
	syncDomSelectionForDoc?: PMNode;
};

export type SelectionPreservationMeta = {
	type: 'startPreserving' | 'stopPreserving';
};
