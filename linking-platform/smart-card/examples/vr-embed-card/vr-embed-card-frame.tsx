/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import React from 'react';

import { token } from '@atlaskit/tokens';

import VRTestWrapper from '../utils/vr-test-wrapper';
import {
  ExpandedFrame,
  type ExpandedFrameProps,
} from '../../src/view/EmbedCard/components/ExpandedFrame';

const wrapperStyles = css({
  padding: token('space.250', '20px'),
});

const VREmbedFrame: React.FC<Partial<ExpandedFrameProps>> = (props) => (
  <VRTestWrapper overrideCss={wrapperStyles}>
    <ExpandedFrame text="frame text" testId="vr-embed-card-frame" {...props}>
      <div></div>
    </ExpandedFrame>
  </VRTestWrapper>
);

export default VREmbedFrame;
