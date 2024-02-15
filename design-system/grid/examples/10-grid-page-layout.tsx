/* eslint-disable @atlaskit/design-system/no-nested-styles */
/** @jsx jsx */
import { useState } from 'react';

import { jsx } from '@emotion/react';

import {
  Content,
  LeftSidebarWithoutResize,
  Main,
  PageLayout,
  RightPanel,
  TopNavigation,
} from '@atlaskit/page-layout';
import { Box, xcss } from '@atlaskit/primitives';
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import {
  media,
  UNSAFE_BREAKPOINTS_CONFIG,
} from '@atlaskit/primitives/responsive';
import Stack from '@atlaskit/primitives/stack';

import { GridProps } from '../src';

import GridCards from './01-grid-cards';

const dynamicSizedVerticalPaddingStyles = xcss({
  [media.above.sm]: {
    // @ts-expect-error
    paddingBlock: UNSAFE_BREAKPOINTS_CONFIG.sm.gridMargin,
  },
  [media.above.md]: {
    // @ts-expect-error
    paddingBlock: UNSAFE_BREAKPOINTS_CONFIG.md.gridMargin,
  },
  [media.above.lg]: {
    // @ts-expect-error
    paddingBlock: UNSAFE_BREAKPOINTS_CONFIG.lg.gridMargin,
  },
  [media.above.xs]: {
    // @ts-expect-error
    paddingBlock: UNSAFE_BREAKPOINTS_CONFIG.xs.gridMargin,
  },
  [media.above.xl]: {
    // @ts-expect-error
    paddingBlock: UNSAFE_BREAKPOINTS_CONFIG.xl.gridMargin,
  },
});

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
        <div style={{ padding: 20, border: '1px solid grey' }}>
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
              padding: 20,

              border: '1px solid grey',
              height: '100%',
            }}
          >
            <Stack space="space.100">
              <div>Space Navigation</div>
              <label htmlFor="width">Width</label>
              <select
                id="width"
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
          <Box xcss={dynamicSizedVerticalPaddingStyles}>
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
        <div style={{ padding: 20, border: '1px solid grey', height: '100%' }}>
          Help Panel
        </div>
      </RightPanel>
    </PageLayout>
  );
};
