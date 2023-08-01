import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { MediaEditorState } from '../types';

export const pluginKey = new PluginKey<MediaEditorState>('mediaEditorPlugin');
