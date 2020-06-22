/** @jsx jsx */
import { useEffect } from 'react';

import { jsx } from '@emotion/core';

import {
  DEFAULT_LEFT_PANEL_WIDTH,
  LEFT_PANEL_WIDTH,
} from '../../common/constants';
import { SlotWidthProps } from '../../common/types';
import { resolveDimension } from '../../common/utils';
import { publishGridState } from '../../controllers';

import SlotDimensions from './slot-dimensions';
import { leftPanelStyles } from './styles';

const LeftPanel = (props: SlotWidthProps) => {
  const {
    children,
    isFixed,
    width = DEFAULT_LEFT_PANEL_WIDTH,
    shouldPersistWidth,
    testId,
  } = props;

  const leftPanelWidth = resolveDimension(
    LEFT_PANEL_WIDTH,
    width,
    shouldPersistWidth,
  );

  useEffect(() => {
    publishGridState({ [LEFT_PANEL_WIDTH]: leftPanelWidth });
    return () => {
      publishGridState({ [LEFT_PANEL_WIDTH]: 0 });
    };
  }, [leftPanelWidth]);

  return (
    <div css={leftPanelStyles(isFixed)} data-testid={testId}>
      <SlotDimensions variableName={LEFT_PANEL_WIDTH} value={leftPanelWidth} />
      {children}
    </div>
  );
};

export default LeftPanel;
