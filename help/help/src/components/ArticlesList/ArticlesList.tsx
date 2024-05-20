import React from 'react';
import { type UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { N30 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import AnimateHeight from 'react-animate-height';

import { type ArticleItem } from '../../model/Article';

import ArticlesListItem from './ArticlesListItem';
import { type ArticlesList as ArticlesListInterface } from './model/ArticlesListItem';
import {
  MIN_ITEMS_TO_DISPLAY,
  ANIMATE_HEIGHT_TRANSITION_DURATION_MS,
} from './constants';

export interface Props {
  /* Number of articles to display. This prop is optional (default value is 5) */
  numberOfArticlesToDisplay?: number;
}

const getStyles = (style: string) => {
  if (style === 'secondary') {
    return {
      border: `2px solid ${token('color.border', N30)}`,
      padding: token('space.200', '16px'),
      marginBottom: token('space.150', '12px'),
    };
  }
  return {
    border: 0,
    padding: token('space.100', '8px'),
    marginBottom: 0,
  };
};

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
        {articles.slice(0, minItemsToDisplay).map((article: ArticleItem) => {
          return (
            <ArticlesListItem
              styles={getStyles(style)}
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
              trustFactors={article.trustFactors}
              source={article.source}
              lastPublished={article.lastPublished}
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
          .map((article: ArticleItem) => (
            <ArticlesListItem
              styles={getStyles(style)}
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
              trustFactors={article.trustFactors}
              source={article.source}
              lastPublished={article.lastPublished}
            />
          ))}
      </AnimateHeight>
    </>
  );

export default articlesList;
