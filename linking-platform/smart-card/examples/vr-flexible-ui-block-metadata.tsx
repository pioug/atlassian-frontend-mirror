/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/react';

import { SmartCardProvider } from '@atlaskit/link-provider';

import { VRTestWrapper } from './utils/vr-test';
import { ElementItem, ElementName, MetadataBlock, SmartLinkSize } from '../src';
import { blockOverrideCss, getCardState } from './utils/flexible-ui';
import FlexibleCard from '../src/view/FlexibleCard';

const cardState = getCardState({
  '@type': 'atlassian:Project',
  'atlassian:priority': 'Critical',
  'atlassian:state': 'open',
  'atlassian:subscriberCount': 999,
  'atlassian:updatedBy': { '@type': 'Person', name: 'Tweak' },
  'atlassian:ownedBy': [
    { '@type': 'Person', name: 'Fluffy' },
    { '@type': 'Person', name: 'Kirara' },
    { '@type': 'Person', name: 'Tweak' },
  ],
  attributedTo: [
    { '@type': 'Person', name: 'Fluffy' },
    { '@type': 'Person', name: 'Kirara' },
    { '@type': 'Person', name: 'Tweak' },
  ],
  'schema:commentCount': 20,
  'schema:dateCreated': '2020-02-04T12:40:12.353+0800',
  'schema:programmingLanguage': 'Javascript',
});

const elements: ElementItem[] = [
  { name: ElementName.AuthorGroup },
  { name: ElementName.ProgrammingLanguage },
  { name: ElementName.Priority },
  { name: ElementName.CommentCount },
  { name: ElementName.ViewCount },
  { name: ElementName.VoteCount },
  { name: ElementName.ReactCount },
  { name: ElementName.State },
];

const multiLineElements: ElementItem[] = [
  ...elements,
  { name: ElementName.SubscriberCount },
  { name: ElementName.CreatedBy },
  { name: ElementName.OwnedBy },
  { name: ElementName.CreatedOn },
  { name: ElementName.ModifiedBy },
  { name: ElementName.ModifiedOn },
];

export default () => (
  <VRTestWrapper title="Flexible UI: MetadataBlock">
    <SmartCardProvider>
      <h5>Primary metadata</h5>
      <FlexibleCard cardState={cardState} url="link-url">
        <MetadataBlock primary={elements} />
      </FlexibleCard>
      <h5>Secondary metadata</h5>
      <FlexibleCard cardState={cardState} url="link-url">
        <MetadataBlock secondary={elements} />
      </FlexibleCard>
      <h5>Primary and secondary metadata</h5>
      <FlexibleCard cardState={cardState} url="link-url">
        <MetadataBlock
          primary={elements.slice(0, 1)}
          secondary={elements.slice(1)}
        />
      </FlexibleCard>
      <h5>Max lines: 1</h5>
      <FlexibleCard cardState={cardState} url="link-url">
        <MetadataBlock
          maxLines={1}
          primary={multiLineElements}
          secondary={[...multiLineElements].reverse()}
        />
      </FlexibleCard>
      <h5>Max lines: 2</h5>
      <FlexibleCard cardState={cardState} url="link-url">
        <MetadataBlock
          maxLines={2}
          primary={multiLineElements}
          secondary={[...multiLineElements].reverse()}
        />
      </FlexibleCard>
      {Object.values(SmartLinkSize).map((size, idx) => (
        <React.Fragment key={idx}>
          <h5>Size: {size}</h5>
          <FlexibleCard cardState={cardState} url="link-url" ui={{ size }}>
            <MetadataBlock
              primary={multiLineElements}
              secondary={[...multiLineElements].reverse()}
            />
          </FlexibleCard>
        </React.Fragment>
      ))}
      <h5>Override CSS</h5>
      <FlexibleCard cardState={cardState} url="link-url">
        <MetadataBlock overrideCss={blockOverrideCss} primary={elements} />
      </FlexibleCard>
    </SmartCardProvider>
  </VRTestWrapper>
);
