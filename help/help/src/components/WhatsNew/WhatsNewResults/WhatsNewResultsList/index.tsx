import React, { useCallback } from 'react';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { ThemeProvider } from 'styled-components';
import { itemThemeNamespace } from '@atlaskit/item';
import { gridSize } from '@atlaskit/theme/constants';

import ShowMoreButton from '../../../ShowMoreButton';
import { useNavigationContext } from '../../../contexts/navigationContext';
import { ARTICLE_TYPE } from '../../../../model/Help';
import { NUMBER_OF_WHATS_NEW_ITEMS_PER_PAGE } from '../../../constants';

import ArticlesList from './WhatsNewResultsList';
import { WhatsNewResultsListContainer } from './styled';
import { WhatsNewResultsList as WhatsNewResultsListInterface } from './model/WhatsNewResultsList';

const ITEM_THEME = {
  padding: {
    default: {
      bottom: gridSize(),
      left: gridSize(),
      top: gridSize(),
      right: gridSize(),
    },
  },
};

const WhatsNewResultsList: React.FC<WhatsNewResultsListInterface> = ({
  style,
  whatsNewArticles,
  nextPage,
  hasNextPage,
  loadingMore = false,
  onWhatsNewResultItemClick,
  onShowMoreButtonClick,
}) => {
  const { setArticleId } = useNavigationContext();
  const handleShowMoreButtonClick = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    analyticsEvent: UIAnalyticsEvent,
  ): void => {
    if (onShowMoreButtonClick) {
      onShowMoreButtonClick(event, analyticsEvent);
    }
  };

  const handleOnWhatsNewResultItemClick = useCallback(
    (
      event: React.MouseEvent<HTMLElement>,
      analyticsEvent: UIAnalyticsEvent,
      articleData: any,
    ) => {
      if (setArticleId) {
        setArticleId({
          id: articleData.id,
          type: ARTICLE_TYPE.WHATS_NEW,
        });
      }

      if (onWhatsNewResultItemClick) {
        onWhatsNewResultItemClick(event, analyticsEvent, articleData);
      }
    },
    [onWhatsNewResultItemClick, setArticleId],
  );

  return whatsNewArticles && whatsNewArticles.length > 0 ? (
    <WhatsNewResultsListContainer>
      <ThemeProvider theme={{ [itemThemeNamespace]: ITEM_THEME }}>
        <>
          <ArticlesList
            style={style}
            onWhatsNewResultItemClick={handleOnWhatsNewResultItemClick}
            whatsNewArticles={whatsNewArticles}
          />
          {nextPage && hasNextPage && (
            <ShowMoreButton
              onToggle={handleShowMoreButtonClick}
              minItemsToDisplay={0}
              maxItemsToDisplay={NUMBER_OF_WHATS_NEW_ITEMS_PER_PAGE}
              showMoreToggeled={true}
              itemsType="changes"
              loading={loadingMore}
            />
          )}
        </>
      </ThemeProvider>
    </WhatsNewResultsListContainer>
  ) : null;
};

export default WhatsNewResultsList;
