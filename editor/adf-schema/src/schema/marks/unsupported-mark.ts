import type { MarkSpec } from '@atlaskit/editor-prosemirror/model';
import { unsupportedMark as unsupportedMarkFactory } from '../../next-schema/generated/markTypes';

export const unsupportedMark: MarkSpec = unsupportedMarkFactory({
	toDOM() {
		return ['span'];
	},
});
