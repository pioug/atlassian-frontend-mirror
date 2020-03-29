import React from 'react';
import styled from 'styled-components';
import { typography } from '@atlaskit/theme';
import Button from '@atlaskit/button';
import UndoIcon from '@atlaskit/icon/glyph/editor/undo';
import { SpotlightCard } from '../src';

import welcomeImage from './assets/this-is-new-jira.png';

const Wrapper = styled.div`
  width: 600px;
  height: 500px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: space-evenly;
  flex-wrap: wrap;
`;

const Semibold = styled.p`
  ${typography.h400};
  color: inherit;
`;

const copy =
  'Quickly switch between your most recent projects by selecting the project name and icon.';

export default () => (
  <Wrapper>
    <SpotlightCard
      actions={[{ text: 'Next', onClick: () => {} }]}
      actionsBeforeElement="1/3"
      width={275}
    >
      {copy}
    </SpotlightCard>
    <SpotlightCard
      actions={[
        { text: 'Next', onClick: () => {} },
        { text: 'Skip', onClick: () => {} },
      ]}
      width={275}
    >
      {copy}
    </SpotlightCard>
    <SpotlightCard
      actionsBeforeElement={<Semibold>Try clicking the project name.</Semibold>}
      width={275}
    >
      {copy}
    </SpotlightCard>
    <SpotlightCard
      image={<img alt="" src={welcomeImage} width="275" />}
      actions={[{ text: 'Next', onClick: () => {} }]}
      width={275}
    >
      {copy}
    </SpotlightCard>
    <SpotlightCard
      heading="Switch it up"
      headingAfterElement={
        <Button iconBefore={<UndoIcon label="undo" />} appearance="subtle-link">
          Replay
        </Button>
      }
      actions={[{ text: 'Got it', onClick: () => {} }]}
      width={275}
    >
      {copy}
    </SpotlightCard>
  </Wrapper>
);
