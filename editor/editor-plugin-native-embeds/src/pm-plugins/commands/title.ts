import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { ContentNodeWithPos } from '@atlaskit/editor-prosemirror/utils';
import { updateParameters } from '@atlaskit/native-embeds-common';

import type { EditorPluginNativeEmbedsPlugin } from '../../nativeEmbedsPluginType';

/**
 * Creates a plain function that toggles the `alwaysShowTitle` parameter on the
 * selected native embed extension node.
 */
export const createToggleAlwaysShowTitle =
	(
		api: ExtractInjectionAPI<EditorPluginNativeEmbedsPlugin> | undefined,
		selectedNativeEmbed: ContentNodeWithPos,
	) =>
	() => {
		const localId = selectedNativeEmbed.node.attrs.localId;
		if (!localId) {
			return;
		}

		const extensionApi = api?.extension?.actions?.api();
		if (!extensionApi?.doc?.update) {
			return;
		}

		const current =
			(selectedNativeEmbed.node.attrs.parameters?.alwaysShowTitle as boolean) ?? false;

		extensionApi.doc.update(localId, (node) =>
			updateParameters(node, { alwaysShowTitle: !current }),
		);
	};

export const getAlwaysShowTitleState = (selectedNativeEmbed: ContentNodeWithPos) => {
	return (selectedNativeEmbed.node.attrs.parameters?.alwaysShowTitle as boolean) ?? false;
};
