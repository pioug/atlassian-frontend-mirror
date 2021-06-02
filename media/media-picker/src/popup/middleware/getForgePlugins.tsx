import React from 'react';
import { Action, Dispatch, Store } from 'redux';
import { State } from '../domain';
import { getForgePluginsFullfilled, getForgePluginsFailed } from '../actions';
import { isGetForgePluginsAction } from '../actions/getForgePlugins';
import { MediaPickerPlugin } from '../../domain/plugin';
import {
  ForgeView,
  ForgeIcon,
  ForgeClient,
  ForgeProvider,
} from '../../plugins/forge';

export const getForgePlugins = () => (store: Store<State>) => (
  next: Dispatch<Action>,
) => (action: Action) => {
  if (isGetForgePluginsAction(action)) {
    requestForgePlugins(store);
  }

  return next(action);
};

export const requestForgePlugins = async (store: Store<State>) => {
  const client = new ForgeClient();
  const { dispatch } = store;
  try {
    const { providers } = await client.getProviders();
    const availableProviders = providers.filter(
      (provider) => !!provider.metadata.supportedViews.length,
    );
    const pluginsForMediaPicker = availableProviders
      .map(transformForgeProviderToPlugin)
      .sort((b, a) => b.name.localeCompare(a.name));
    dispatch(getForgePluginsFullfilled(pluginsForMediaPicker));
  } catch (e) {
    dispatch(getForgePluginsFailed());
  }
};

export const transformForgeProviderToPlugin = (
  provider: ForgeProvider,
): MediaPickerPlugin => ({
  name: provider.metadata.name,
  icon: <ForgeIcon iconUrl={provider.metadata.avatarUrl} />,
  render: (actions, selectedItems) => {
    return (
      <ForgeView
        key={provider.key}
        actions={actions}
        selectedItems={selectedItems}
        extensionOpts={{
          id: provider.key,
          name: provider.metadata.name,
          view: provider.metadata.supportedViews[0],
          iconUrl: provider.metadata.avatarUrl,
        }}
      />
    );
  },
});
