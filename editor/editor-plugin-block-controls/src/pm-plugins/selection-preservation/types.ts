import type { Selection } from '@atlaskit/editor-prosemirror/state';

export type SelectionPreservationPluginState = {
	preservedSelection?: Selection;
};

export type SelectionPreservationMeta = {
	type: 'startPreserving' | 'stopPreserving';
};
