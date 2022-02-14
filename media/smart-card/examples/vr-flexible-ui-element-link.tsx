/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/core';

import { VRTestWrapper } from './utils/vr-test';
import { FlexibleUiContext } from '../src/state/flexible-ui-context';
import { SmartLinkSize, SmartLinkTheme } from '../src/constants';
import { getContext } from './utils/flexible-ui';
import { Title } from '../src/view/FlexibleCard/components/elements';

const context = getContext();
const renderTitle = (
  maxLines = 2,
  size = SmartLinkSize.Medium,
  theme = SmartLinkTheme.Link,
) => (
  <Title maxLines={maxLines} size={size} theme={theme} testId="vr-test-title" />
);

export default () => (
  <VRTestWrapper title="Flexible UI: Element: Link">
    <FlexibleUiContext.Provider value={context}>
      {Object.values(SmartLinkSize).map((size, idx) => (
        <React.Fragment key={idx}>
          <h5>Size: {size}</h5>
          {renderTitle(2, size, SmartLinkTheme.Link)}
        </React.Fragment>
      ))}
      {Object.values(SmartLinkTheme).map((theme, idx) => (
        <React.Fragment key={idx}>
          <h5>Theme: {theme}</h5>
          {renderTitle(2, SmartLinkSize.Medium, theme)}
        </React.Fragment>
      ))}
      {[2, 1].map((maxLines, idx) => (
        <React.Fragment key={idx}>
          <h5>Max lines: {maxLines}</h5>
          {renderTitle(maxLines, SmartLinkSize.Medium, SmartLinkTheme.Link)}
        </React.Fragment>
      ))}
    </FlexibleUiContext.Provider>
  </VRTestWrapper>
);
