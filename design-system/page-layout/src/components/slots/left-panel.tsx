/** @jsx jsx */
import { useEffect } from 'react';

import { jsx } from '@emotion/core';

import {
  DEFAULT_LEFT_PANEL_WIDTH,
  VAR_LEFT_PANEL_WIDTH,
} from '../../common/constants';
import { SlotWidthProps } from '../../common/types';
import {
  getPageLayoutSlotSelector,
  resolveDimension,
} from '../../common/utils';
import { publishGridState, useSkipLink } from '../../controllers';

import SlotDimensions from './slot-dimensions';
import { leftPanelStyles } from './styles';

const LeftPanel = (props: SlotWidthProps) => {
  const {
    children,
    isFixed,
    width = DEFAULT_LEFT_PANEL_WIDTH,
    shouldPersistWidth,
    testId,
    id,
    skipLinkTitle,
  } = props;

  const leftPanelWidth = resolveDimension(
    VAR_LEFT_PANEL_WIDTH,
    width,
    shouldPersistWidth,
  );

  useEffect(() => {
    publishGridState({ [VAR_LEFT_PANEL_WIDTH]: leftPanelWidth });
    return () => {
      publishGridState({ [VAR_LEFT_PANEL_WIDTH]: 0 });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leftPanelWidth]);

  useSkipLink(id, skipLinkTitle);

  return (
    <div
      css={leftPanelStyles(isFixed)}
      data-testid={testId}
      id={id}
      {...getPageLayoutSlotSelector('left-panel')}
    >
      <SlotDimensions
        variableName={VAR_LEFT_PANEL_WIDTH}
        value={leftPanelWidth}
      />
      {children}
    </div>
  );
};

export default LeftPanel;
