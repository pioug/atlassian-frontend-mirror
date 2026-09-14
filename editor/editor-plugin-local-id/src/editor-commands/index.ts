import type { EditorCommand } from '@atlaskit/editor-common/types';

import type { AddMissingLocalIdsOptions } from '../localIdPluginType';
import { addMissingLocalIdsToDocument } from '../pm-plugins/add-missing-local-ids';

/**
 * Scans the current document and adds missing local IDs.
 */
export const addMissingLocalIds =
	(options: AddMissingLocalIdsOptions = {}): EditorCommand =>
	({ tr }) => {
		if (!addMissingLocalIdsToDocument(tr, options)) {
			return null;
		}

		return tr;
	};
