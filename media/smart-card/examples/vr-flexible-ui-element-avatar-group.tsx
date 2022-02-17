/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/core';

import { VRTestWrapper } from './utils/vr-test';
import { FlexibleUiContext } from '../src/state/flexible-ui-context';
import { SmartLinkSize } from '../src/constants';
import { getContext } from './utils/flexible-ui';
import {
  AuthorGroup,
  CollaboratorGroup,
} from '../src/view/FlexibleCard/components/elements';

const containerStyles = css`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  padding: 5px;
`;
const authorGroup = [
  { name: 'Bob' },
  { name: 'Charlie' },
  { name: 'Spaghetti' },
];
const collaboratorGroup = [
  { name: 'Alexander' },
  { name: 'Hamilton' },
  { name: 'Lasagna' },
];

const context = getContext({
  authorGroup,
  collaboratorGroup,
});

export default () => (
  <VRTestWrapper title="Flexible UI: Element: AvatarGroup">
    <FlexibleUiContext.Provider value={context}>
      {Object.values(SmartLinkSize).map((size, tIdx) => (
        <React.Fragment key={tIdx}>
          <h5>{size}</h5>
          <div css={containerStyles}>
            <AuthorGroup
              size={size}
              testId={`vr-test-author-group-${size}-${tIdx}`}
            />
            <CollaboratorGroup
              size={size}
              testId={`vr-test-collaborator-group-${size}-${tIdx}`}
            />
          </div>
        </React.Fragment>
      ))}
    </FlexibleUiContext.Provider>
  </VRTestWrapper>
);
