import type { Command, ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import {
	getParameters,
	setParameter,
	type AlignmentValue,
	type NativeEmbedParameters,
} from '@atlaskit/native-embeds-common';

import type { EditorPluginNativeEmbedsPlugin } from '../../nativeEmbedsPluginType';

export const getAlignment = (selectedNode: PMNode): AlignmentValue => {
	return getParameters(selectedNode.attrs.parameters, 'alignment');
};

export const createUpdateAlignmentCommand =
	(
		api: ExtractInjectionAPI<EditorPluginNativeEmbedsPlugin> | undefined,
		alignment: AlignmentValue,
		selectedNode: PMNode,
	): Command =>
	() => {
		api?.extension?.actions?.api()?.doc?.update(selectedNode.attrs.localId, (current) => ({
			attrs: {
				...current.attrs,
				parameters: setParameter(current.attrs?.parameters as NativeEmbedParameters | undefined, {
					alignment,
				}),
			},
		}));

		return true;
	};
