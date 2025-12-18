/* eslint-disable @atlaskit/editor/no-re-export */
// Entry file in package.json

export { connectivityPlugin } from './connectivityPlugin';
export type {
	ConnectivityPlugin,
	Mode,
	PluginState,
	PublicPluginState,
} from './connectivityPluginType';
// eslint-disable-next-line @atlaskit/editor/only-export-plugin
export { isOfflineMode } from './connectivityPluginType';
