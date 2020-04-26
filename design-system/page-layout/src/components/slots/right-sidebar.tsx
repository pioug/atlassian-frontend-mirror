/** @jsx jsx */
import { useEffect } from 'react';

import { jsx } from '@emotion/core';

import { RIGHT_SIDEBAR_WIDTH } from '../../common/constants';
import { SlotWidthProps } from '../../common/types';
import {
  removeFromGridStateInStorage,
  resolveDimension,
} from '../../common/utils';
import { usePageLayoutGrid } from '../../controllers';

import SlotDimensions from './slot-dimensions';
import { fixedRightSidebarInnerStyles, rightSidebarStyles } from './styles';

export default (props: SlotWidthProps) => {
  const { children, width, isFixed, shouldPersistWidth, testId } = props;

  const rightSidebarWidth = resolveDimension(
    RIGHT_SIDEBAR_WIDTH,
    width,
    shouldPersistWidth,
  );

  usePageLayoutGrid({ [RIGHT_SIDEBAR_WIDTH]: rightSidebarWidth });
  useEffect(() => {
    return () => {
      removeFromGridStateInStorage('gridState', RIGHT_SIDEBAR_WIDTH);
      document.documentElement.style.removeProperty(`--${RIGHT_SIDEBAR_WIDTH}`);
    };
  }, []);

  return (
    <div data-testid={testId} css={rightSidebarStyles(isFixed)}>
      <SlotDimensions
        variableName={RIGHT_SIDEBAR_WIDTH}
        value={rightSidebarWidth}
      />
      <div css={fixedRightSidebarInnerStyles(isFixed)}>{children}</div>
    </div>
  );
};
