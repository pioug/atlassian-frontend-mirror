/** @jsx jsx */
import { useEffect } from 'react';

import { jsx } from '@emotion/core';

import { VAR_LEFT_SIDEBAR_WIDTH } from '../../common/constants';
import { SlotWidthProps } from '../../common/types';
import {
  getPageLayoutSlotSelector,
  resolveDimension,
} from '../../common/utils';
import { publishGridState, useSkipLink } from '../../controllers';

import {
  fixedLeftSidebarInnerStyles,
  leftSidebarStyles,
} from './left-sidebar-styles';
import SlotDimensions from './slot-dimensions';

const LeftSidebarWithoutResize = (props: SlotWidthProps) => {
  const {
    children,
    id,
    width,
    isFixed,
    shouldPersistWidth,
    testId,
    skipLinkTitle,
  } = props;

  const leftSidebarWidth = resolveDimension(
    VAR_LEFT_SIDEBAR_WIDTH,
    width,
    shouldPersistWidth,
  );

  useEffect(() => {
    publishGridState({ [VAR_LEFT_SIDEBAR_WIDTH]: leftSidebarWidth });
    return () => {
      publishGridState({ [VAR_LEFT_SIDEBAR_WIDTH]: 0 });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leftSidebarWidth]);

  useSkipLink(id, skipLinkTitle);

  return (
    <div
      id={id}
      data-testid={testId}
      css={leftSidebarStyles(isFixed)}
      {...getPageLayoutSlotSelector('left-sidebar')}
    >
      <SlotDimensions
        variableName={VAR_LEFT_SIDEBAR_WIDTH}
        value={leftSidebarWidth}
      />
      <div css={fixedLeftSidebarInnerStyles(isFixed)}>{children}</div>
    </div>
  );
};

export default LeftSidebarWithoutResize;
