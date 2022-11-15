/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { JsonLd } from 'json-ld-types';

import { VRTestWrapper } from './utils/vr-test';
import { Provider, Client } from '../src';
import { Card } from '../src';
import {
  BitbucketBranch,
  BitbucketCommit,
  BitbucketFile,
  BitbucketProject,
  BitbucketPullRequest,
  BitbucketRepository,
} from '../examples-helpers/_jsonLDExamples/provider.bitbucket';

const examples = {
  [BitbucketBranch.data.url]: BitbucketBranch,
  [BitbucketCommit.data.url]: BitbucketCommit,
  [BitbucketFile.data.url]: BitbucketFile,
  [BitbucketProject.data.url]: BitbucketProject,
  [BitbucketPullRequest.data.url]: BitbucketPullRequest,
  [BitbucketRepository.data.url]: BitbucketRepository,
};

const cardStyles = css`
  display: flex;
  gap: 1rem;
  margin: 1rem 0;

  > div {
    width: 50%;
  }
`;

const getContainerStyles = (height: number) => css`
  min-height: ${height}px;
  position: relative;
`;

class CustomClient extends Client {
  fetchData(url: string) {
    const response = examples[url as keyof typeof examples];
    return Promise.resolve(response as JsonLd.Response);
  }
}

const renderLink = (
  name: string,
  url: string,
  testId: string,
  height: number = 260,
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
      </div>
    </div>
  </div>
);

export default () => (
  <VRTestWrapper title="Bitbucket Links">
    <Provider client={new CustomClient('staging')}>
      {renderLink('Branch', BitbucketBranch.data.url, 'branch', 430)}
      {renderLink('Commit', BitbucketCommit.data.url, 'commit')}
      {renderLink('File', BitbucketFile.data.url, 'file')}
      {renderLink('Project', BitbucketProject.data.url, 'project', 430)}
      {renderLink('Pull request', BitbucketPullRequest.data.url, 'pr', 320)}
      {renderLink('Repository', BitbucketRepository.data.url, 'repository')}
    </Provider>
  </VRTestWrapper>
);
