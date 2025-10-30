import React from 'react';
import { type UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { N30 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, xcss } from '@atlaskit/primitives';

import { type ArticleItem } from '../../model/Article';

import ArticlesListItem from './ArticlesListItem';
import { type ArticlesList as ArticlesListInterface } from './model/ArticlesListItem';
import { MIN_ITEMS_TO_DISPLAY } from './constants';

export interface Props {
	/* Number of articles to display. This prop is optional (default value is 5) */
	numberOfArticlesToDisplay?: number;
}

const listStyles = xcss({
	listStyle: 'none',
});

const getStyles = (style: string) => {
	if (style === 'secondary') {
		return {
			border: `${token('border.width.selected')} solid ${token('color.border', N30)}`,
			padding: token('space.200', '16px'),
			marginBottom: token('space.150', '12px'),
		};
	}
	return {
		border: 0,
		padding: token('space.150', '12px'),
		marginBottom: 0,
	};
};

const articlesList: React.FC<Partial<ArticlesListInterface> & Props> = ({
	style = 'primary',
	articles = [],
	minItemsToDisplay = MIN_ITEMS_TO_DISPLAY,
	numberOfArticlesToDisplay = MIN_ITEMS_TO_DISPLAY,
	onArticlesListItemClick,
}) => {
	const isExpanded = numberOfArticlesToDisplay > minItemsToDisplay;

	return articles ? (
		<Box as="ul" padding="space.0" role="list">
			{articles.slice(0, numberOfArticlesToDisplay).map((article: ArticleItem, index: number) => {
				const isVisible = index < minItemsToDisplay || isExpanded;
				return (
					<Box
						as="li"
						xcss={listStyles}
						key={article.id}
						style={{
							display: isVisible ? 'block' : 'none',
						}}
					>
						<ArticlesListItem
							styles={getStyles(style)}
							id={article.id}
							onClick={(event: React.MouseEvent<HTMLElement>, analyticsEvent: UIAnalyticsEvent) => {
								if (onArticlesListItemClick) {
									onArticlesListItemClick(event, analyticsEvent, article);
								}
							}}
							title={article.title}
							description={article.description}
							href={article.href}
							trustFactors={article.trustFactors}
							source={article.source}
							lastPublished={article.lastPublished}
						/>
					</Box>
				);
			})}
		</Box>
	) : null;
};

export default articlesList;
