import React from 'react';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { gridSize } from '@atlaskit/theme/constants';
import * as colors from '@atlaskit/theme/colors';
import AnimateHeight from 'react-animate-height';

import { ArticleItem } from '../../model/Article';

import ArticlesListItem from './ArticlesListItem';
import { ArticlesList as ArticlesListInterface } from './model/ArticlesListItem';
import {
  MIN_ITEMS_TO_DISPLAY,
  ANIMATE_HEIGHT_TRANSITION_DURATION_MS,
} from './constants';

export interface Props {
  /* Number of articles to diplay. This prop is optional (default value is 5) */
  numberOfArticlesToDisplay?: number;
}
const articlesList: React.FC<Partial<ArticlesListInterface> & Props> = ({
  style = 'primary',
  articles = [],
  minItemsToDisplay = MIN_ITEMS_TO_DISPLAY,
  numberOfArticlesToDisplay = MIN_ITEMS_TO_DISPLAY,
  onArticlesListItemClick,
}) =>
  articles && (
    <>
      <div>
        {articles
          .slice(0, minItemsToDisplay)
          .map((article: ArticleItem, i: number) => {
            return (
              <ArticlesListItem
                styles={{
                  border: style === 'secondary' ? `2px solid ${colors.N30}` : 0,
                  padding:
                    style === 'secondary'
                      ? `${gridSize()}px ${gridSize() * 2}px`
                      : `${gridSize()}px`,
                  marginBottom:
                    style === 'secondary' ? `${gridSize() * 1.5}px` : 0,
                }}
                id={article.id}
                onClick={(
                  event: React.MouseEvent<HTMLElement>,
                  analyticsEvent: UIAnalyticsEvent,
                ) => {
                  if (onArticlesListItemClick) {
                    onArticlesListItemClick(event, analyticsEvent, article);
                  }
                }}
                title={article.title}
                description={article.description}
                key={article.id}
                href={article.href}
              />
            );
          })}
      </div>
      <AnimateHeight
        duration={ANIMATE_HEIGHT_TRANSITION_DURATION_MS}
        easing="linear"
        height={numberOfArticlesToDisplay > minItemsToDisplay ? 'auto' : 0}
      >
        {articles
          .slice(minItemsToDisplay, articles.length)
          .map((article: ArticleItem, i: number) => (
            <ArticlesListItem
              styles={{
                border: style === 'secondary' ? `2px solid ${colors.N30}` : 0,
                padding:
                  style === 'secondary'
                    ? `${gridSize()}px ${gridSize() * 2}px`
                    : `${gridSize()}px`,
                marginBottom:
                  style === 'secondary' ? `${gridSize() * 1.5}px` : 0,
              }}
              id={article.id}
              onClick={(
                event: React.MouseEvent<HTMLElement>,
                analyticsEvent: UIAnalyticsEvent,
              ) => {
                if (onArticlesListItemClick) {
                  onArticlesListItemClick(event, analyticsEvent, article);
                }
              }}
              title={article.title}
              description={article.description}
              key={article.id}
              href={article.href}
            />
          ))}
      </AnimateHeight>
    </>
  );

export default articlesList;
