import React, { useCallback } from 'react';
import { type UIAnalyticsEvent } from '@atlaskit/analytics-next';

import ShowMoreButton from '../../../ShowMoreButton';
import { useNavigationContext } from '../../../contexts/navigationContext';
import { ARTICLE_TYPE } from '../../../../model/Help';
import { NUMBER_OF_WHATS_NEW_ITEMS_PER_PAGE } from '../../../constants';

import ArticlesList from './WhatsNewResultsList';
import { WhatsNewResultsListContainer } from './styled';
import { type WhatsNewResultsList as WhatsNewResultsListInterface } from './model/WhatsNewResultsList';

const WhatsNewResultsList: React.FC<WhatsNewResultsListInterface> = ({
  style,
  whatsNewArticles,
  nextPage,
  hasNextPage,
  loadingMore = false,
  onWhatsNewResultItemClick,
  onShowMoreButtonClick,
}) => {
  const { openArticle } = useNavigationContext();
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
      openArticle({
        id: articleData.id,
        type: ARTICLE_TYPE.WHATS_NEW,
      });

      if (onWhatsNewResultItemClick) {
        onWhatsNewResultItemClick(event, analyticsEvent, articleData);
      }
    },
    [onWhatsNewResultItemClick, openArticle],
  );

  return whatsNewArticles && whatsNewArticles.length > 0 ? (
    <WhatsNewResultsListContainer>
      <>
        <ArticlesList
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
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
    </WhatsNewResultsListContainer>
  ) : null;
};

export default WhatsNewResultsList;
