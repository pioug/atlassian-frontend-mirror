/** @jsx jsx */
import { useEffect } from 'react';

import { jsx } from '@emotion/core';

import { LEFT_SIDEBAR_WIDTH } from '../../common/constants';
import { SlotWidthProps } from '../../common/types';
import { resolveDimension } from '../../common/utils';
import { publishGridState } from '../../controllers';

import {
  fixedLeftSidebarInnerStyles,
  leftSidebarStyles,
} from './left-sidebar-styles';
import SlotDimensions from './slot-dimensions';

const LeftSidebarWithoutResize = (props: SlotWidthProps) => {
  const { children, width, isFixed, shouldPersistWidth, testId } = props;

  const leftSidebarWidth = resolveDimension(
    LEFT_SIDEBAR_WIDTH,
    width,
    shouldPersistWidth,
  );

  useEffect(() => {
    publishGridState({ [LEFT_SIDEBAR_WIDTH]: leftSidebarWidth });
    return () => {
      publishGridState({ [LEFT_SIDEBAR_WIDTH]: 0 });
    };
  }, [leftSidebarWidth]);

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

export default LeftSidebarWithoutResize;
