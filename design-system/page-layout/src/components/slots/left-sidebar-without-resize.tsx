/** @jsx jsx */
import { useEffect } from 'react';

import { jsx } from '@emotion/react';

import { VAR_LEFT_SIDEBAR_WIDTH } from '../../common/constants';
import { SlotWidthProps } from '../../common/types';
import { resolveDimension } from '../../common/utils';
import { publishGridState, useSkipLink } from '../../controllers';

import LeftSidebarInner from './internal/left-sidebar-inner';
import LeftSidebarOuter from './internal/left-sidebar-outer';
import SlotDimensions from './slot-dimensions';

/**
 * __Left sidebar without resize__
 *
 * Provides a slot for a left sidebar without resize within the PageLayout.
 *
 * - [Examples](https://atlassian.design/components/page-layout/examples)
 * - [Code](https://atlassian.design/components/page-layout/code)
 */
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
  }, [leftSidebarWidth]);

  useSkipLink(id, skipLinkTitle);

  return (
    <LeftSidebarOuter id={id} testId={testId} isFixed={isFixed}>
      <SlotDimensions
        variableName={VAR_LEFT_SIDEBAR_WIDTH}
        value={leftSidebarWidth}
      />
      <LeftSidebarInner isFixed={isFixed}>{children}</LeftSidebarInner>
    </LeftSidebarOuter>
  );
};

export default LeftSidebarWithoutResize;
