/** @jsx jsx */
import { useEffect } from 'react';

import { jsx } from '@emotion/core';

import { RIGHT_SIDEBAR_WIDTH } from '../../common/constants';
import { SlotWidthProps } from '../../common/types';
import { resolveDimension } from '../../common/utils';
import { publishGridState } from '../../controllers';

import SlotDimensions from './slot-dimensions';
import { fixedRightSidebarInnerStyles, rightSidebarStyles } from './styles';

const RightSidebar = (props: SlotWidthProps) => {
  const { children, width, isFixed, shouldPersistWidth, testId } = props;

  const rightSidebarWidth = resolveDimension(
    RIGHT_SIDEBAR_WIDTH,
    width,
    shouldPersistWidth,
  );

  useEffect(() => {
    publishGridState({ [RIGHT_SIDEBAR_WIDTH]: rightSidebarWidth });
    return () => {
      publishGridState({ [RIGHT_SIDEBAR_WIDTH]: 0 });
    };
  }, [rightSidebarWidth]);

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

export default RightSidebar;
