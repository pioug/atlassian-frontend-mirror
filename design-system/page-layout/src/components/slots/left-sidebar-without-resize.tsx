/** @jsx jsx */
import { useEffect } from 'react';

import { jsx } from '@emotion/core';

import { LEFT_SIDEBAR_WIDTH } from '../../common/constants';
import { SlotWidthProps } from '../../common/types';
import { resolveDimension } from '../../common/utils';
import { publishGridState, useSkipLinks } from '../../controllers';

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
    LEFT_SIDEBAR_WIDTH,
    width,
    shouldPersistWidth,
  );

  const { registerSkipLink, unregisterSkipLink } = useSkipLinks();

  useEffect(() => {
    publishGridState({ [LEFT_SIDEBAR_WIDTH]: leftSidebarWidth });
    return () => {
      publishGridState({ [LEFT_SIDEBAR_WIDTH]: 0 });
      unregisterSkipLink(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leftSidebarWidth, id]);

  if (id && skipLinkTitle) {
    registerSkipLink({ id, skipLinkTitle });
  }

  return (
    <div id={id} data-testid={testId} css={leftSidebarStyles(isFixed)}>
      <SlotDimensions
        variableName={LEFT_SIDEBAR_WIDTH}
        value={leftSidebarWidth}
      />
      <div css={fixedLeftSidebarInnerStyles(isFixed)}>{children}</div>
    </div>
  );
};

export default LeftSidebarWithoutResize;
