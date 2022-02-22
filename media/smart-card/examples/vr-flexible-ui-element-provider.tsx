/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/core';

import { HorizontalWrapper, VRTestWrapper } from './utils/vr-test';
import { FlexibleUiContext } from '../src/state/flexible-ui-context';
import { getContext } from './utils/flexible-ui';
import { Provider } from '../src/view/FlexibleCard/components/elements';
import { SmartLinkSize } from '../src/constants';

const context = getContext();

export default () => (
  <VRTestWrapper title="Flexible UI: Element: Provider">
    <FlexibleUiContext.Provider value={context}>
      {Object.values(SmartLinkSize).map((size, idx) => (
        <React.Fragment key={idx}>
          <h5>Size: {size}</h5>
          <HorizontalWrapper>
            <Provider testId="vr-test-provider-confluence" />
            <Provider testId="vr-test-provider-custom-label" label={'Conny'} />
          </HorizontalWrapper>
        </React.Fragment>
      ))}
    </FlexibleUiContext.Provider>
  </VRTestWrapper>
);
