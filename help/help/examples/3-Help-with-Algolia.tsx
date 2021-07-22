import React, { useState } from 'react';
import { AnalyticsListener, UIAnalyticsEvent } from '@atlaskit/analytics-next';
import algoliasearch from 'algoliasearch';
import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/standard-button';
import Page from '@atlaskit/page';
import Textfield from '@atlaskit/textfield';
import ShipIcon from '@atlaskit/icon/glyph/ship';
import * as colors from '@atlaskit/theme/colors';

import LocaleIntlProvider from '../example-helpers/LocaleIntlProvider';

import {
  ExampleWrapper,
  HelpWrapper,
  ControlsWrapper,
  FooterContent,
  HelpContainer,
} from './utils/styled';

import Help, { RelatedArticles, ARTICLE_TYPE } from '../src';
import type { ArticleItem, ArticleFeedback, articleId } from '../src';

const SEARCH_EXTERNAL_URL = 'https://support.atlassian.com/';

const handleEvent = (analyticsEvent: { payload: any; context: any }) => {
  const { payload, context } = analyticsEvent;
  console.log('Received event:', { payload, context });
};

// Algolia configuration
let client = algoliasearch('8K6J5OJIQW', 'c982b4b1a6ca921131d35edb63359b8c');
var index = client.initIndex('product_help_uat');

const Footer = (
  <FooterContent>
    <span>Footer</span>
  </FooterContent>
);

