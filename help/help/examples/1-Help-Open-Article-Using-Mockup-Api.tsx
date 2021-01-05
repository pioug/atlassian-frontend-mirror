import React from 'react';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import Page from '@atlaskit/page';

import Help from '../src';

import LocaleIntlProvider from '../example-helpers/LocaleIntlProvider';
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
  const onGetArticle = (articleId: string): Promise<any> => {
    return new Promise(resolve => resolve(getArticle(articleId)));
  };

  return (
    <ExampleWrapper>
      <Page>
        <HelpContainer>
          <HelpWrapper>
            <AnalyticsListener channel="atlaskit" onEvent={handleEvent}>
              <LocaleIntlProvider locale={'en'}>
                <Help
                  articleId="00"
                  onGetArticle={onGetArticle}
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
