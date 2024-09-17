import type { EditorContainerWidth as WidthPluginState } from '@atlaskit/editor-common/types';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';

export const pluginKey = new PluginKey<WidthPluginState>('widthPlugin');
