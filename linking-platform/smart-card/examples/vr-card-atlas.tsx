/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { JsonLd } from 'json-ld-types';

import { VRTestWrapper } from './utils/vr-test';
import { Provider, Client } from '../src';
import { Card } from '../src';
import { AtlasGoal, AtlasProject } from '../examples-helpers/_jsonLDExamples';
import { overrideEmbedContent } from './utils/common';

const examples = {
  [AtlasProject.data.url]: AtlasProject,
  [AtlasGoal.data.url]: AtlasGoal,
};

const cardStyles = css`
  display: flex;
  gap: 1rem;
  margin: 1rem 0;

  > div {
    width: 50%;
  }

  // Override embed height
  .media-card-frame {
    height: 4.2rem;
  }
`;

const getContainerStyles = (height: number) => css`
  min-height: ${height}px;
  position: relative;
`;

class CustomClient extends Client {
  fetchData(url: string) {
    let response = { ...examples[url as keyof typeof examples] };
    response.data.preview.href = overrideEmbedContent;
    return Promise.resolve(response as JsonLd.Response);
  }
}

const renderLink = (
  name: string,
  url: string,
  testId: string,
  height: number = 340,
) => (
  <div css={getContainerStyles(height)}>
    <h4>{name}</h4>
    <div css={cardStyles}>
      <div>
        <h5>Inline (with Hover Preview)</h5>
        <Card
          appearance="inline"
          showHoverPreview={true}
          testId={`inline-card-${testId}`}
          url={url}
        />
      </div>
      <div>
        <h5>Block</h5>
        <Card appearance="block" url={url} />
        <h5>Embed</h5>
        <Card appearance="embed" isFrameVisible={true} url={url} />
      </div>
    </div>
  </div>
);

export default () => (
  <VRTestWrapper title="Atlas Links">
    <Provider
      client={new CustomClient('staging')}
      featureFlags={{ enableImprovedPreviewAction: true }}
    >
      {renderLink('Goal', AtlasGoal.data.url, 'goal')}
      {renderLink('Project', AtlasProject.data.url, 'project')}
    </Provider>
  </VRTestWrapper>
);
