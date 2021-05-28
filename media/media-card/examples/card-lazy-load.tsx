import React from 'react';
import styled from 'styled-components';
import {
  createStorybookMediaClientConfig,
  genericFileId,
} from '@atlaskit/media-test-helpers';
import { Card } from '../src';
import { MainWrapper } from '../example-helpers';

const dimensions = { width: 500, height: 400 };

const CardWrapper = styled.div`
  width: ${dimensions.width}px;
  margin: auto;
`;
const DummyContent: React.ComponentClass<React.HTMLAttributes<{}>> = styled.div`
  height: 300vh;
`;

const mediaClientConfig = createStorybookMediaClientConfig();

class Example extends React.Component<{}, {}> {
  render() {
    return (
      <MainWrapper>
        <DummyContent>
          <h3>Scroll down to see Card loading once it hits the viewport</h3>
        </DummyContent>
        <CardWrapper>
          <Card
            mediaClientConfig={mediaClientConfig}
            identifier={genericFileId}
            disableOverlay={true}
            dimensions={dimensions}
          />
        </CardWrapper>
      </MainWrapper>
    );
  }
}

export default () => <Example />;
