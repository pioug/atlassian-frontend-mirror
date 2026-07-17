import {
	getFragmentsFromSelection,
	getLocalIdsFromSelection,
} from '@atlaskit/editor-common/selection';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { JSONNode } from '@atlaskit/editor-json-transformer';
import type { Selection } from '@atlaskit/editor-prosemirror/state';

import type { SelectionPlugin } from '../selectionPluginType';

export const getSelectionFragment =
	(api: ExtractInjectionAPI<SelectionPlugin> | undefined) =>
	(props?: { selection?: Selection }): JSONNode[] | null => {
		const selection = props?.selection ?? api?.selection.sharedState?.currentState()?.selection;
		return getFragmentsFromSelection(selection);
	};

export const getSelectionLocalIds =
	(api?: ExtractInjectionAPI<SelectionPlugin>) =>
	(props?: { selection?: Selection }): string[] | null => {
		let selection = props?.selection ?? api?.selection.sharedState?.currentState()?.selection;
		if (selection?.empty) {
			// If we have an empty selection the current state might not be correct
			// We have a hack here to retrieve the current selection - but not dispatch a transaction
			api?.core.actions.execute(({ tr }) => {
				selection = tr.selection;
				return null;
			});
		}

		return getLocalIdsFromSelection(selection);
	};
