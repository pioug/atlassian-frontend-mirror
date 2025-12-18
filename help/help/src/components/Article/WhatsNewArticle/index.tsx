import React from 'react';
import { injectIntl, type WithIntlProps, type WrappedComponentProps } from 'react-intl-next';
import { BODY_FORMAT_TYPES } from '@atlaskit/help-article';
import HelpArticleContent from '@atlaskit/help-article';
import { token } from '@atlaskit/tokens';
import ShortcutIcon from '@atlaskit/icon/core/link-external';
import { AnalyticsContext } from '@atlaskit/analytics-next';
import Button from '@atlaskit/button';

import { messages } from '../../../messages';

import { type WhatsNewArticle as WhatsNewArticleType } from '../../../model/WhatsNew';
import { getTypeIcon, getTypeTitle } from '../../../util';
import { WhatsNewTypeIcon, DividerLine } from '../../../util/styled';

import Loading from './Loading';
import {
	WhatsNewTypeTitle,
	WhatsNewTitleText,
	WhatsNewIconContainer,
	RelatedLinkContainer,
	ExternalLinkIconContainer,
} from './styled';

const analyticsContextData = {
	componentName: 'ArticlesListItem',
	packageName: process.env._PACKAGE_NAME_,
	packageVersion: process.env._PACKAGE_VERSION_,
};

interface Props {
	article?: WhatsNewArticleType;
	isLoading?: boolean;
}

export const WhatsNewArticle: React.FC<Props & WrappedComponentProps> = ({
	intl: { formatMessage },
	article,
	isLoading,
}) => {
	if (isLoading) {
		return <Loading />;
	}

	if (article) {
		const typeTitle = article.type ? formatMessage(getTypeTitle(article.type)) : '';

		return (
			<>
				<WhatsNewIconContainer>
					<WhatsNewTypeIcon type={article.type}>{getTypeIcon(article.type)}</WhatsNewTypeIcon>
					<WhatsNewTypeTitle>{typeTitle}</WhatsNewTypeTitle>
				</WhatsNewIconContainer>
				<WhatsNewTitleText>{article.title}</WhatsNewTitleText>
				<HelpArticleContent
					body={article.description}
					bodyFormat={article.bodyFormat ? article.bodyFormat : BODY_FORMAT_TYPES.html}
				/>
				{(article.relatedExternalLinks || article.communityUrl) && (
					<>
						<DividerLine
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							style={{ marginTop: 0, marginBottom: token('space.200', '16px') }}
						/>
						{/* eslint-disable-next-line @atlassian/i18n/no-literal-string-in-jsx */}
						<WhatsNewTitleText>RELATED LINKS</WhatsNewTitleText>
						<AnalyticsContext
							data={{
								componentName: 'searchExternalUrl',
							}}
						>
							{article.relatedExternalLinks && (
								<RelatedLinkContainer>
									<Button
										appearance="link"
										spacing="none"
										href={article.relatedExternalLinks}
										target="_blank"
									>
										{formatMessage(messages.help_whats_new_related_link_support)}
									</Button>
									<ExternalLinkIconContainer>
										<ShortcutIcon color="currentColor" LEGACY_size="small" label="" />
									</ExternalLinkIconContainer>
								</RelatedLinkContainer>
							)}

							{article.communityUrl && (
								<RelatedLinkContainer>
									<Button
										appearance="link"
										spacing="none"
										href={article.communityUrl}
										target="_blank"
									>
										{formatMessage(messages.help_whats_new_related_link_community)}
									</Button>
									<ExternalLinkIconContainer>
										<ShortcutIcon color="currentColor" LEGACY_size="small" label="" />
									</ExternalLinkIconContainer>
								</RelatedLinkContainer>
							)}
						</AnalyticsContext>
					</>
				)}
			</>
		);
	}

	return null;
};

const WhatsNewArticleWithContext: React.FC<Props & WrappedComponentProps> = (props) => {
	return (
		<AnalyticsContext data={analyticsContextData}>
			<WhatsNewArticle {...props} />
		</AnalyticsContext>
	);
};

const _default_1: React.FC<WithIntlProps<Props & WrappedComponentProps>> & {
	WrappedComponent: React.ComponentType<Props & WrappedComponentProps>;
} = injectIntl(WhatsNewArticleWithContext);
export default _default_1;
