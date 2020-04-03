import React from 'react';
import scrollParent from 'scrollparent';
import styled from 'styled-components';
import {
  createStorybookMediaClientConfig,
  genericFileId,
} from '@atlaskit/media-test-helpers';
import { Card } from '../src';

const GradientBackground: React.ComponentClass<React.HTMLAttributes<{}>> = styled.div`
  background: linear-gradient(
    to bottom,
    rgba(226, 226, 226, 1) 0%,
    rgba(254, 254, 254, 1) 100%
  );
`;

const DummyContent: React.ComponentClass<React.HTMLAttributes<{}>> = styled.div`
  height: 125vh;
`;

const mediaClientConfig = createStorybookMediaClientConfig();

class Example extends React.Component<{}, {}> {
  handleMount = (el: any) => {
    if (el) {
      const parent = scrollParent(el);
      parent.scrollTo(0, 9999);
    }
  };

  render() {
    return (
      <div ref={this.handleMount}>
        <GradientBackground>
          <DummyContent />
          <Card
            mediaClientConfig={mediaClientConfig}
            identifier={genericFileId}
          />
          <DummyContent />
        </GradientBackground>
      </div>
    );
  }
}

export default () => <Example />;
