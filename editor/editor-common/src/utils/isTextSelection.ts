import type { Selection } from '@atlaskit/editor-prosemirror/state';
import { TextSelection } from '@atlaskit/editor-prosemirror/state';

export const isTextSelection = (selection: Selection): selection is TextSelection =>
	selection instanceof TextSelection;
