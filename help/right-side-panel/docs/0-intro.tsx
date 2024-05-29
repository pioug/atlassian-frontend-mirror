import React from 'react';
import { md, code, Props, AtlassianInternalWarning } from '@atlaskit/docs';
import Button from '@atlaskit/button/custom-theme-button';
import { token } from '@atlaskit/tokens';

export default md`
  ${(
    <>
{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
      <div style={{ marginBottom: token('space.100', '0.5rem') }}>
        <AtlassianInternalWarning />
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
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
    <div style={{ paddingTop: token('space.200', '16px') }}>
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
