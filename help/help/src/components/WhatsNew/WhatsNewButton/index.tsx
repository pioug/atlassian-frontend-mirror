import React, { useCallback } from 'react';
import { UIAnalyticsEvent, AnalyticsContext } from '@atlaskit/analytics-next';
import * as colors from '@atlaskit/theme/colors';
import LightbulbIcon from '@atlaskit/icon/glyph/lightbulb';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import {
  name as packageName,
  version as packageVersion,
} from '../../../version.json';

import { useWhatsNewArticleContext } from '../../contexts/whatsNewArticleContext';
import { useNavigationContext } from '../../contexts/navigationContext';
import { messages } from '../../../messages';
import HelpContentButton from '../../HelpContentButton';
import { ARTICLE_TYPE } from '../../../model/Help';

const ANALYTICS_CONTEXT_DATA = {
  componentName: 'WhatsNewButton',
  packageName,
  packageVersion,
};

export const WhatsNewButton: React.FC<InjectedIntlProps> = ({
  intl: { formatMessage },
}) => {
  const {
    onWhatsNewButtonClick,
    whatsNewGetNotificationProvider,
  } = useWhatsNewArticleContext();
  const { setArticleId } = useNavigationContext();

  const handleOnButtonClick = useCallback(
    (
      id: string,
      analytics: UIAnalyticsEvent,
      event: React.MouseEvent<HTMLElement, MouseEvent>,
    ): void => {
      if (onWhatsNewButtonClick) {
        onWhatsNewButtonClick(event, analytics);
      }

      if (setArticleId) {
        setArticleId({ id: '', type: ARTICLE_TYPE.WHATS_NEW });
      }
    },
    [onWhatsNewButtonClick, setArticleId],
  );

  return (
    <HelpContentButton
      id="whats-new"
      key="whats-new"
      notificationLogProvider={whatsNewGetNotificationProvider}
      onClick={handleOnButtonClick}
      text={formatMessage(messages.help_whats_new_button_label)}
      icon={<LightbulbIcon primaryColor={colors.N600} size="medium" label="" />}
    />
  );
};

const WhatsNewButtonWithContext: React.FC<InjectedIntlProps> = (props) => {
  return (
    <AnalyticsContext data={ANALYTICS_CONTEXT_DATA}>
      <WhatsNewButton {...props} />
    </AnalyticsContext>
  );
};

export default injectIntl(WhatsNewButtonWithContext);
