/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { VRTestWrapper } from './utils/vr-test';
import { FlexibleUiContext } from '../src/state/flexible-ui-context';
import { getContext } from './utils/flexible-ui';
import { MediaType } from '../src/constants';
import { Preview } from '../src/view/FlexibleCard/components/elements';
import { smallImage, wideImage } from '@atlaskit/media-test-helpers';

const context = getContext({
  preview: { type: MediaType.Image, url: smallImage },
});

const containerStyles = css`
  margin: 1rem 0;
  width: 300px;
`;

export default () => (
  <VRTestWrapper title="Flexible UI: Element: Media">
    <FlexibleUiContext.Provider value={context}>
      <h5>Media type: Image</h5>
      <div css={containerStyles}>
        <Preview testId="vr-test-media" />
      </div>
      <div css={containerStyles}>
        <Preview url={wideImage} />
      </div>
    </FlexibleUiContext.Provider>
  </VRTestWrapper>
);
