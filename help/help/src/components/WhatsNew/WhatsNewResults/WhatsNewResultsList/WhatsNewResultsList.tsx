import React from 'react';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { gridSize } from '@atlaskit/theme/constants';
import * as colors from '@atlaskit/theme/colors';

import { WhatsNewArticleItem } from '../../../../model/WhatsNew';

import WhatsNewResultItem from './WhatsNewResultItem';
import { WhatsNewResultsList as WhatsNewResultsListInterface } from './model/WhatsNewResultsList';
// import { WhatsNewResultsListGroupTitle } from './styled';

export interface Props {
  /* Number of "What's new" articles to diplay. This prop is optional (default value is 5) */
  numberOfWhatsNewArticlesToDisplay?: number;
}
const WhatsNewResultsList: React.FC<
  Partial<WhatsNewResultsListInterface> & Props
> = ({ style = 'primary', whatsNewArticles = [], onWhatsNewResultItemClick }) =>
  whatsNewArticles && (
    <>
      {whatsNewArticles.map(
        (whatsNewArticle: WhatsNewArticleItem, i: number) => (
          <WhatsNewResultItem
            styles={{
              border: style === 'secondary' ? `2px solid ${colors.N30}` : 0,
              padding:
                style === 'secondary'
                  ? `${gridSize()}px ${gridSize() * 2}px`
                  : `${gridSize()}px`,
              marginBottom: style === 'secondary' ? `${gridSize() * 1.5}px` : 0,
            }}
            id={whatsNewArticle.id}
            onClick={(
              event: React.MouseEvent<HTMLElement>,
              analyticsEvent: UIAnalyticsEvent,
            ) => {
              if (onWhatsNewResultItemClick) {
                onWhatsNewResultItemClick(
                  event,
                  analyticsEvent,
                  whatsNewArticle,
                );
              }
            }}
            type={whatsNewArticle.type}
            title={whatsNewArticle.title}
            key={whatsNewArticle.id}
          />
        ),
      )}
    </>
  );

export default WhatsNewResultsList;
