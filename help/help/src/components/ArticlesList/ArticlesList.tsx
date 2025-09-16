import React from 'react';
import { type UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { N30 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import AnimateHeight from 'react-animate-height';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, xcss } from '@atlaskit/primitives';

import { type ArticleItem } from '../../model/Article';

import ArticlesListItem from './ArticlesListItem';
import { type ArticlesList as ArticlesListInterface } from './model/ArticlesListItem';
import { MIN_ITEMS_TO_DISPLAY, ANIMATE_HEIGHT_TRANSITION_DURATION_MS } from './constants';

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
}) =>
	articles && (
		<>
			<Box as="ul" padding="space.0">
				{articles.slice(0, minItemsToDisplay).map((article: ArticleItem) => {
					return (
						<Box as="li" xcss={listStyles}>
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
						</Box>
					);
				})}
			</Box>
			<AnimateHeight
				duration={ANIMATE_HEIGHT_TRANSITION_DURATION_MS}
				easing="linear"
				height={numberOfArticlesToDisplay > minItemsToDisplay ? 'auto' : 0}
			>
				<Box as="ul" padding="space.0">
					{articles.slice(minItemsToDisplay, articles.length).map((article: ArticleItem) => (
						<Box as="li" xcss={listStyles}>
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
						</Box>
					))}
				</Box>
			</AnimateHeight>
		</>
	);

export default articlesList;
