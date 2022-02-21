import React from 'react';
import * as colors from '@atlaskit/theme/colors';
import {
  useAnalyticsEvents,
  UIAnalyticsEvent,
  AnalyticsContext,
} from '@atlaskit/analytics-next';
import ShortcutIcon from '@atlaskit/icon/glyph/shortcut';
import { token } from '@atlaskit/tokens';
import { injectIntl, WrappedComponentProps } from 'react-intl-next';

import {
  name as packageName,
  version as packageVersion,
} from '../../../version.json';
import { ArticleItem, ARTICLE_ITEM_TYPES } from '../../../model/Article';
// import { messages } from '../../../messages';

import {
  ArticlesListItemTypeTitle,
  ArticlesListItemWrapper,
  ArticlesListItemContainer,
  ArticlesListItemTitleText,
  ArticlesListItemDescription,
  ArticlesListItemLinkIcon,
} from './styled';

const ANALYTICS_CONTEXT_DATA = {
  componentName: 'ArticlesListItem',
  packageName,
  packageVersion,
};

interface Props {
  styles?: {};
  /* Function executed when the user clicks the related article */
  onClick?: (
    event: React.MouseEvent<HTMLElement>,
    analyticsEvent: UIAnalyticsEvent,
  ) => void;
}

export const getTypeTitle = (itemType?: ARTICLE_ITEM_TYPES) => {
  switch (itemType) {
    // case ARTICLE_ITEM_TYPES.topicInProduct:
    //   return messages.help_article_list_item_type_help_article;
    default:
      return null;
  }
};

export const ArticlesListItem: React.FC<
  Props & Partial<ArticleItem> & WrappedComponentProps
> = ({
  intl: { formatMessage },
  styles,
  title,
  description,
  href = '',
  type,
  onClick,
}) => {
  const { createAnalyticsEvent } = useAnalyticsEvents();
  const typeTitle = getTypeTitle(type);

  const handleOnClick = (event: React.MouseEvent<HTMLElement>): void => {
    event.preventDefault();
    if (onClick) {
      const analyticsEvent: UIAnalyticsEvent = createAnalyticsEvent({
        action: 'clicked',
      });

      onClick(event, analyticsEvent);
    }
  };

  return (
    <ArticlesListItemWrapper
      styles={styles}
      aria-disabled="false"
      role="button"
      href={href}
      onClick={handleOnClick}
    >
      <ArticlesListItemContainer>
        {typeTitle && (
          <ArticlesListItemTypeTitle>
            {formatMessage(typeTitle)}
          </ArticlesListItemTypeTitle>
        )}
        <ArticlesListItemTitleText>{title}</ArticlesListItemTitleText>
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
