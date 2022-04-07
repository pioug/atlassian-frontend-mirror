export interface PluginFile {
  id: string;
  metadata: any;
}
export interface PluginItemPayload {
  pluginName: string;
  pluginFile: PluginFile;
}
