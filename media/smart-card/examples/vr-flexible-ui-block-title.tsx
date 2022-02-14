/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/core';

import { VRTestWrapper } from './utils/vr-test';
import { TitleBlock } from '../src/view/FlexibleCard/components/blocks';
import {
  ElementName,
  SmartLinkPosition,
  SmartLinkSize,
  SmartLinkTheme,
} from '../src/constants';
import { getCardState } from './utils/flexible-ui';
import FlexibleCard from '../src/view/FlexibleCard';
import { CardType } from '../src/state/store/types';

const renderResolvedView = (
  maxLines?: number,
  size?: SmartLinkSize,
  theme?: SmartLinkTheme,
  position?: SmartLinkPosition,
) => {
  const cardState = getCardState({
    '@type': 'atlassian:Project',
    'atlassian:state': 'open',
    attributedTo: [
      { '@type': 'Person', name: 'Atlassian A' },
      { '@type': 'Person', name: 'Atlassian B' },
      { '@type': 'Person', name: 'Atlassian C' },
    ],
  });
  return (
    <FlexibleCard cardState={cardState} ui={{ size, theme }} url="link-url">
      <TitleBlock
        maxLines={maxLines}
        position={position}
        metadata={[
          { name: ElementName.State },
          { name: ElementName.AuthorGroup },
          { name: ElementName.CollaboratorGroup },
        ]}
        subtitle={[{ name: ElementName.CommentCount }]}
      />
    </FlexibleCard>
  );
};

const renderErroredView = (status: CardType, meta = {}) => {
  const cardState = getCardState(undefined, meta, status);
  return (
    <FlexibleCard
      cardState={cardState}
      url={`https://${status}-url?s=something%20went%20wrong`}
      onAuthorize={() => {}}
    >
      <TitleBlock />
    </FlexibleCard>
  );
};

export default () => (
  <VRTestWrapper title="Flexible UI: TitleBlock">
    <h5>Default</h5>
    <FlexibleCard cardState={getCardState()} url="link-url">
      <TitleBlock />
    </FlexibleCard>

    {Object.values(SmartLinkSize).map((size, idx) => (
      <React.Fragment key={idx}>
        <h5>Size: {size}</h5>
        {renderResolvedView(undefined, size)}
      </React.Fragment>
    ))}
    <h5>Theme: {SmartLinkTheme.Black}</h5>
    {renderResolvedView(undefined, undefined, SmartLinkTheme.Black)}
    <h5>Max lines: 1</h5>
    {renderResolvedView(1, SmartLinkSize.Medium, SmartLinkTheme.Link)}
    <h5>Position: {SmartLinkPosition.Center}</h5>
    {renderResolvedView(
      undefined,
      undefined,
      undefined,
      SmartLinkPosition.Center,
    )}
    <h4>Views</h4>
    <h5>Errored view</h5>
    {renderErroredView('errored')}
    <h5>Forbidden view</h5>
    {renderErroredView('forbidden', {
      visibility: 'restricted',
      access: 'forbidden',
      auth: [
        {
          key: 'some-flow',
          displayName: 'Flow',
          url: 'https://outbound-auth/flow',
        },
      ],
    })}
    <h5>Not found view</h5>
    {renderErroredView('not_found', {
      visibility: 'not_found',
      access: 'forbidden',
    })}
    <h5>Unauthorized view</h5>
    {renderErroredView('unauthorized', {
      visibility: 'restricted',
      access: 'unauthorized',
      auth: [
        {
          key: 'some-flow',
          displayName: 'Flow',
          url: 'https://outbound-auth/flow',
        },
      ],
    })}
    <h5>Resolving view</h5>
    <FlexibleCard
      cardState={{ status: 'resolving' }}
      url="https://resolving-url?s=loading"
    >
      <TitleBlock />
    </FlexibleCard>
  </VRTestWrapper>
);
