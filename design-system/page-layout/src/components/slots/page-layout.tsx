/** @jsx jsx */
import { Fragment } from 'react';

import { css, Global, jsx } from '@emotion/core';

import {
  BANNER_HEIGHT,
  DEFAULT_I18N_PROPS_SKIP_LINKS,
  IS_SIDEBAR_DRAGGING,
  LEFT_PANEL_WIDTH,
  LEFT_SIDEBAR_FLYOUT,
  LEFT_SIDEBAR_FLYOUT_WIDTH,
  LEFT_SIDEBAR_WIDTH,
  PAGE_LAYOUT_CONTAINER_SELECTOR,
  RIGHT_PANEL_WIDTH,
  RIGHT_SIDEBAR_WIDTH,
  TOP_NAVIGATION_HEIGHT,
} from '../../common/constants';
import { PageLayoutProps } from '../../common/types';
import {
  SidebarResizeController,
  SkipLinksController,
} from '../../controllers';
import { SkipLinkWrapper } from '../skip-links';

import { gridStyles } from './styles';

const pageLayoutSelector = { [PAGE_LAYOUT_CONTAINER_SELECTOR]: true };

const PageLayout = ({
  skipLinksLabel = DEFAULT_I18N_PROPS_SKIP_LINKS,
  children,
  testId,
  onLeftSidebarExpand,
  onLeftSidebarCollapse,
}: PageLayoutProps) => {
  return (
    <Fragment>
      <SkipLinksController>
        <SkipLinkWrapper skipLinksLabel={skipLinksLabel} />
        <div
          {...pageLayoutSelector}
          data-testid={testId}
          css={gridStyles}
          tabIndex={-1}
        >
          <SidebarResizeController
            onLeftSidebarCollapse={onLeftSidebarCollapse}
            onLeftSidebarExpand={onLeftSidebarExpand}
          >
            <Global
              styles={css`
                :root {
                  --${LEFT_PANEL_WIDTH}: 0px;
                  --${LEFT_SIDEBAR_WIDTH}: 0px;
                  --${RIGHT_SIDEBAR_WIDTH}: 0px;
                  --${RIGHT_PANEL_WIDTH}: 0px;
                  --${TOP_NAVIGATION_HEIGHT}: 0px;
                  --${BANNER_HEIGHT}: 0px;
                  --${LEFT_SIDEBAR_FLYOUT}: ${LEFT_SIDEBAR_FLYOUT_WIDTH}px;
                }

                [${IS_SIDEBAR_DRAGGING}] {
                  user-select: none !important;
                }
              `}
            />
            {children}
          </SidebarResizeController>
        </div>
      </SkipLinksController>
    </Fragment>
  );
};

export default PageLayout;
