import React from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';

import { messages } from '../../messages';
import { HelpPanelHeader } from '../../model/HelpLayout';

import CloseButton from './CloseButton';
import BackButton from './BackButton';
import { HeaderContainer, HeaderTitle } from './styled';

export const HelpContent: React.FC<HelpPanelHeader & InjectedIntlProps> = ({
  title,
  isBackbuttonVisible = false,
  onCloseButtonClick,
  onBackButtonClick,
  intl: { formatMessage },
}) => {
  const handleOnBackButtonClick = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    analyticsEvent: UIAnalyticsEvent,
  ): void => {
    if (onBackButtonClick) {
      onBackButtonClick(event, analyticsEvent);
    }
  };

  return (
    <HeaderContainer>
      <BackButton
        onClick={handleOnBackButtonClick}
        isVisible={isBackbuttonVisible}
      />
      <HeaderTitle>
        {title ? title : formatMessage(messages.help_panel_header_title)}
      </HeaderTitle>
      {onCloseButtonClick && <CloseButton onClick={onCloseButtonClick} />}
    </HeaderContainer>
  );
};

export default injectIntl(HelpContent);
