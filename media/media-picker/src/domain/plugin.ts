import { ReactNode } from 'react';
import { ServiceFile, SelectedItem } from '../popup/domain';

export interface PluginFile {
  id: string;
  metadata: any;
}

export interface SelectedPluginFile extends ServiceFile {
  pluginFile: Object;
}

export interface PluginActions {
  fileClick: (pluginFile: PluginFile, pluginName: string) => void;
}

export interface MediaPickerPlugin {
  name: string;
  icon: ReactNode;
  render: (actions: PluginActions, selectedItems: SelectedItem[]) => ReactNode;
}

export interface PluginItemPayload {
  pluginName: string;
  pluginFile: PluginFile;
}
