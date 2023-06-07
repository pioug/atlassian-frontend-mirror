/** @jsx jsx */
import { useState } from 'react';

import { jsx } from '@emotion/react';

import Box from '@atlaskit/ds-explorations/box';
import {
  Content,
  LeftSidebarWithoutResize,
  Main,
  PageLayout,
  RightPanel,
  TopNavigation,
} from '@atlaskit/page-layout';
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import {
  UNSAFE_BREAKPOINTS_CONFIG,
  UNSAFE_buildAboveMediaQueryCSS,
} from '@atlaskit/primitives/responsive';
import Stack from '@atlaskit/primitives/stack';

import { GridProps } from '../src';

import GridCards from './01-grid-cards';

// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
const dynamicSizedVerticalPaddingStyles = Object.values(
  UNSAFE_buildAboveMediaQueryCSS((breakpoint) => ({
    paddingBlock: UNSAFE_BREAKPOINTS_CONFIG[breakpoint].gridMargin,
  })),
);

export default () => {
  const [maxWidth, setWidth] = useState<GridProps['maxWidth']>(undefined);
  return (
    <PageLayout>
      <TopNavigation
        testId="topNavigation"
        id="product-navigation"
        skipLinkTitle="Product Navigation"
        height={60}
        isFixed={false}
      >
        <div
          // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
          style={{ padding: 20, border: '1px solid grey' }}
        >
          Product Navigation
        </div>
      </TopNavigation>
      <Content testId="content">
        <LeftSidebarWithoutResize
          testId="leftSidebar"
          id="space-navigation"
          skipLinkTitle="Space Navigation"
          isFixed={false}
          width={125}
        >
          <div
            style={{
              // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
              padding: 20,
              // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
              border: '1px solid grey',
              height: '100%',
            }}
          >
            <Stack space="space.100">
              <div>Space Navigation</div>
              <select
                value={maxWidth}
                onChange={(evt) =>
                  setWidth(evt.currentTarget.value as GridProps['maxWidth'])
                }
              >
                <option value="fluid">Fluid</option>
                <option value="wide">Fixed - wide</option>
                <option value="narrow">Fixed - narrow</option>
              </select>
            </Stack>
          </div>
        </LeftSidebarWithoutResize>

        <Main testId="main" id="main" skipLinkTitle="Main Content">
          <Box display="block" css={dynamicSizedVerticalPaddingStyles}>
            <GridCards maxWidth={maxWidth} />
          </Box>
        </Main>
      </Content>
      <RightPanel
        testId="rightPanel"
        id="help-panel"
        skipLinkTitle="Help Panel"
        isFixed={false}
        width={125}
      >
        <div
          // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
          style={{ padding: 20, border: '1px solid grey', height: '100%' }}
        >
          Help Panel
        </div>
      </RightPanel>
    </PageLayout>
  );
};
