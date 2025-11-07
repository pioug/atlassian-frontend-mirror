import React from 'react';
import { injectIntl, type WithIntlProps, type WrappedComponentProps } from 'react-intl-next';

import { messages } from '../../messages';

import { DividerLine, LoadingRectangle } from '../../util/styled';

import { LoadingRelatedArticleList, LoadingRelatedArticleListItem } from './styled';

const RelatedArticlesLoading: React.FC<WrappedComponentProps> = ({ intl: { formatMessage } }) => {
	return (
		<>
			<LoadingRelatedArticleList aria-label={formatMessage(messages.help_loading)} role="img">
				<LoadingRelatedArticleListItem>
					<LoadingRectangle contentHeight="11px" contentWidth="60px" marginTop="0" />
					<LoadingRectangle contentWidth="100%" marginTop="4px" />
					<LoadingRectangle contentWidth="100%" marginTop="8px" />
					<LoadingRectangle contentWidth="100%" marginTop="4px" />
					<LoadingRectangle contentWidth="100%" marginTop="4px" />
				</LoadingRelatedArticleListItem>

				<LoadingRelatedArticleListItem>
					<LoadingRectangle contentHeight="11px" contentWidth="60px" marginTop="0" />
					<LoadingRectangle contentWidth="100%" marginTop="4px" />
					<LoadingRectangle contentWidth="100%" marginTop="8px" />
					<LoadingRectangle contentWidth="100%" marginTop="4px" />
					<LoadingRectangle contentWidth="100%" marginTop="4px" />
				</LoadingRelatedArticleListItem>

				<LoadingRelatedArticleListItem>
					<LoadingRectangle contentHeight="11px" contentWidth="60px" marginTop="0" />
					<LoadingRectangle contentWidth="100%" marginTop="4px" />
					<LoadingRectangle contentWidth="100%" marginTop="8px" />
					<LoadingRectangle contentWidth="100%" marginTop="4px" />
					<LoadingRectangle contentWidth="100%" marginTop="4px" />
				</LoadingRelatedArticleListItem>
				<DividerLine />
			</LoadingRelatedArticleList>
		</>
	);
};

const _default_1: React.FC<WithIntlProps<WrappedComponentProps>> & {
	WrappedComponent: React.ComponentType<WrappedComponentProps>;
} = injectIntl(RelatedArticlesLoading);
export default _default_1;