const Example: React.FC = () => {
  const [algoliaIndex, setAlgoliaIndex] = useState<string>(index.indexName);
  const [articleId, setArticleId] = useState<articleId>({
    id: '',
    type: ARTICLE_TYPE.HELP_ARTICLE,
  });

  const [routeGroup, setRouteGroup] = useState<string>(
    'project-settings-software',
  );
  const [routeName, setRouteName] = useState<string | undefined>(
    'project-settings-software-access',
  );
  const [productName, setProductName] = useState<string>('Jira Software');
  const [productExperience, setProductExperience] = useState<string>(
    'Next-gen',
  );
  const [showComponent, setShowComponent] = useState<boolean>(true);
  const [algoliaParameters, setAlgoliaParameters] = useState({
    routeGroup,
    routeName,
    productName,
    productExperience,
  });

  const openDrawer = (
    articleId: string = '',
    type: ARTICLE_TYPE = ARTICLE_TYPE.HELP_ARTICLE,
  ) => {
    setArticleId({ id: articleId, type });
    setShowComponent(true);
  };

  const closeDrawer = (): void => {
    setArticleId({ id: '', type: ARTICLE_TYPE.HELP_ARTICLE });
    setShowComponent(false);
  };

  const onGetHelpArticle = async (articleId: articleId): Promise<any> => {
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

  const getRelatedArticle = (
    routeGroup?: string,
    routeName?: string,
  ): Promise<any> => {
    return new Promise((resolve, reject) => {
      console.log(routeGroup);
      const facetFilters = [
        [
          `routes.routeGroup:${routeGroup || ''}<score=10>`,
          'routes.hasGroup:false<score=1>',
        ],
        routeName != null
          ? [
              `routes.routeName:${routeName || ''}<score=5>`,
              'routes.hasName:false<score=1>',
            ]
          : ['routes.hasName:false<score=1>'],
        `productName:${algoliaParameters.productName}`,
        'routes.routeGroup:-hide',
        'routes.routeName:-hide',
        `productExperience:${algoliaParameters.productExperience}`,
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

  const articleIdSetter = (articleId: articleId): void => {
    setArticleId(articleId);
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

  const handleOnRelatedArticlesShowMoreClick = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    analyticsEvent: UIAnalyticsEvent,
    isCollapsed: boolean,
  ) => {
    console.log('onRelatedArticlesShowMoreClickOfOpenArticle');
    console.log(event);
    console.log(analyticsEvent);
    console.log(isCollapsed);
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
        resolve(true);
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

  const handleOnHelpArticleLoadingFailTryAgainButtonClick = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    analyticsEvent: UIAnalyticsEvent,
    articleId: articleId,
  ) => {
    console.log('onHelpArticleLoadingFailTryAgainButtonClick');
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
              width: 'Calc(100% - 400px)',
            }}
          >
            <ControlsWrapper>
              <ButtonGroup>
                <Button appearance="primary" onClick={() => openDrawer()}>
                  Open drawer - no ID
                </Button>

                <Button
                  appearance="primary"
                  type="button"
                  onClick={closeDrawer}
                >
                  Close drawer
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
              </ButtonGroup>
            </ControlsWrapper>
            <ControlsWrapper>
              <ButtonGroup>
                <Button
                  appearance="primary"
                  onClick={() => openDrawer('', ARTICLE_TYPE.WHATS_NEW)}
                >
                  Open drawer - What's New
                </Button>

                <Button
                  appearance="primary"
                  onClick={() => openDrawer('01', ARTICLE_TYPE.WHATS_NEW)}
                >
                  Open drawer - What's new Article
                </Button>
              </ButtonGroup>
            </ControlsWrapper>
            <ControlsWrapper>
              <label htmlFor="route-name">Algolia Index *</label>
              <Textfield
                value={algoliaIndex}
                width="large"
                name="route-name"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setAlgoliaIndex(e.target.value)
                }
              />
            </ControlsWrapper>
            <ControlsWrapper>
              <label htmlFor="route-name">Product Name *</label>
              <Textfield
                value={productName}
                width="large"
                name="route-name"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setProductName(e.target.value)
                }
              />
            </ControlsWrapper>
            <ControlsWrapper>
              <label htmlFor="route-name">Product Experience *</label>
              <Textfield
                value={productExperience}
                width="large"
                name="route-name"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setProductExperience(e.target.value)
                }
              />
            </ControlsWrapper>
            <ControlsWrapper>
              <label htmlFor="route-group">Route Group *</label>
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
            <ControlsWrapper>
              <Button
                appearance="primary"
                onClick={() => {
                  closeDrawer();
                  setAlgoliaParameters({
                    routeGroup,
                    routeName: routeName !== '' ? routeName : undefined,
                    productName,
                    productExperience,
                  });
                  index.indexName = algoliaIndex;
                  setTimeout(() => openDrawer(), 0);
                }}
              >
                Save
              </Button>
            </ControlsWrapper>
          </div>
          {showComponent && (
            <HelpContainer>
              <HelpWrapper>
                <LocaleIntlProvider locale={'en'}>
                  <Help
                    home={{
                      homeOptions: [
                        {
                          id: 'test-button',
                          onClick: (id: string) => {
                            console.log('test button');
                          },
                          text: `Test Button`,
                          href: 'https://www.google.com',
                          icon: (
                            <ShipIcon
                              primaryColor={colors.N600}
                              size="medium"
                              label=""
                            />
                          ),
                        },
                      ],
                    }}
                    footer={Footer}
                    helpArticle={{
                      onGetHelpArticle,
                      onHelpArticleLoadingFailTryAgainButtonClick: handleOnHelpArticleLoadingFailTryAgainButtonClick,
                      onWasHelpfulSubmit: handleOnWasHelpfulSubmit,
                      onWasHelpfulYesButtonClick: handleOnWasHelpfulYesButtonClick,
                      onWasHelpfulNoButtonClick: handleOnWasHelpfulNoButtonClick,
                    }}
                    navigation={{
                      articleId,
                      articleIdSetter,
                    }}
                    search={{
                      onSearch,
                      onSearchInputChanged: handleOnSearchInputChanged,
                      onSearchInputCleared: handleOnSearchInputCleared,
                      onSearchResultItemClick: handleOnSearchResultItemClick,
                      onSearchExternalUrlClick: handleOnSearchExternalUrlClick,
                      searchExternalUrl: SEARCH_EXTERNAL_URL,
                    }}
                    relatedArticles={{
                      routeGroup: algoliaParameters.routeGroup,
                      routeName: algoliaParameters.routeName,
                      onGetRelatedArticles: getRelatedArticle,
                      onRelatedArticlesShowMoreClick: handleOnRelatedArticlesShowMoreClick,
                      onRelatedArticlesListItemClick: handleOnRelatedArticlesListItemClick,
                    }}
                    header={{
                      onCloseButtonClick: handleOnCloseButtonClick,
                      onBackButtonClick: handleOnBackButtonClick,
                    }}
                  >
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
                        articleIdSetter({
                          id: article.id,
                          type: ARTICLE_TYPE.HELP_ARTICLE,
                        });
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
                      onGetRelatedArticles={getRelatedArticle}
                      routeGroup={algoliaParameters.routeGroup}
                      routeName={algoliaParameters.routeName}
                    />
                  </Help>
                </LocaleIntlProvider>
              </HelpWrapper>
            </HelpContainer>
          )}
        </Page>
      </ExampleWrapper>
    </AnalyticsListener>
  );
};

export default Example;
