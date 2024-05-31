import type { EditorCommand, ToolbarUIComponentFactory } from '@atlaskit/editor-common/types';

import { PrimaryToolbarPluginAction, primaryToolbarPluginKey } from './pm-plugin';
import type { ToolbarElementNames } from './types';

export const registerComponent =
	({
		name,
		component,
	}: {
		name: ToolbarElementNames;
		component: ToolbarUIComponentFactory;
	}): EditorCommand =>
	({ tr }) => {
		tr.setMeta(primaryToolbarPluginKey, {
			type: PrimaryToolbarPluginAction.REGISTER,
			name,
			component,
		});
		return tr;
	};
