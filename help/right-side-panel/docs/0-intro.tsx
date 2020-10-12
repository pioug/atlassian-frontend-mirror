import React from 'react';
import {
  md,
  code,
  Props,
  AtlassianInternalWarning,
  DevPreviewWarning,
} from '@atlaskit/docs';
import Button from '@atlaskit/button/custom-theme-button';
import { gridSize } from '@atlaskit/theme/constants';

export default md`
  ${(
    <>
      <div style={{ marginBottom: '0.5rem' }}>
        <AtlassianInternalWarning />
      </div>
      <div style={{ marginTop: '0.5rem' }}>
        <DevPreviewWarning />
      </div>
    </>
  )}

  ## Usage

  ${code`
  import React from 'react';
  import Button, { ButtonGroup } from '@atlaskit/button';
  import Page from '@atlaskit/page';

  import { ButtonsWrapper, TextWrapper } from './utils/styled';

  import { RightSidePanel, FlexContainer, ContentWrapper } from '../src';

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
  `}

  ${(
    <div style={{ paddingTop: `${gridSize() * 2}px` }}>
      <Button
        onClick={() =>
          window.open(
            '/examples/help/right-side-panel/0-Right-Side-Panel',
            '_self',
          )
        }
      >
        Open Example
      </Button>
    </div>
  )}

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/components/RightSidePanel/index')}
    />
  )}
`;
