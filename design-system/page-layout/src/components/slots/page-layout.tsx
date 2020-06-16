/** @jsx jsx */
import { ReactNode, useEffect } from 'react';

import { css, Global, jsx } from '@emotion/core';

import {
  BANNER_HEIGHT,
  IS_SIDEBAR_DRAGGING,
  LEFT_PANEL_WIDTH,
  LEFT_SIDEBAR_FLYOUT,
  LEFT_SIDEBAR_FLYOUT_WIDTH,
  LEFT_SIDEBAR_WIDTH,
  RIGHT_PANEL_WIDTH,
  RIGHT_SIDEBAR_WIDTH,
  TOP_NAVIGATION_HEIGHT,
} from '../../common/constants';
import { removeFromGridStateInStorage } from '../../common/utils';
import { SidebarResizeController } from '../../controllers/sidebar-resize-controller';

import { gridStyles } from './styles';

const PageLayout = ({
  children,
  testId,
  onLeftSidebarExpand,
  onLeftSidebarCollapse,
}: {
  children: ReactNode;
  testId?: string;
  onLeftSidebarExpand?: () => void;
  onLeftSidebarCollapse?: () => void;
}) => {
  useEffect(() => {
    return () => {
      removeFromGridStateInStorage('gridState');
    };
  }, []);

  return (
    <div data-testid={testId} css={gridStyles}>
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
  );
};

export default PageLayout;
