import type { MarkSpec } from '@atlaskit/editor-prosemirror/model';
import { unsupportedNodeAttribute as unsupportedNodeAttributeFactory } from '../../next-schema/generated/markTypes';

export const unsupportedNodeAttribute: MarkSpec = unsupportedNodeAttributeFactory({
	toDOM() {
		return ['span'];
	},
});
