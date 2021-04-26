import React from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';

import { messages } from '../../messages';
import { HelpPanelHeader } from '../../model/HelpLayout';

import CloseButton from './CloseButton';
import BackButton from './BackButton';
import { HeaderContainer, HeaderTitle, HeaderContent } from './styled';

export const HelpContent: React.FC<HelpPanelHeader & InjectedIntlProps> = ({
  headerTitle,
  headerContent,
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
        {headerTitle
          ? headerTitle
          : formatMessage(messages.help_panel_header_title)}
      </HeaderTitle>
      {onCloseButtonClick && <CloseButton onClick={onCloseButtonClick} />}
      {headerContent && <HeaderContent>{headerContent}</HeaderContent>}
    </HeaderContainer>
  );
};

export default injectIntl(HelpContent);
