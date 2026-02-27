import type { Command, ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { ContentNodeWithPos } from '@atlaskit/editor-prosemirror/utils';
import type { AlignmentValue } from '@atlaskit/native-embeds-common';
import { updateParameters } from '@atlaskit/native-embeds-common';

import type { EditorPluginNativeEmbedsPlugin } from '../../nativeEmbedsPluginType';

export const createUpdateAlignmentCommand =
	(
		api: ExtractInjectionAPI<EditorPluginNativeEmbedsPlugin> | undefined,
		alignment: AlignmentValue,
		selectedNativeEmbed: ContentNodeWithPos,
	): Command =>
	() => {
		const localId = selectedNativeEmbed.node.attrs.localId;
		if (!localId) {
			return false;
		}

		const extensionApi = api?.extension?.actions?.api();
		if (!extensionApi?.doc?.update) {
			return false;
		}

		extensionApi.doc.update(localId, (current) => updateParameters(current, { alignment }));

		return true;
	};
