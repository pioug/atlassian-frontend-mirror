import React, { forwardRef } from 'react';
import * as colors from '@atlaskit/theme/colors';
import {
	useAnalyticsEvents,
	type UIAnalyticsEvent,
	AnalyticsContext,
} from '@atlaskit/analytics-next';
import ShortcutIcon from '@atlaskit/icon/core/link-external';
import { token } from '@atlaskit/tokens';
import { injectIntl, type WrappedComponentProps } from 'react-intl-next';

import { type ArticleItem } from '../../../model/Article';
import LikeIcon from '@atlaskit/icon/core/thumbs-up';
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
	ArticlesListItemDescriptionHighlight,
} from './styled';

const ANALYTICS_CONTEXT_DATA = {
	componentName: 'ArticlesListItem',
	packageName: process.env._PACKAGE_NAME_,
	packageVersion: process.env._PACKAGE_VERSION_,
};

interface Props {
	/* Function executed when the user clicks the related article */
	onClick?: (event: React.MouseEvent<HTMLElement>, analyticsEvent: UIAnalyticsEvent) => void;
	styles?: {};
}

type ArticlesListItemProps = Props & Partial<ArticleItem> & WrappedComponentProps;

const highlightText = (text?: string) => {
	if (!text) {
		return;
	}

	const html = new DOMParser().parseFromString(text, 'text/html').body.childNodes;
	const sections: (string | JSX.Element | null)[] = [];

	html.forEach((node, i) => {
		if (node.nodeName === 'SPAN') {
			sections.push(
				<b>
					<ArticlesListItemDescriptionHighlight key={i}>
						{node.textContent}
					</ArticlesListItemDescriptionHighlight>
				</b>,
			);
		} else {
			sections.push(node.textContent);
		}
	});

	return sections;
};

export const ArticlesListItem = forwardRef<HTMLAnchorElement, ArticlesListItemProps>(
	(
		{ styles, title, description, href = '', onClick, trustFactors, source, lastPublished },
		ref,
	) => {
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
				ref={ref}
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
							// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-jsx
							<ArticlesListItemLastModified>
								Last modified: {lastPublished}
							</ArticlesListItemLastModified>
						)}
					</ArticlesListItemTitleSection>
					{href && (
						<ArticlesListItemLinkIcon>
							<ShortcutIcon
								LEGACY_size="small"
								label="Opens in a new window"
								color={token('color.icon.subtle', colors.N90)}
							/>
						</ArticlesListItemLinkIcon>
					)}
				</ArticlesListItemContainer>

				<ArticlesListItemDescription>{highlightText(description)}</ArticlesListItemDescription>
				{isSourceVisible && <ArticlesListItemSource>{source}</ArticlesListItemSource>}
				{isTrustFactorVisible && (
					<ArticlesListItemTrustFactor>
						{isNumViewsVisible && (
							// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-jsx
							<ArticlesListItemViewCount>{trustFactors.numViews} views</ArticlesListItemViewCount>
						)}
						{isHelpfulCountVisible && (
							<ArticlesListItemHelpfulCount>
								<LikeIcon color="currentColor" label="Like" />
								{trustFactors.helpfulCount}
							</ArticlesListItemHelpfulCount>
						)}
					</ArticlesListItemTrustFactor>
				)}
			</ArticlesListItemWrapper>
		);
	},
);

const ArticlesListItemWithContext = forwardRef<HTMLAnchorElement, ArticlesListItemProps>(
	(props, ref) => {
		return (
			<AnalyticsContext data={ANALYTICS_CONTEXT_DATA}>
				<ArticlesListItem ref={ref} {...props} />
			</AnalyticsContext>
		);
	},
);

const _default_1 = injectIntl(ArticlesListItemWithContext, { forwardRef: true });
export default _default_1;
