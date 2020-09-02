import React from 'react';
import HyperlinkAddToolbarComp, { LinkInputType } from './HyperlinkAddToolbar';
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

export default class HyperlinkAddToolbar extends React.PureComponent<
  Props,
  {}
> {
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
        providers={['activityProvider', 'searchProvider']}
        providerFactory={providerFactory}
        renderNode={({ activityProvider, searchProvider }) => (
          <HyperlinkAddToolbarComp
            activityProvider={activityProvider}
            searchProvider={searchProvider}
            onSubmit={onSubmit}
            onBlur={onBlur}
            displayText={displayText}
            displayUrl={displayUrl}
          />
        )}
      />
    );
  }
}
