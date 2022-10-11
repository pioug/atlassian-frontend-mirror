/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';

import { VRTestWrapper } from './utils/vr-test';
import { TitleBlock } from '../src/view/FlexibleCard/components/blocks';
import {
  ElementName,
  SmartLinkPosition,
  SmartLinkSize,
  SmartLinkTheme,
} from '../src/constants';
import {
  blockOverrideCss,
  getCardState,
  makeCustomActionItem,
  makeDeleteActionItem,
  makeEditActionItem,
} from './utils/flexible-ui';
import FlexibleCard from '../src/view/FlexibleCard';
import { ActionItem, CardType } from '../src';
import { TitleBlockProps } from '../src/view/FlexibleCard/components/blocks/title-block/types';

const gridStyles = css`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
`;

const renderResolvedView = ({
  actions,
  maxLines,
  position,
  overrideCss,
  showActionOnHover,
  size,
  testId,
  text,
  theme,
}: TitleBlockProps) => {
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
        testId={testId}
        maxLines={maxLines}
        position={position}
        overrideCss={overrideCss}
        metadata={[
          { name: ElementName.State },
          { name: ElementName.AuthorGroup },
          { name: ElementName.CollaboratorGroup },
        ]}
        subtitle={[
          { name: ElementName.CommentCount },
          { name: ElementName.ViewCount },
          { name: ElementName.ReactCount },
          { name: ElementName.VoteCount },
        ]}
        actions={actions}
        text={text}
        showActionOnHover={showActionOnHover}
      />
    </FlexibleCard>
  );
};

const renderErroredView = (
  status: CardType,
  meta = {},
  actions?: ActionItem[],
) => {
  const cardState = getCardState(undefined, meta, status);
  return (
    <FlexibleCard
      cardState={cardState}
      url={`https://${status}-url?s=something%20went%20wrong`}
      onAuthorize={() => {}}
    >
      <TitleBlock actions={actions} position={SmartLinkPosition.Center} />
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
        {renderResolvedView({ size })}
      </React.Fragment>
    ))}
    <h5>With default action items:</h5>
    {renderResolvedView({ actions: [makeDeleteActionItem()] })}
    <h5>With content only action items:</h5>
    {renderResolvedView({
      actions: [makeDeleteActionItem({ hideIcon: true })],
    })}
    <h5>With icon only action items:</h5>
    {renderResolvedView({
      actions: [makeDeleteActionItem({ hideContent: true })],
    })}
    <h5>With custom action:</h5>
    {renderResolvedView({ actions: [makeCustomActionItem()] })}
    <h5>With on hove only actions:</h5>
    {renderResolvedView({
      showActionOnHover: true,
      actions: [makeCustomActionItem(), makeDeleteActionItem()],
      testId: 'actions-on-hover-title-block',
    })}
    {renderResolvedView({
      showActionOnHover: true,
      actions: [makeCustomActionItem()],
    })}
    <h5>Theme: {SmartLinkTheme.Black}</h5>
    {renderResolvedView({ theme: SmartLinkTheme.Black })}
    <h5>Max lines: 1</h5>
    {renderResolvedView({
      maxLines: 1,
      size: SmartLinkSize.Medium,
      theme: SmartLinkTheme.Link,
    })}
    <h5>Position: {SmartLinkPosition.Center}</h5>
    {renderResolvedView({
      position: SmartLinkPosition.Center,
    })}
    <h5>Title override </h5>
    {renderResolvedView({ text: 'Test Title' })}
    <div css={gridStyles}>
      <div>
        {renderResolvedView({
          maxLines: 1,
          text: 'https://product-fabric.atlassian.net/browse/EDM-3050',
        })}
      </div>
      <div>
        {renderResolvedView({
          maxLines: 1,
          text:
            'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/4QBgRXhpZgAASUkqAAgAAAACADEBAgAHAAAAJgAAAGmHBAABAAAALgAAAAAAAABHb29nbGUAAAMAAJAHAAQAAAAwM==',
        })}
      </div>
    </div>
    <h5>CSS override</h5>
    {renderResolvedView({ overrideCss: blockOverrideCss })}
    <h4>Views</h4>
    <h5>Errored view</h5>
    {renderErroredView('errored', {}, [makeEditActionItem({ hideIcon: true })])}
    <h5>Forbidden view</h5>
    {renderErroredView(
      'forbidden',
      {
        visibility: 'restricted',
        access: 'forbidden',
        auth: [
          {
            key: 'some-flow',
            displayName: 'Flow',
            url: 'https://outbound-auth/flow',
          },
        ],
      },
      [
        makeEditActionItem({ hideContent: true }),
        makeDeleteActionItem({ hideContent: true }),
      ],
    )}
    <h5>Not found view</h5>
    {renderErroredView(
      'not_found',
      {
        visibility: 'not_found',
        access: 'forbidden',
      },
      [makeDeleteActionItem()],
    )}
    <h5>Unauthorized view</h5>
    {renderErroredView(
      'unauthorized',
      {
        visibility: 'restricted',
        access: 'unauthorized',
        auth: [
          {
            key: 'some-flow',
            displayName: 'Flow',
            url: 'https://outbound-auth/flow',
          },
        ],
      },
      [makeEditActionItem(), makeDeleteActionItem()],
    )}
    <h5>Resolving view</h5>
    <FlexibleCard
      cardState={{ status: 'resolving' }}
      url="https://resolving-url?s=loading"
    >
      <TitleBlock
        actions={[makeEditActionItem({ hideContent: true })]}
        position={SmartLinkPosition.Center}
      />
    </FlexibleCard>
  </VRTestWrapper>
);
