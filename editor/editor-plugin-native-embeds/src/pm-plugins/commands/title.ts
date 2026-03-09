import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import {
	getParameters,
	setParameter,
	type NativeEmbedParameters,
} from '@atlaskit/native-embeds-common';

import type { EditorPluginNativeEmbedsPlugin } from '../../nativeEmbedsPluginType';

export const getAlwaysShowTitleState = (selectedNode: PMNode): boolean => {
	return getParameters(
		selectedNode.attrs.parameters as NativeEmbedParameters | undefined,
		'alwaysShowTitle',
	);
};

/**
 * Creates a plain function that toggles the `alwaysShowTitle` parameter on the
 * selected native embed extension node.
 */
export const createToggleAlwaysShowTitle =
	(api: ExtractInjectionAPI<EditorPluginNativeEmbedsPlugin> | undefined, selectedNode: PMNode) =>
	() => {
		const localId = selectedNode.attrs.localId;
		if (!localId) {
			return;
		}

		const extensionApi = api?.extension?.actions?.api();
		if (!extensionApi?.doc?.update) {
			return;
		}

		const current = getAlwaysShowTitleState(selectedNode);
		extensionApi.doc.update(localId, (node) => ({
			attrs: {
				...node.attrs,
				parameters: setParameter(node.attrs?.parameters as NativeEmbedParameters | undefined, {
					alwaysShowTitle: !current,
				}),
			},
		}));
	};
