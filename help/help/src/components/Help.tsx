import React from 'react';
import {
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
  withAnalyticsContext,
} from '@atlaskit/analytics-next';
import { defaultAnalyticsAttributes } from '../analytics';
import { Help as HelpInterface } from '../model/Help';

import { HeaderContextProvider } from './contexts/headerContext';
import { HomeContextProvider } from './contexts/homeContext';
import { HelpArticleContextProvider } from './contexts/helpArticleContext';
import { NavigationContextProvider } from './contexts/navigationContext';
import { RelatedArticlesContextProvider } from './contexts/relatedArticlesContext';
import { SearchContextProvider } from './contexts/searchContext';
import { WhatsNewArticleProvider } from './contexts/whatsNewArticleContext';
import MessagesIntlProvider from './MessagesIntlProvider';

import HelpContent from './HelpContent';

export type Props = HelpInterface & WithAnalyticsEventsProps;

export class Help extends React.PureComponent<Props> {
  render() {
    const { children, footer, ...rest } = this.props;
    return (
      <HeaderContextProvider {...rest.header}>
        <HomeContextProvider {...rest.home} homeContent={children}>
          <HelpArticleContextProvider {...rest.helpArticle}>
            <RelatedArticlesContextProvider {...rest.relatedArticles}>
              <SearchContextProvider {...rest.search}>
                <WhatsNewArticleProvider {...rest.whatsNew}>
                  <NavigationContextProvider {...rest.navigation}>
                    <MessagesIntlProvider>
                      <HelpContent footer={footer} />
                    </MessagesIntlProvider>
                  </NavigationContextProvider>
                </WhatsNewArticleProvider>
              </SearchContextProvider>
            </RelatedArticlesContextProvider>
          </HelpArticleContextProvider>
        </HomeContextProvider>
      </HeaderContextProvider>
    );
  }
}

export default withAnalyticsContext(defaultAnalyticsAttributes)(
  withAnalyticsEvents()(Help),
);
