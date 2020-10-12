import React from 'react';
import HelpLayout from '@atlaskit/help-layout';
import UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';

import { useHelpContext } from './HelpContext';
import SearchInput from './Search/SearchInput';
import SearchResults from './Search/SearchResults';
import ArticleComponent from './Article';

import { HelpBodyContainer, HelpBody, DefaultContent } from './styled';

export const HelpContent: React.FC = () => {
  const {
    help: {
      footer,
      isSearchVisible,
      searchResultsVisible,
      articleFullyVisible,
      isArticleVisible,
      defaultContent,
      onBackButtonClick,
      navigateBack,
      isBackbuttonVisible,
      onCloseButtonClick,
    },
  } = useHelpContext();

  const handleOnBackButtonClick = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    analyticsEvent: UIAnalyticsEvent,
  ): void => {
    if (onBackButtonClick) {
      onBackButtonClick(event, analyticsEvent);
    }
    if (navigateBack) {
      navigateBack();
    }
  };

  return (
    <HelpLayout
      onBackButtonClick={handleOnBackButtonClick}
      onCloseButtonClick={onCloseButtonClick}
      isBackbuttonVisible={isBackbuttonVisible()}
      footer={footer}
    >
      <HelpBodyContainer>
        {isSearchVisible() && <SearchInput />}
        <HelpBody>
          <SearchResults />
          {!searchResultsVisible && (
            <>
              <ArticleComponent />
              <DefaultContent
                isArticleFullyVisible={articleFullyVisible}
                isArticleVisible={isArticleVisible()}
              >
                {defaultContent}
              </DefaultContent>
            </>
          )}
        </HelpBody>
      </HelpBodyContainer>
    </HelpLayout>
  );
};

export default HelpContent;
