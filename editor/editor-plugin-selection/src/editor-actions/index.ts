import { type ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { nodeToJSON, type JSONNode } from '@atlaskit/editor-json-transformer';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';

import type { SelectionPlugin } from '../selectionPluginType';

export const getSelectionFragment =
	(api: ExtractInjectionAPI<SelectionPlugin> | undefined) => () => {
		const selection = api?.selection.sharedState?.currentState()?.selection;
		const schema = api?.core.sharedState.currentState()?.schema;
		if (!selection || !schema || selection.empty) {
			return null;
		}

		const content = selection?.content().content;
		const fragment: JSONNode[] = [];
		content.forEach((node) => {
			fragment.push(nodeToJSON(node));
		});
		return fragment;
	};

export const getSelectionLocalIds =
	(api: ExtractInjectionAPI<SelectionPlugin> | undefined) => () => {
		let selection = api?.selection.sharedState?.currentState()?.selection;
		if (selection?.empty) {
			// If we have an empty selection the current state might not be correct
			// We have a hack here to retrieve the current selection - but not dispatch a transaction
			api?.core.actions.execute(({ tr }) => {
				selection = tr.selection;
				return null;
			});
		}

		if (!selection) {
			return null;
		}

		if (selection instanceof NodeSelection) {
			return [selection.node.attrs.localId];
		} else if (selection.empty) {
			return [selection.$from.parent.attrs.localId];
		}
		const content = selection.content().content;
		const ids: string[] = [];
		content.forEach((node) => {
			const localId = node.attrs?.localId;
			if (localId) {
				ids.push(localId);
			}
		});
		return ids;
	};
