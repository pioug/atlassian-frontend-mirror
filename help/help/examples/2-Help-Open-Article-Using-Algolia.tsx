import React, { useState } from 'react';
import algoliasearch from 'algoliasearch';
import Page from '@atlaskit/page';

import Help, { ARTICLE_TYPE } from '../src';
import type { Article, articleId, HistoryItem } from '../src';

import {
  ExampleWrapper,
  HelpContainer,
  HelpWrapper,
  FooterContent,
  ExampleDefaultContent,
} from './utils/styled';

var client = algoliasearch('8K6J5OJIQW', 'c982b4b1a6ca921131d35edb63359b8c');
var index = client.initIndex('product_help_dev');

const Example = () => {
  const [navigationData, setNavigationData] = useState<{
    articleId: articleId;
    history: HistoryItem[];
  }>({
    articleId: { id: 'zqjkEZh4DPqRCpUSeg8a5', type: ARTICLE_TYPE.HELP_ARTICLE },
    history: [],
  });

  const navigationDataSetter = (navigationData: {
    articleId: articleId;
    history: HistoryItem[];
  }): void => {
    console.log('new navigation data');
    console.log(navigationData);
    setNavigationData(navigationData);
  };

  const onGetHelpArticle = async (articleId: articleId): Promise<Article> => {
    return new Promise((resolve, reject) => {
      index.search(
        {
          filters: `objectID:${articleId.id}`,
        },
        (err, res) => {
          if (err) {
            reject(err);
          }

          if (res) {
            const article = res.hits[0];

            if (article) {
              resolve(article);
            } else {
              reject(`not found`);
            }
          } else {
            reject(`No internet connection`);
          }
        },
      );
    });
  };

  return (
    <ExampleWrapper>
      <Page>
        <HelpContainer>
          <HelpWrapper>
            <Help
              navigation={{
                navigationData,
                setNavigationData: navigationDataSetter,
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
          </HelpWrapper>
        </HelpContainer>
      </Page>
    </ExampleWrapper>
  );
};

export default Example;
