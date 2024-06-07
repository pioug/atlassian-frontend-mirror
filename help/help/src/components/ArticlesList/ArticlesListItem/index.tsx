import React from 'react';
import * as colors from '@atlaskit/theme/colors';
import {
	useAnalyticsEvents,
	type UIAnalyticsEvent,
	AnalyticsContext,
} from '@atlaskit/analytics-next';
import ShortcutIcon from '@atlaskit/icon/glyph/shortcut';
import { token } from '@atlaskit/tokens';
import { injectIntl, type WrappedComponentProps } from 'react-intl-next';

import { type ArticleItem } from '../../../model/Article';
import LikeIcon from '@atlaskit/icon/glyph/like';
import {
	ArticlesListItemWrapper,
	ArticlesListItemContainer,
	ArticlesListItemTitleText,
	ArticlesListItemDescription,
	ArticlesListItemLinkIcon,
	ArticlesListItemTrustFactor,
	ArticlesListItemViewCount,
	ArticlesListItemHelpfulCount,
	ArticlesListItemSource,
	ArticlesListItemLastModified,
	ArticlesListItemTitleSection,
} from './styled';

const ANALYTICS_CONTEXT_DATA = {
	componentName: 'ArticlesListItem',
	packageName: process.env._PACKAGE_NAME_,
	packageVersion: process.env._PACKAGE_VERSION_,
};

interface Props {
	styles?: {};
	/* Function executed when the user clicks the related article */
	onClick?: (event: React.MouseEvent<HTMLElement>, analyticsEvent: UIAnalyticsEvent) => void;
}

export const ArticlesListItem: React.FC<Props & Partial<ArticleItem> & WrappedComponentProps> = ({
	styles,
	title,
	description,
	href = '',
	onClick,
	trustFactors,
	source,
	lastPublished,
}) => {
	const { createAnalyticsEvent } = useAnalyticsEvents();

	const handleOnClick = (event: React.MouseEvent<HTMLElement>): void => {
		event.preventDefault();
		if (onClick) {
			const analyticsEvent: UIAnalyticsEvent = createAnalyticsEvent({
				action: 'clicked',
			});

			onClick(event, analyticsEvent);
		}
	};

	// Check if trust factors are available
	const isNumViewsVisible = trustFactors?.numViews != null;
	const isHelpfulCountVisible = trustFactors?.helpfulCount != null;
	const isTrustFactorVisible = isNumViewsVisible || isHelpfulCountVisible;
	// Check if source is available
	const isSourceVisible = source != null;

	const isLastPublishedVisible = lastPublished != null && lastPublished !== '';

	return (
		<ArticlesListItemWrapper
			styles={styles}
			aria-disabled="false"
			role="button"
			href={href}
			onClick={handleOnClick}
		>
			<ArticlesListItemContainer>
				<ArticlesListItemTitleSection>
					<ArticlesListItemTitleText>{title}</ArticlesListItemTitleText>
					{isLastPublishedVisible && (
						<ArticlesListItemLastModified>
							Last modified: {lastPublished}
						</ArticlesListItemLastModified>
					)}
				</ArticlesListItemTitleSection>
				{href && (
					<ArticlesListItemLinkIcon>
						<ShortcutIcon
							size="small"
							label=""
							primaryColor={token('color.icon.subtle', colors.N90)}
							secondaryColor={token('color.icon.subtle', colors.N90)}
						/>
					</ArticlesListItemLinkIcon>
				)}
			</ArticlesListItemContainer>

			<ArticlesListItemDescription>{description}</ArticlesListItemDescription>
			{isSourceVisible && <ArticlesListItemSource>{source}</ArticlesListItemSource>}
			{isTrustFactorVisible && (
				<ArticlesListItemTrustFactor>
					{isNumViewsVisible && (
						<ArticlesListItemViewCount>{trustFactors.numViews} views</ArticlesListItemViewCount>
					)}
					{isHelpfulCountVisible && (
						<ArticlesListItemHelpfulCount>
							<LikeIcon label="Like" size="small" />
							{trustFactors.helpfulCount}
						</ArticlesListItemHelpfulCount>
					)}
				</ArticlesListItemTrustFactor>
			)}
		</ArticlesListItemWrapper>
	);
};

const ArticlesListItemWithContext: React.FC<
	Props & Partial<ArticleItem> & WrappedComponentProps
> = (props) => {
	return (
		<AnalyticsContext data={ANALYTICS_CONTEXT_DATA}>
			<ArticlesListItem {...props} />
		</AnalyticsContext>
	);
};

export default injectIntl(ArticlesListItemWithContext);
