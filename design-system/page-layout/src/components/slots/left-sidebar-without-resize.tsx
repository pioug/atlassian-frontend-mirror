/** @jsx jsx */
import { useEffect } from 'react';

import { jsx } from '@emotion/core';

import { LEFT_SIDEBAR_WIDTH } from '../../common/constants';
import { SlotWidthProps } from '../../common/types';
import {
  removeFromGridStateInStorage,
  resolveDimension,
} from '../../common/utils';
import { usePageLayoutGrid } from '../../controllers';

import {
  fixedLeftSidebarInnerStyles,
  leftSidebarStyles,
} from './left-sidebar-styles';
import SlotDimensions from './slot-dimensions';

export default (props: SlotWidthProps) => {
  const { children, width, isFixed, shouldPersistWidth, testId } = props;

  const leftSidebarWidth = resolveDimension(
    LEFT_SIDEBAR_WIDTH,
    width,
    shouldPersistWidth,
  );

  usePageLayoutGrid({ [LEFT_SIDEBAR_WIDTH]: leftSidebarWidth });
  useEffect(() => {
    return () => {
      removeFromGridStateInStorage('gridState', LEFT_SIDEBAR_WIDTH);
      document.documentElement.style.removeProperty(`--${LEFT_SIDEBAR_WIDTH}`);
    };
  }, []);

  return (
    <div data-testid={testId} css={leftSidebarStyles(isFixed)}>
      <SlotDimensions
        variableName={LEFT_SIDEBAR_WIDTH}
        value={leftSidebarWidth}
      />
      <div css={fixedLeftSidebarInnerStyles(isFixed)}>{children}</div>
    </div>
  );
};
