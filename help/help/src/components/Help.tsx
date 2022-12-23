import React from 'react';
import {
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
  withAnalyticsContext,
} from '@atlaskit/analytics-next';
import { IntlProvider } from 'react-intl-next';
import { defaultAnalyticsAttributes } from '../analytics';
import { Help as HelpInterface } from '../model/Help';

import { HeaderContextProvider } from './contexts/headerContext';
import { HomeContextProvider } from './contexts/homeContext';
import { HelpArticleContextProvider } from './contexts/helpArticleContext';
import { NavigationContextProvider } from './contexts/navigationContext';
import { RelatedArticlesContextProvider } from './contexts/relatedArticlesContext';
import { SearchContextProvider } from './contexts/searchContext';
import { WhatsNewArticleProvider } from './contexts/whatsNewArticleContext';

import HelpContent from './HelpContent';

export type Props = HelpInterface & WithAnalyticsEventsProps;

const LocaleIntlProvider = ({
  locale = 'en',
  children,
}: {
  locale?: string;
  children: React.ReactNode;
}) => (
  <IntlProvider key={locale} locale={locale}>
    {children}
  </IntlProvider>
);

export class Help extends React.PureComponent<Props> {
  render() {
    const { children, footer, ...rest } = this.props;
    return (
      <LocaleIntlProvider>
        <HeaderContextProvider {...rest.header}>
          <HomeContextProvider {...rest.home} homeContent={children}>
            <HelpArticleContextProvider {...rest.helpArticle}>
              <RelatedArticlesContextProvider {...rest.relatedArticles}>
                <SearchContextProvider {...rest.search}>
                  <WhatsNewArticleProvider {...rest.whatsNew}>
                    <NavigationContextProvider {...rest.navigation}>
                      <HelpContent footer={footer} />
                    </NavigationContextProvider>
                  </WhatsNewArticleProvider>
                </SearchContextProvider>
              </RelatedArticlesContextProvider>
            </HelpArticleContextProvider>
          </HomeContextProvider>
        </HeaderContextProvider>
      </LocaleIntlProvider>
    );
  }
}

export default withAnalyticsContext(defaultAnalyticsAttributes)(
  withAnalyticsEvents()(Help),
);
