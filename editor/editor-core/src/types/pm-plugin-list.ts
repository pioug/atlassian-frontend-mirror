import type { EditorConfig } from './editor-config';
import type { PMPluginFactoryParams } from './pm-plugin';

export type PMPluginCreateConfig = PMPluginFactoryParams & {
	editorConfig: EditorConfig;
};
