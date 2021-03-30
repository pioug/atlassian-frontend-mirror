import React from 'react';
import { EditorView } from 'prosemirror-view';
import { ProviderFactory, WithProviders } from '@atlaskit/editor-common';

import HyperlinkAddToolbarComp from './HyperlinkAddToolbar';
import { LinkInputType } from '../../types';
import { stateKey as pluginKey } from '../../pm-plugins/main';
import WithPluginState from '../../../../ui/WithPluginState';

export interface Props {
  view: EditorView;
  providerFactory: ProviderFactory;
  onSubmit: (
    href: string,
    title: string | undefined,
    displayText: string | undefined,
    inputMethod: LinkInputType,
  ) => void;
  displayText: string;
  displayUrl?: string;
}

export default class HyperlinkAddToolbar extends React.PureComponent<
  Props,
  {}
> {
  render() {
    const {
      onSubmit,
      displayText,
      displayUrl,
      providerFactory,
      view,
    } = this.props;
    return (
      <WithProviders
        providers={['activityProvider', 'searchProvider']}
        providerFactory={providerFactory}
        renderNode={({ activityProvider, searchProvider }) => (
          <WithPluginState
            editorView={view}
            plugins={{
              hyperlinkPluginState: pluginKey,
            }}
            render={({ hyperlinkPluginState }) => (
              <HyperlinkAddToolbarComp
                activityProvider={activityProvider}
                searchProvider={searchProvider}
                onSubmit={onSubmit}
                displayText={displayText}
                displayUrl={displayUrl}
                pluginState={hyperlinkPluginState!}
                view={view}
              />
            )}
          />
        )}
      />
    );
  }
}
