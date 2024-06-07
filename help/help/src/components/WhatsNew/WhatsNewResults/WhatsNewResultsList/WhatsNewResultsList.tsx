import React, { useEffect, useState } from 'react';
import { type UIAnalyticsEvent } from '@atlaskit/analytics-next';
import * as colors from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import toDate from 'date-fns/toDate';
import isYesterday from 'date-fns/isYesterday';
import isToday from 'date-fns/isToday';
import formatDate from 'date-fns/format';

import { type WhatsNewArticleItem } from '../../../../model/WhatsNew';

import WhatsNewResultItem from './WhatsNewResultItem';
import { type WhatsNewResultsList as WhatsNewResultsListInterface } from './model/WhatsNewResultsList';
import { WhatsNewResultsListGroupTitle, WhatsNewResultsListGroupWrapper } from './styled';

export interface Props {
	/* Number of "What's new" articles to diplay. This prop is optional (default value is 5) */
	numberOfWhatsNewArticlesToDisplay?: number;
}
const WhatsNewResultsList: React.FC<Partial<WhatsNewResultsListInterface> & Props> = ({
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
				const featureRolloutDateArray = featureRolloutDateString.replace('/-/g', '/');
				const featureRolloutDate = toDate(new Date(featureRolloutDateArray));

				if (whatsNewArticlesGroupedByDateTemp[featureRolloutDateString]) {
					whatsNewArticlesGroupedByDateTemp[featureRolloutDateString].items.push(whatsNewArticle);
				} else {
					whatsNewArticlesGroupedByDateTemp[featureRolloutDateString] = {
						title: isToday(featureRolloutDate)
							? 'Today'
							: isYesterday(featureRolloutDate)
								? 'Yesterday'
								: formatDate(featureRolloutDate, 'EEEE, MMMM dd, yyyy'),
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
												style === 'secondary'
													? `2px solid ${token('color.border', colors.N30)}`
													: 0,
											padding:
												style === 'secondary'
													? `${token('space.100', '8px')} ${token('space.200', '16px')}`
													: `${token('space.100', '8px')}`,
											marginBottom: style === 'secondary' ? `${token('space.150', '12px')}` : 0,
										}}
										id={whatsNewArticle.id}
										onClick={(
											event: React.MouseEvent<HTMLElement>,
											analyticsEvent: UIAnalyticsEvent,
										) => {
											if (onWhatsNewResultItemClick) {
												onWhatsNewResultItemClick(event, analyticsEvent, whatsNewArticle);
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
