import React, { useState } from 'react';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import Page from '@atlaskit/page';

import LocaleIntlProvider from '../example-helpers/LocaleIntlProvider';
import Help, { ARTICLE_TYPE } from '../src';
import type { Article, articleId } from '../src';

import { getArticle } from './utils/mockData';
import {
  ExampleWrapper,
  HelpContainer,
  HelpWrapper,
  FooterContent,
  ExampleDefaultContent,
} from './utils/styled';

const handleEvent = (analyticsEvent: { payload: any; context: any }) => {
  const { payload, context } = analyticsEvent;
  console.log('Received event:', { payload, context });
};

const Example: React.FC = () => {
  const [articleId, setArticleId] = useState<articleId>({
    id: '',
    type: ARTICLE_TYPE.HELP_ARTICLE,
  });
  const onGetHelpArticle = (articleId: articleId): Promise<Article> => {
    return new Promise((resolve) => resolve(getArticle(articleId.id)));
  };

  return (
    <ExampleWrapper>
      <Page>
        <HelpContainer>
          <HelpWrapper>
            <AnalyticsListener channel="atlaskit" onEvent={handleEvent}>
              <LocaleIntlProvider locale={'en'}>
                <Help
                  navigation={{
                    articleId,
                    articleIdSetter: setArticleId,
                  }}
                  helpArticle={{
                    onGetHelpArticle,
                  }}
                  footer={
                    <FooterContent>
                      <span>Footer</span>
                    </FooterContent>
                  }
                >
                  <ExampleDefaultContent>
                    <span>Default content</span>
                  </ExampleDefaultContent>
                </Help>
              </LocaleIntlProvider>
            </AnalyticsListener>
          </HelpWrapper>
        </HelpContainer>
      </Page>
    </ExampleWrapper>
  );
};

export default Example;
