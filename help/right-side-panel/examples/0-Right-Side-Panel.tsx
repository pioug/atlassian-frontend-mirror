import React from 'react';
import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/standard-button';
import Page from '@atlaskit/page';

import { ButtonsWrapper, TextWrapper } from './utils/styled';

import { RightSidePanel, FlexContainer, ContentWrapper } from '../src';

// eslint-disable-next-line import/no-anonymous-default-export
export default class extends React.Component {
  state = {
    isOpen: false,
  };

  openDrawer = () => {
    this.setState({
      isOpen: true,
    });
  };

  closeDrawer = () =>
    this.setState({
      isOpen: false,
    });

  render() {
    const { isOpen } = this.state;
    return (
      <FlexContainer id="RightSidePanelExample">
        <ContentWrapper>
          <Page>
            <ButtonsWrapper>
              <ButtonGroup>
                <Button type="button" onClick={this.openDrawer}>
                  Open drawer
                </Button>

                <Button type="button" onClick={this.closeDrawer}>
                  Close drawer
                </Button>
              </ButtonGroup>
            </ButtonsWrapper>
          </Page>
          <RightSidePanel isOpen={isOpen} attachPanelTo="RightSidePanelExample">
            <TextWrapper>
              <h1>Right Side Panel content</h1>
            </TextWrapper>
          </RightSidePanel>
        </ContentWrapper>
      </FlexContainer>
    );
  }
}
