import React, { useEffect, useState } from 'react';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { gridSize } from '@atlaskit/theme/constants';
import * as colors from '@atlaskit/theme/colors';
import toDate from 'date-fns/toDate';
import isYesterday from 'date-fns/isYesterday';
import isToday from 'date-fns/isToday';
import formatDate from 'date-fns/format';

import { WhatsNewArticleItem } from '../../../../model/WhatsNew';

import WhatsNewResultItem from './WhatsNewResultItem';
import { WhatsNewResultsList as WhatsNewResultsListInterface } from './model/WhatsNewResultsList';
import {
  WhatsNewResultsListGroupTitle,
  WhatsNewResultsListGroupWrapper,
} from './styled';

export interface Props {
  /* Number of "What's new" articles to diplay. This prop is optional (default value is 5) */
  numberOfWhatsNewArticlesToDisplay?: number;
}
const WhatsNewResultsList: React.FC<
  Partial<WhatsNewResultsListInterface> & Props
> = ({
  style = 'primary',
  whatsNewArticles = [],
  onWhatsNewResultItemClick,
}) => {
  const [whatsNewArticlesGroupedByDate, setListValuesGrouped] = useState<{
    [key: string]: any;
  }>({});

  useEffect(() => {
    let whatsNewArticlesGroupedByDateTemp: { [key: string]: any } = {};
    whatsNewArticles?.forEach((whatsNewArticle) => {
      const featureRolloutDateString = whatsNewArticle?.featureRolloutDate;

      if (featureRolloutDateString) {
        const featureRolloutDateArray = featureRolloutDateString
          .split('-')
          .map((dateValue) => parseInt(dateValue));
        const featureRolloutDate = toDate(
          new Date(
            featureRolloutDateArray[0],
            featureRolloutDateArray[1],
            featureRolloutDateArray[2],
          ),
        );

        if (whatsNewArticlesGroupedByDateTemp[featureRolloutDateString]) {
          whatsNewArticlesGroupedByDateTemp[
            featureRolloutDateString
          ].items.push(whatsNewArticle);
        } else {
          whatsNewArticlesGroupedByDateTemp[featureRolloutDateString] = {
            title: isToday(featureRolloutDate)
              ? 'Today'
              : isYesterday(featureRolloutDate)
              ? 'Yesterday'
              : formatDate(featureRolloutDate, 'PPPP'),
            items: [whatsNewArticle],
          };
        }
      }
    });

    setListValuesGrouped(whatsNewArticlesGroupedByDateTemp);
  }, [whatsNewArticles]);

  return (
    whatsNewArticlesGroupedByDate && (
      <>
        {Object.keys(whatsNewArticlesGroupedByDate).map(function (key) {
          return (
            <WhatsNewResultsListGroupWrapper key={key}>
              <WhatsNewResultsListGroupTitle>
                {whatsNewArticlesGroupedByDate[key].title}
              </WhatsNewResultsListGroupTitle>
              {whatsNewArticlesGroupedByDate[key].items.map(
                (whatsNewArticle: WhatsNewArticleItem, i: number) => (
                  <WhatsNewResultItem
                    styles={{
                      border:
                        style === 'secondary' ? `2px solid ${colors.N30}` : 0,
                      padding:
                        style === 'secondary'
                          ? `${gridSize()}px ${gridSize() * 2}px`
                          : `${gridSize()}px`,
                      marginBottom:
                        style === 'secondary' ? `${gridSize() * 1.5}px` : 0,
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
            </WhatsNewResultsListGroupWrapper>
          );
        })}
      </>
    )
  );
};

export default WhatsNewResultsList;
