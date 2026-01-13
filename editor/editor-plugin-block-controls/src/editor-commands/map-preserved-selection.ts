import type { EditorCommand } from '@atlaskit/editor-common/types';
import type { Mapping } from '@atlaskit/editor-prosemirror/transform';

import { key } from '../pm-plugins/main';

/**
 * Applies metadata to the transaction which can be used to apply custom mapping
 * to the preserved selection.
 *
 * This can be used when nodes are transformed/moved in a way that natural mapping
 * would not correctly update the preserved selection.
 *
 * @param preservedSelectionMapping The mapping to apply to the preserved selection.
 * @returns An editor command that sets the preserved selection mapping in the transaction metadata.
 */
export const mapPreservedSelection =
	(mapping: Mapping): EditorCommand =>
	({ tr }) => {
		const currMeta = tr.getMeta(key);
		return tr.setMeta(key, { ...currMeta, preservedSelectionMapping: mapping });
	};
