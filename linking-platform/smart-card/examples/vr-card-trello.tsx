/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { JsonLd } from 'json-ld-types';

import { VRTestWrapper } from './utils/vr-test';
import { Provider, Client } from '../src';
import { Card } from '../src';
import {
  FullTrelloCard,
  FullTrelloBoard,
} from '../examples-helpers/_jsonLDExamples/provider.trello';

const examples = {
  [FullTrelloCard.data.url]: FullTrelloCard,
  [FullTrelloBoard.data.url]: FullTrelloBoard,
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
  <VRTestWrapper title="Trello Links">
    <Provider
      client={new CustomClient('staging')}
      featureFlags={{ enableFlexibleBlockCard: true }}
    >
      {renderLink('Card', FullTrelloCard.data.url, 'card', 430)}
      {renderLink('Board', FullTrelloBoard.data.url, 'board', 430)}
    </Provider>
  </VRTestWrapper>
);
