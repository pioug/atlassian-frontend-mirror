import React, { useState } from 'react';
import { AnalyticsListener, UIAnalyticsEvent } from '@atlaskit/analytics-next';
import algoliasearch from 'algoliasearch';
import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/standard-button';
import Page from '@atlaskit/page';
import Textfield from '@atlaskit/textfield';

import LocaleIntlProvider from '../example-helpers/LocaleIntlProvider';
import {
  ExampleWrapper,
  HelpWrapper,
  ControlsWrapper,
  FooterContent,
  ExampleDefaultContent,
  HelpContainer,
} from './utils/styled';

import Help, { RelatedArticles } from '../src';
import { ArticleItem, ArticleFeedback } from '../src/model/Article';

const SEARCH_EXTERNAL_URL = 'https://support.atlassian.com/';

const handleEvent = (analyticsEvent: { payload: any; context: any }) => {
  const { payload, context } = analyticsEvent;
  console.log('Received event:', { payload, context });
};

// Algolia configuration
let client = algoliasearch('8K6J5OJIQW', 'c982b4b1a6ca921131d35edb63359b8c');
var index = client.initIndex('product_help_dev');

// Footer
const Footer = (
  <FooterContent>
    <span>Footer</span>
  </FooterContent>
);

const Example: React.FC = () => {
  const [articleId, setArticleId] = useState<string>();
  const [routeGroup, setRouteGroup] = useState<string>(
    'project-settings-software',
  );
  const [routeName, setRouteName] = useState<string>(
    'project-settings-software-access',
  );

  const openDrawer = (articleId: string = '') => {
    setArticleId(articleId);
  };

  const closeDrawer = (): void => {
    setArticleId('');
  };

  const onGetArticle = async (articleId: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      index.search(
        {
          filters: `objectID:${articleId}`,
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

  const getRelatedArticle = (
    routeGroup?: string,
    routeName?: string,
  ): Promise<any> => {
    return new Promise((resolve, reject) => {
      console.log(routeGroup);
      const facetFilters = [
        [
          `routeGroup:${routeGroup || ''}<score=10>`,
          `_tags:route_group_is_not_defined<score=1>`,
        ],
        routeName
          ? [
              `routeName:${routeName || ''}<score=5>`,
              `_tags:route_name_is_not_defined<score=1>`,
            ]
          : [`_tags:route_name_is_not_defined<score=1>`],
        `routeGroup:-hide`,
        `routeName:-hide`,
        [
          `_tags:-route_group_is_not_defined`,
          `_tags:-route_name_is_not_defined`,
        ],
      ];

      index.search(
        {
          // @ts-ignore
          facetFilters,
          sumOrFiltersScores: true,
        },
        (err: any, res: any) => {
          if (err) {
            reject(err);
          }

          console.log(res.hits);
          resolve(res.hits);
        },
      );
    });
  };

  const onSearch = async (query: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      index
        .search(query)
        .then((result) => {
          resolve(result.hits);
        })
        .catch(function (error) {
          reject(error.message);
        });
    });
  };

  const handleOnSearchResultItemClick = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    analyticsEvent: UIAnalyticsEvent,
    articleData: ArticleItem,
  ) => {
    console.log('onSearchResultItemClick');
    console.log(event);
    console.log(analyticsEvent);
    console.log(articleData);
    analyticsEvent.fire('help');
  };

  const articleIdSetter = (id: string): void => {
    setArticleId(id);
  };

  const handleOnWasHelpfulNoButtonClick = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    analyticsEvent: UIAnalyticsEvent,
    ArticleItem: ArticleItem,
  ): void => {
    console.log('onWasHelpfulNoButtonClick');
    console.log(event);
    console.log(analyticsEvent);
    console.log(ArticleItem);
    analyticsEvent.fire('help');
  };

  const handleOnWasHelpfulYesButtonClick = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    analyticsEvent: UIAnalyticsEvent,
    ArticleItem: ArticleItem,
  ): void => {
    console.log('onWasHelpfulYesButtonClick');
    console.log(event);
    console.log(analyticsEvent);
    console.log(ArticleItem);
    analyticsEvent.fire('help');
  };

  const handleOnSearchInputChanged = (
    event: React.KeyboardEvent<HTMLInputElement>,
    analyticsEvent: UIAnalyticsEvent,
    value: string,
  ) => {
    console.log('onSearchInputChanged');
    console.log(event);
    console.log(analyticsEvent);
    console.log(value);
    analyticsEvent.fire('help');
  };

  const handleOnSearchInputCleared = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    analyticsEvent: UIAnalyticsEvent,
  ) => {
    console.log('onSearchInputCleared');
    console.log(event);
    console.log(analyticsEvent);
    analyticsEvent.fire('help');
  };

  const handleOnSearchExternalUrlClick = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    analyticsEvent: UIAnalyticsEvent,
  ) => {
    console.log('onSearchExternalUrlClick');
    console.log(event);
    console.log(analyticsEvent);
    analyticsEvent.fire('help');
  };

  const handleOnCloseButtonClick = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    analyticsEvent: UIAnalyticsEvent,
  ) => {
    console.log('onCloseButtonClick');
    console.log(event);
    console.log(analyticsEvent);
    analyticsEvent.fire('help');
    closeDrawer();
  };

  const handleOnWasHelpfulSubmit = (
    analyticsEvent: UIAnalyticsEvent,
    articleFeedback: ArticleFeedback,
    articleData: ArticleItem,
  ): Promise<boolean> => {
    console.log('OnWasHelpfulSubmit');
    console.log(analyticsEvent);
    console.log(articleFeedback);
    console.log(articleData);
    return new Promise((resolve, rejects) => {
      let wait = setTimeout(() => {
        clearTimeout(wait);
        resolve();
      }, 200);
    });
  };

  const handleOnBackButtonClick = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    analyticsEvent: UIAnalyticsEvent,
  ) => {
    console.log('onBackButtonClick');
    console.log(event);
    console.log(analyticsEvent);
    analyticsEvent.fire('help');
  };

  const handleOnRelatedArticlesListItemClick = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    analyticsEvent: UIAnalyticsEvent,
    articleData: ArticleItem,
  ) => {
    console.log('onRelatedArticlesListItemClick');
    console.log(event);
    console.log(analyticsEvent);
    console.log(articleData);
  };

  const handleOnArticleLoadingFailTryAgainButtonClick = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    analyticsEvent: UIAnalyticsEvent,
    articleId: string,
  ) => {
    console.log('onArticleLoadingFailTryAgainButtonClick');
    console.log(event);
    console.log(analyticsEvent);
    console.log(articleId);
  };

  return (
    <AnalyticsListener channel="help" onEvent={handleEvent}>
      <ExampleWrapper>
        <Page>
          <div
            style={{
              display: 'inline-block',
              height: '100%',
              verticalAlign: 'top',
            }}
          >
            <ControlsWrapper>
              <ButtonGroup>
                <Button appearance="primary" onClick={() => openDrawer()}>
                  Open drawer - no ID
                </Button>

                <Button
                  appearance="primary"
                  onClick={() => openDrawer('zqjkEZh4DPqRCpUSeg8a5')}
                >
                  Open drawer - article 1
                </Button>

                <Button
                  appearance="primary"
                  onClick={() => openDrawer('zl7jDsTshqNFSXgY8302f')}
                >
                  Open drawer - article 2
                </Button>

                <Button
                  appearance="primary"
                  onClick={() => openDrawer('11111111111111111111')}
                >
                  Open drawer - wrong id
                </Button>

                <Button
                  appearance="primary"
                  type="button"
                  onClick={closeDrawer}
                >
                  Close drawer
                </Button>
              </ButtonGroup>
            </ControlsWrapper>
            <ControlsWrapper>
              <label htmlFor="route-group">Route Group</label>
              <Textfield
                value={routeGroup}
                width="large"
                name="route-group"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setRouteGroup(e.target.value)
                }
              />
            </ControlsWrapper>
            <ControlsWrapper>
              <label htmlFor="route-name">Route Name</label>
              <Textfield
                value={routeName}
                width="large"
                name="route-name"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setRouteName(e.target.value)
                }
              />
            </ControlsWrapper>
          </div>
          <HelpContainer>
            <HelpWrapper>
              <LocaleIntlProvider locale={'en'}>
                <Help
                  articleIdSetter={articleIdSetter}
                  onCloseButtonClick={handleOnCloseButtonClick}
                  articleId={articleId}
                  onGetArticle={onGetArticle}
                  onWasHelpfulYesButtonClick={handleOnWasHelpfulYesButtonClick}
                  onWasHelpfulNoButtonClick={handleOnWasHelpfulNoButtonClick}
                  footer={Footer}
                  onSearch={onSearch}
                  searchExternalUrl={SEARCH_EXTERNAL_URL}
                  onSearchInputChanged={handleOnSearchInputChanged}
                  onSearchInputCleared={handleOnSearchInputCleared}
                  onSearchResultItemClick={handleOnSearchResultItemClick}
                  onRelatedArticlesListItemClick={
                    handleOnRelatedArticlesListItemClick
                  }
                  onArticleLoadingFailTryAgainButtonClick={
                    handleOnArticleLoadingFailTryAgainButtonClick
                  }
                  onGetRelatedArticleOfOpenArticle={getRelatedArticle}
                  onSearchExternalUrlClick={handleOnSearchExternalUrlClick}
                  onWasHelpfulSubmit={handleOnWasHelpfulSubmit}
                  onBackButtonClick={handleOnBackButtonClick}
                  onRelatedArticlesShowMoreClickOfOpenArticle={(
                    event,
                    analytics,
                    isCollapsed,
                  ) => {
                    console.log('onRelatedArticlesShowMoreClickOfOpenArticle');
                    console.log(event);
                    console.log(analytics);
                    console.log(isCollapsed);
                  }}
                >
                  <ExampleDefaultContent>
                    <RelatedArticles
                      onRelatedArticlesListItemClick={(
                        event,
                        analytics,
                        article,
                      ) => {
                        console.log('onRelatedArticlesListItemClick');
                        console.log(event);
                        console.log(analytics);
                        console.log(article);
                        articleIdSetter(article.id);
                      }}
                      onRelatedArticlesShowMoreClick={(
                        event,
                        analytics,
                        isCollapsed,
                      ) => {
                        console.log('onRelatedArticlesShowMoreClick');
                        console.log(event);
                        console.log(analytics);
                        console.log(isCollapsed);
                      }}
                      onGetRelatedArticle={getRelatedArticle}
                      routeGroup={routeGroup}
                      routeName={routeName}
                    />
                  </ExampleDefaultContent>
                </Help>
              </LocaleIntlProvider>
            </HelpWrapper>
          </HelpContainer>
        </Page>
      </ExampleWrapper>
    </AnalyticsListener>
  );
};

export default Example;
