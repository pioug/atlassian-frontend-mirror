/** @jsx jsx */
import { Fragment } from 'react';

import { jsx } from '@emotion/core';

import {
  DEFAULT_I18N_PROPS_SKIP_LINKS,
  PAGE_LAYOUT_CONTAINER_SELECTOR,
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
            {children}
          </SidebarResizeController>
        </div>
      </SkipLinksController>
    </Fragment>
  );
};

export default PageLayout;
