/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import { FlexibleUiContext } from '../../src/state/flexible-ui-context';
import { exampleTokens, getContext } from '../utils/flexible-ui';
import { MediaType } from '../../src/constants';
import { Preview } from '../../src/view/FlexibleCard/components/elements';
import { smallImage, wideImage } from '@atlaskit/media-test-helpers';
import VRTestWrapper from '../utils/vr-test-wrapper';

const context = getContext({
  preview: { type: MediaType.Image, url: smallImage },
});

const containerStyles = css`
  margin: 1rem 0;
  width: 300px;
`;
const overrideCss = css`
  background-color: ${exampleTokens.overrideColor};
  border-radius: 0.5rem;
  > img {
    object-fit: contain;
  }
`;

export default () => (
  <VRTestWrapper>
    <FlexibleUiContext.Provider value={context}>
      <h5>Media type: Image</h5>
      <div css={containerStyles}>
        <Preview testId="vr-test-media" />
      </div>
      <div css={containerStyles}>
        <Preview overrideUrl={wideImage} />
      </div>
      <h5>Override CSS</h5>
      <div css={containerStyles}>
        <Preview overrideCss={overrideCss} />
      </div>
    </FlexibleUiContext.Provider>
  </VRTestWrapper>
);
