import React, { useState } from 'react';
import { type UIAnalyticsEvent } from '@atlaskit/analytics-next';

import ArticlesList from './ArticlesList';
import ShowMoreButton from '../ShowMoreButton';
import { ArticlesListContainer } from './styled';
import { type ArticlesList as ArticlesListInterface } from './model/ArticlesListItem';
import { MIN_ITEMS_TO_DISPLAY } from './constants';

const ArticleList: React.FC<ArticlesListInterface> = ({
  style,
  articles,
  minItemsToDisplay,
  maxItemsToDisplay,
  onArticlesListItemClick,
  onToggleArticlesList,
}) => {
  const [showMoreToggled, setShowMoreToggled] = useState<boolean>(true);

  const getMinItemsToDisplay = (): number => {
    return minItemsToDisplay ? minItemsToDisplay : MIN_ITEMS_TO_DISPLAY;
  };

  const getMaxItemsToDisplay = (): number => {
    if (articles) {
      return maxItemsToDisplay ? maxItemsToDisplay : articles.length;
    }

    return 0;
  };

  const getNumberOfArticlesToDisplay = (showMoreToggeled: boolean): number => {
    return showMoreToggeled ? getMinItemsToDisplay() : getMaxItemsToDisplay();
  };

  const toggleArticlesList = (
    event: React.MouseEvent<HTMLElement>,
    analyticsEvent: UIAnalyticsEvent,
  ): void => {
    setShowMoreToggled(!showMoreToggled);

    if (onToggleArticlesList) {
      onToggleArticlesList(event, analyticsEvent, !showMoreToggled);
    }
  };

  return articles && articles.length > 0 ? (
    <ArticlesListContainer>
      <>
        <ArticlesList
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
          style={style}
          onArticlesListItemClick={onArticlesListItemClick}
          articles={articles}
          numberOfArticlesToDisplay={getNumberOfArticlesToDisplay(
            showMoreToggled,
          )}
        />
        {articles.length > getMinItemsToDisplay() && (
          <ShowMoreButton
            minItemsToDisplay={getMinItemsToDisplay()}
            maxItemsToDisplay={getMaxItemsToDisplay()}
            showMoreToggeled={showMoreToggled}
            onToggle={toggleArticlesList}
            itemsType="articles"
          />
        )}
      </>
    </ArticlesListContainer>
  ) : null;
};

export default ArticleList;
