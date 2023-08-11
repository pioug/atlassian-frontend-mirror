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

import { ArticleItem } from '../../../model/Article';

import {
  ArticlesListItemWrapper,
  ArticlesListItemContainer,
  ArticlesListItemTitleText,
  ArticlesListItemDescription,
  ArticlesListItemLinkIcon,
} from './styled';

const ANALYTICS_CONTEXT_DATA = {
  componentName: 'ArticlesListItem',
  packageName: process.env._PACKAGE_NAME_,
  packageVersion: process.env._PACKAGE_VERSION_,
};

interface Props {
  styles?: {};
  /* Function executed when the user clicks the related article */
  onClick?: (
    event: React.MouseEvent<HTMLElement>,
    analyticsEvent: UIAnalyticsEvent,
  ) => void;
}

export const ArticlesListItem: React.FC<
  Props & Partial<ArticleItem> & WrappedComponentProps
> = ({ styles, title, description, href = '', onClick }) => {
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

  return (
    <ArticlesListItemWrapper
      styles={styles}
      aria-disabled="false"
      role="button"
      href={href}
      onClick={handleOnClick}
    >
      <ArticlesListItemContainer>
        <ArticlesListItemTitleText>
          {title}
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
        </ArticlesListItemTitleText>
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
