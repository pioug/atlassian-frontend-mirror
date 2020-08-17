import React from 'react';
import HyperlinkAddToolbar, { LinkInputType } from './HyperlinkAddToolbar';
import { ProviderFactory, WithProviders } from '@atlaskit/editor-common';

export interface Props {
  providerFactory: ProviderFactory;
  onBlur?: (
    type: string,
    url: string,
    title: string | undefined,
    displayText: string | undefined,
    isTabPressed?: boolean,
  ) => void;
  onSubmit: (
    href: string,
    title: string | undefined,
    displayText: string | undefined,
    inputMethod: LinkInputType,
  ) => void;
  displayText: string;
  displayUrl?: string;
}

export default class Toolbar extends React.PureComponent<Props, {}> {
  render() {
    const {
      onSubmit,
      onBlur,
      displayText,
      displayUrl,
      providerFactory,
    } = this.props;
    return (
      <WithProviders
        providers={['activityProvider']}
        providerFactory={providerFactory}
        renderNode={({ activityProvider }) => (
          <HyperlinkAddToolbar
            provider={activityProvider}
            onSubmit={onSubmit}
            onBlur={onBlur}
            displayText={displayText || ''}
            displayUrl={displayUrl}
          />
        )}
      />
    );
  }
}
