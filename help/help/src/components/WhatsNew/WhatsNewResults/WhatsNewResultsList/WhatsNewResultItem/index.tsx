import React from 'react';
import {
  useAnalyticsEvents,
  UIAnalyticsEvent,
  AnalyticsContext,
} from '@atlaskit/analytics-next';
import { injectIntl, InjectedIntlProps } from 'react-intl';

import {
  name as packageName,
  version as packageVersion,
} from '../../../../../version.json';
import {
  WhatsNewArticleItem,
  WHATS_NEW_ITEM_TYPES,
} from '../../../../../model/WhatsNew';
import { getTypeIcon, getTypeTitle } from '../../../../../util';
import { WhatsNewTypeIcon } from '../../../../../util/styled';

import {
  WhatsNewResultListItemWrapper,
  WhatsNewResultListItemTitleContainer,
  WhatsNewResultListItemTitleText,
  WhatsNewResultListItemDescription,
} from './styled';

const ANALYTICS_CONTEXT_DATA = {
  componentName: 'ArticlesListItem',
  packageName,
  packageVersion,
};

interface Props {
  // Aditional Styles
  styles?: {};
  /* Function executed when the user clicks the related article */
  onClick?: (
    event: React.MouseEvent<HTMLElement>,
    analyticsEvent: UIAnalyticsEvent,
  ) => void;
}

export const WhatsNewResultListItem: React.FC<
  Props & Partial<WhatsNewArticleItem> & InjectedIntlProps
> = ({
  intl: { formatMessage },
  styles,
  title,
  type = WHATS_NEW_ITEM_TYPES.NEW_FEATURE,
  onClick,
}) => {
  const { createAnalyticsEvent } = useAnalyticsEvents();
  const typeTitle = type ? formatMessage(getTypeTitle(type)) : '';

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
    <WhatsNewResultListItemWrapper
      styles={styles}
      aria-disabled="false"
      role="button"
      onClick={handleOnClick}
    >
      <WhatsNewResultListItemTitleContainer>
        <WhatsNewTypeIcon type={type}>{getTypeIcon(type)}</WhatsNewTypeIcon>
        <WhatsNewResultListItemTitleText>
          {typeTitle}
        </WhatsNewResultListItemTitleText>
      </WhatsNewResultListItemTitleContainer>
      <WhatsNewResultListItemDescription>
        {title}
      </WhatsNewResultListItemDescription>
    </WhatsNewResultListItemWrapper>
  );
};

const WhatsNewResultListItemWithContext: React.FC<
  Props & Partial<WhatsNewArticleItem> & InjectedIntlProps
> = (props) => {
  return (
    <AnalyticsContext data={ANALYTICS_CONTEXT_DATA}>
      <WhatsNewResultListItem {...props} />
    </AnalyticsContext>
  );
};

export default injectIntl(WhatsNewResultListItemWithContext);
