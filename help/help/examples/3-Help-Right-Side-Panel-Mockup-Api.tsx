import React, { useState } from 'react';
import { AnalyticsListener, UIAnalyticsEvent } from '@atlaskit/analytics-next';
import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/standard-button';
import Page from '@atlaskit/page';
import {
  RightSidePanel,
  FlexContainer,
  ContentWrapper,
} from '@atlaskit/right-side-panel';

import LocaleIntlProvider from '../example-helpers/LocaleIntlProvider';
import Help from '../src';

import { getArticle } from './utils/mockData';
import {
  ControlsWrapper,
  FooterContent,
  ExampleDefaultContent,
} from './utils/styled';

const handleEvent = (analyticsEvent: { payload: any; context: any }) => {
  const { payload, context } = analyticsEvent;
  console.log('Received event:', { payload, context });
};

const Example: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [articleId, setArticleId] = useState<string>();

  const onGetArticle = (articleId: string): Promise<any> => {
    return new Promise(resolve => resolve(getArticle(articleId)));
  };

  const openDrawer = (articleId: string = '') => {
    setIsOpen(true);
    setArticleId(articleId);
  };

  const closeDrawer = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    analyticsEvent: UIAnalyticsEvent,
  ): void => {
    console.log(event);
    console.log(analyticsEvent);
    setIsOpen(false);
  };
  const articleWasHelpfulNoButtonClick = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    analyticsEvent: UIAnalyticsEvent,
  ): void => {
    event.preventDefault();
    analyticsEvent.fire('help');
  };

  const articleWasHelpfulYesButtonClick = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    analyticsEvent: UIAnalyticsEvent,
  ): void => {
    event.preventDefault();
    analyticsEvent.fire('help');
  };

  const articleIdSetter = (id: string): void => {
    setArticleId(id);
  };

  return (
    <AnalyticsListener channel="help" onEvent={handleEvent}>
      <FlexContainer id="helpExample">
        <ContentWrapper>
          <Page>
            <ControlsWrapper>
              <ButtonGroup>
                <Button type="button" onClick={() => openDrawer()}>
                  Open drawer - default content
                </Button>

                <Button type="button" onClick={() => openDrawer('00')}>
                  Open drawer - Article 00
                </Button>

                <Button type="button" onClick={() => openDrawer('01')}>
                  Open drawer - Article 01
                </Button>

                <Button type="button" onClick={() => openDrawer('02')}>
                  Open drawer - Article 02
                </Button>

                <Button type="button" onClick={closeDrawer}>
                  Close drawer
                </Button>
              </ButtonGroup>
            </ControlsWrapper>
            <RightSidePanel isOpen={isOpen} attachPanelTo="helpExample">
              <LocaleIntlProvider locale={'en'}>
                <Help
                  articleIdSetter={articleIdSetter}
                  onCloseButtonClick={closeDrawer}
                  articleId={articleId}
                  onGetArticle={onGetArticle}
                  onWasHelpfulYesButtonClick={articleWasHelpfulYesButtonClick}
                  onWasHelpfulNoButtonClick={articleWasHelpfulNoButtonClick}
                  footer={
                    <FooterContent>
                      <span>Footer</span>
                    </FooterContent>
                  }
                >
                  <ExampleDefaultContent>
                    <span>Default content</span>
                  </ExampleDefaultContent>
                </Help>
              </LocaleIntlProvider>
            </RightSidePanel>
          </Page>
        </ContentWrapper>
      </FlexContainer>
    </AnalyticsListener>
  );
};

export default Example;
