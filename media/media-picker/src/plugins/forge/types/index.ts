import { JsonLd } from 'json-ld-types';
import { PluginActions } from '../../../domain/plugin';
import { SelectedItem } from '../../../popup/domain';

export type ForgeViewType = 'bricks' | 'folder';
export interface ForgeExtension {
  id: string;
  key: string;
  properties: {
    picker: ForgePickerProperties;
    domains: string[];
    typeId: string;
    function: string;
  };
}
export interface ForgePickerProperties {
  name: string;
  view: ForgeViewType;
  iconUrl: string;
}

export interface ForgeInvokeParams {
  query?: string;
  resourceUrl?: string;
  folderId?: string;
}

export interface ForgeInvokePayload {
  key: string;
  search: {
    query: string;
    context?: { id: string };
  };
}
export interface ForgeInvokeError {
  name: string;
  message: string;
  status: number;
}

export interface ForgeViewProps {
  actions: PluginActions;
  selectedItems: SelectedItem[];
  extensionOpts: {
    id: string;
    view: ForgeViewType;
    name: string;
    iconUrl: string;
  };
}

export interface ForgeViewBaseProps {
  selectedItems: SelectedItem[];
  pluginName: string;
}

export interface ForgeProvider {
  key: string;
  metadata: {
    supportedViews: ForgeViewType[];
    avatarUrl: string;
    name: string;
  };
}

export interface ForgeProvidersResponse {
  providers: ForgeProvider[];
}

export interface ServerError {
  message: string;
  name: string;
  status: number;
}

export const JsonLdCollectionEmpty: JsonLd.Collection = {
  meta: {
    visibility: 'other',
    access: 'not_found',
    auth: [],
  },
  data: undefined,
};
