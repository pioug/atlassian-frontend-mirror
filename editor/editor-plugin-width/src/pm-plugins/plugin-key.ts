import type { EditorContainerWidth as WidthPluginState } from '@atlaskit/editor-common/types/editor-container-width';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';

export const pluginKey: PluginKey<WidthPluginState> = new PluginKey<WidthPluginState>(
	'widthPlugin',
);
