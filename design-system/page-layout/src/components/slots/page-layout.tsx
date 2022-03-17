/** @jsx jsx */
import { Fragment } from 'react';

import { css, jsx } from '@emotion/core';

import {
  BANNER,
  BANNER_HEIGHT,
  CONTENT,
  DEFAULT_I18N_PROPS_SKIP_LINKS,
  LEFT_PANEL,
  LEFT_PANEL_WIDTH,
  PAGE_LAYOUT_CONTAINER_SELECTOR,
  RIGHT_PANEL,
  RIGHT_PANEL_WIDTH,
  TOP_NAVIGATION,
  TOP_NAVIGATION_HEIGHT,
} from '../../common/constants';
import { PageLayoutProps } from '../../common/types';
import {
  SidebarResizeController,
  SkipLinksController,
} from '../../controllers';
import { SkipLinkWrapper } from '../skip-links';

const pageLayoutSelector = { [PAGE_LAYOUT_CONTAINER_SELECTOR]: true };

const gridTemplateAreas = `
  "${LEFT_PANEL} ${BANNER} ${RIGHT_PANEL}"
  "${LEFT_PANEL} ${TOP_NAVIGATION} ${RIGHT_PANEL}"
  "${LEFT_PANEL} ${CONTENT} ${RIGHT_PANEL}"
 `;

const gridStyles = css({
  display: 'grid',
  height: '100%',
  gridTemplateAreas,
  gridTemplateColumns: `${LEFT_PANEL_WIDTH} minmax(0, 1fr) ${RIGHT_PANEL_WIDTH}`,
  gridTemplateRows: `${BANNER_HEIGHT} ${TOP_NAVIGATION_HEIGHT} auto`,
  outline: 'none',
});

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
            {children}
          </SidebarResizeController>
        </div>
      </SkipLinksController>
    </Fragment>
  );
};

export default PageLayout;
