import React, { useCallback, useEffect, useState } from 'react';
import HelpLayout from '@atlaskit/help-layout';
import UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';

import { HIDE_CONTENT_DELAY } from './constants';
import { useNavigationContext } from './contexts/navigationContext';
import { useHomeContext } from './contexts/homeContext';
import { useHeaderContext } from './contexts/headerContext';
import { useSearchContext } from './contexts/searchContext';
import SearchInput from './Search/SearchInput';
import SearchResults from './Search/SearchResults';
import ArticleComponent from './Article';
import WhatsNewButton from './WhatsNew/WhatsNewButton';
import WhatsNewResults from './WhatsNew/WhatsNewResults';
import HelpContentButton from './HelpContentButton';
import type { Props as HelpContentButtonProps } from './HelpContentButton';

import { HelpBodyContainer, HelpBody, Home } from './styled';

interface HelpContentInterface {
  footer?: React.ReactNode;
}

export const HelpContent: React.FC<HelpContentInterface> = ({ footer }) => {
  const { homeContent, homeOptions } = useHomeContext();
  const {
    isOverlayVisible,
    navigateBack,
    canNavigateBack,
    onClose,
  } = useNavigationContext();
  const { onSearch } = useSearchContext();
  const { onBackButtonClick } = useHeaderContext();

  const isOverlayVisibleValue = isOverlayVisible();
  const [isOverlayFullyVisible, setIsOverlayFullyVisible] = useState(
    isOverlayVisibleValue,
  );

  const handleOnBackButtonClick = useCallback(
    (
      event: React.MouseEvent<HTMLElement, MouseEvent>,
      analyticsEvent: UIAnalyticsEvent,
    ): void => {
      if (onBackButtonClick) {
        onBackButtonClick(event, analyticsEvent);
      }
      if (navigateBack) {
        navigateBack();
      }
    },
    [navigateBack, onBackButtonClick],
  );

  useEffect(() => {
    let handler: ReturnType<typeof setTimeout>;
    if (isOverlayVisibleValue) {
      handler = setTimeout(() => {
        setIsOverlayFullyVisible(isOverlayVisibleValue);
      }, HIDE_CONTENT_DELAY);
    } else {
      setIsOverlayFullyVisible(isOverlayVisibleValue);
    }

    return () => {
      if (handler) {
        clearTimeout(handler);
      }
    };
  }, [isOverlayVisibleValue]);

  return (
    <HelpLayout
      onBackButtonClick={handleOnBackButtonClick}
      onCloseButtonClick={onClose}
      isBackbuttonVisible={canNavigateBack()}
      footer={footer}
      headerContent={onSearch && <SearchInput />}
    >
      <HelpBodyContainer>
        <HelpBody>
          <SearchResults />
          <ArticleComponent />
          <Home
            isOverlayFullyVisible={isOverlayFullyVisible}
            isOverlayVisible={isOverlayVisibleValue}
          >
            {homeContent}
            {<WhatsNewButton />}
            {homeOptions &&
              homeOptions.map((defaultOption: HelpContentButtonProps) => {
                return (
                  <HelpContentButton
                    key={defaultOption.id}
                    {...defaultOption}
                  />
                );
              })}
          </Home>
        </HelpBody>
        <WhatsNewResults />
      </HelpBodyContainer>
    </HelpLayout>
  );
};

export default HelpContent;
