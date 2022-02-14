/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/core';

import { VRTestWrapper } from './utils/vr-test';
import { FlexibleUiContext } from '../src/state/flexible-ui-context';
import { SmartLinkSize } from '../src/constants';
import { getContext } from './utils/flexible-ui';
import { DeleteAction } from '../src/view/FlexibleCard/components/actions';

const containerStyles = css({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '5px',
  padding: '5px',
});

const context = getContext();

export default () => (
  <VRTestWrapper title="Flexible UI: Action: DeleteAction">
    <FlexibleUiContext.Provider value={context}>
      {Object.values(SmartLinkSize).map((size, tIdx) => (
        <React.Fragment>
          <h5>{size}</h5>
          <div css={containerStyles}>
            <DeleteAction
              size={size}
              onClick={async () => {
                console.log('Testing Delete Action...');
              }}
              testId={`vr-test-delete-action`}
            />
          </div>
        </React.Fragment>
      ))}
    </FlexibleUiContext.Provider>
  </VRTestWrapper>
);
