import React, { useState, useEffect, useCallback } from 'react';
import {
  UIAnalyticsEvent,
  withAnalyticsContext,
} from '@atlaskit/analytics-next';
import SectionMessage from '@atlaskit/section-message';
import Button from '@atlaskit/button/custom-theme-button';
import { injectIntl, InjectedIntlProps } from 'react-intl';

import {
  name as packageName,
  version as packageVersion,
} from '../../version.json';
import { messages } from '../../messages';
import { ArticleItem } from '../../model/Article';

import ArticlesList from '../ArticlesList';

import RelatedArticlesLoading from './RelatedArticlesLoading';
import { DividerLine } from '../../util/styled';
import { RelatedArticlesTitle } from './styled';
import useCancellablePromise from '../../util/hooks/cancellablePromise';
import { usePrevious } from '../../util/hooks/previous';

export interface Props {
  // Style. This component has two different styles (primary and secondary)
  style?: 'primary' | 'secondary';
  // routeGroup used to get the related articles. This prop is optional.
  routeGroup?: string;
  // routeName used to get the related articles. This prop is optional.
  routeName?: string;
  // Function used to get related articles. This prop is optional, if is not defined the related articles will not be displayed
  onGetRelatedArticles?(
    routeGroup?: string,
    routeName?: string,
  ): Promise<ArticleItem[]>;
  /* Function executed when the user clicks on of the related articles */
  onRelatedArticlesListItemClick?: (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    analyticsEvent: UIAnalyticsEvent,
    articleData: ArticleItem,
  ) => void;
  /* Function executed when the user clicks "Show More" */
  onRelatedArticlesShowMoreClick?: (
    event: React.MouseEvent<HTMLElement>,
    analyticsEvent: UIAnalyticsEvent,
    isCollapsed: boolean,
  ) => void;
}

export const RelatedArticles: React.FC<Props & InjectedIntlProps> = ({
  style = 'primary',
  routeGroup,
  routeName,
  onGetRelatedArticles,
  onRelatedArticlesListItemClick,
  onRelatedArticlesShowMoreClick,
  intl: { formatMessage },
}) => {
  const { cancellablePromise } = useCancellablePromise();
  const [relatedArticles, setRelatedArticles] = useState<ArticleItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const prevRouteGroup = usePrevious(routeGroup);
  const prevRouteName = usePrevious(routeName);

  const handleOnRelatedArticlesShowMoreClick = (
    event: React.MouseEvent<HTMLElement>,
    analyticsEvent: UIAnalyticsEvent,
    isCollapsed: boolean,
  ) => {
    analyticsEvent.payload.attributes = {
      componentName: 'RelatedArticles',
      packageName,
      packageVersion,
    };
    if (onRelatedArticlesShowMoreClick) {
      onRelatedArticlesShowMoreClick(event, analyticsEvent, isCollapsed);
    }
  };

  const updateRelatedArticles = useCallback(async () => {
    if (onGetRelatedArticles) {
      try {
        const relatedArticles: ArticleItem[] = await cancellablePromise(
          onGetRelatedArticles(routeGroup, routeName),
        );
        setRelatedArticles(relatedArticles);
        setIsLoading(false);
        setHasError(false);
      } catch (error) {
        setHasError(true);
      }
    } else {
      setIsLoading(false);
      setHasError(false);
    }
  }, [cancellablePromise, onGetRelatedArticles, routeGroup, routeName]);

  useEffect(() => {
    if (routeGroup !== prevRouteGroup || routeName !== prevRouteName) {
      updateRelatedArticles();
    }
  }, [
    prevRouteGroup,
    prevRouteName,
    routeGroup,
    routeName,
    updateRelatedArticles,
  ]);

  if (hasError) {
    return (
      <SectionMessage appearance="warning">
        <p>
          <strong>
            {formatMessage(messages.help_related_article_endpoint_error_title)}
          </strong>
        </p>
        <p>
          {formatMessage(
            messages.help_related_article_endpoint_error_description,
          )}
        </p>
        <p>
          <Button
            appearance="link"
            spacing="compact"
            css={{ padding: '0', '& span': { margin: '0' } }}
            onClick={updateRelatedArticles}
          >
            {formatMessage(
              messages.help_related_article_endpoint_error_button_label,
            )}
          </Button>
        </p>
      </SectionMessage>
    );
  } else {
    return (
      <>
        {style === 'secondary' && relatedArticles.length > 0 && (
          <>
            <DividerLine />
            <RelatedArticlesTitle>
              {formatMessage(messages.help_related_article_title)}
            </RelatedArticlesTitle>
          </>
        )}
        {isLoading ? (
          <RelatedArticlesLoading />
        ) : (
          <ArticlesList
            style={style}
            articles={relatedArticles}
            onArticlesListItemClick={onRelatedArticlesListItemClick}
            onToggleArticlesList={handleOnRelatedArticlesShowMoreClick}
          />
        )}
      </>
    );
  }
};

export default withAnalyticsContext({
  componentName: 'RelatedArticles',
  packageName,
  packageVersion,
})(injectIntl(RelatedArticles));
