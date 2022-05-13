/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import React from 'react';

import { VRTestWrapper } from './utils/vr-test';
import { blockOverrideCss, getCardState } from './utils/flexible-ui';
import FlexibleCard from '../src/view/FlexibleCard';
import { ElementName, SmartLinkTheme, TitleBlock } from '../src/index';

const cardState = getCardState({
  '@type': 'atlassian:Template',
  'atlassian:state': 'open',
  'atlassian:updatedBy': { '@type': 'Person', name: 'Tweak' },
  attributedTo: [
    { '@type': 'Person', name: 'Fluffy' },
    { '@type': 'Person', name: 'Kirara' },
    { '@type': 'Person', name: 'Tweak' },
  ],
  'schema:commentCount': 20,
  'schema:dateCreated': '2020-02-04T12:40:12.353+0800',
  'schema:programmingLanguage': 'Javascript',
  updated: '2022-01-23T16:44:00.000+1000',
});

export default () => (
  <VRTestWrapper title="Flexible UI: Block Features">
    <h5>Separator</h5>
    <FlexibleCard
      cardState={cardState}
      ui={{ theme: SmartLinkTheme.Black }}
      url="link-url"
    >
      <TitleBlock
        subtitle={[
          { name: ElementName.CreatedBy },
          { name: ElementName.ModifiedBy },
        ]}
        text="Between text elements"
      />
      <TitleBlock
        subtitle={[{ name: ElementName.CreatedBy }]}
        text="Single text element (omitted)"
      />
      <TitleBlock
        subtitle={[
          { name: ElementName.CreatedOn },
          { name: ElementName.ModifiedOn },
        ]}
        text="Between date-time elements"
      />
      <TitleBlock
        subtitle={[{ name: ElementName.ModifiedOn }]}
        text="Single date-time element (omitted)"
      />
      <TitleBlock
        subtitle={[
          { name: ElementName.CreatedBy },
          { name: ElementName.CreatedOn },
          { name: ElementName.ModifiedBy },
          { name: ElementName.ModifiedOn },
        ]}
        text="Between text and date-time elements"
      />
      <TitleBlock
        subtitle={[
          { name: ElementName.AuthorGroup },
          { name: ElementName.CreatedBy },
          { name: ElementName.CreatedOn },
          { name: ElementName.State },
          { name: ElementName.ModifiedBy },
          { name: ElementName.ModifiedOn },
          { name: ElementName.CommentCount },
          { name: ElementName.ProgrammingLanguage },
        ]}
        text="With other element types"
      />
    </FlexibleCard>
    <h5>Override CSS</h5>
    <FlexibleCard
      cardState={cardState}
      ui={{
        theme: SmartLinkTheme.Black,
      }}
      url="link-url"
    >
      <TitleBlock text="Override css on block" overrideCss={blockOverrideCss} />
    </FlexibleCard>
  </VRTestWrapper>
);
