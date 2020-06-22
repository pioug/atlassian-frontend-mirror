/** @jsx jsx */
import { useEffect } from 'react';

import { jsx } from '@emotion/core';

import {
  DEFAULT_RIGHT_PANEL_WIDTH,
  RIGHT_PANEL_WIDTH,
} from '../../common/constants';
import { SlotWidthProps } from '../../common/types';
import { resolveDimension } from '../../common/utils';
import { publishGridState } from '../../controllers';

import SlotDimensions from './slot-dimensions';
import { rightPanelStyles } from './styles';

const RightPanel = (props: SlotWidthProps) => {
  const {
    children,
    isFixed,
    width = DEFAULT_RIGHT_PANEL_WIDTH,
    shouldPersistWidth,
    testId,
  } = props;

  const rightPanelWidth = resolveDimension(
    RIGHT_PANEL_WIDTH,
    width,
    shouldPersistWidth,
  );

  useEffect(() => {
    publishGridState({ [RIGHT_PANEL_WIDTH]: rightPanelWidth });
    return () => {
      publishGridState({ [RIGHT_PANEL_WIDTH]: 0 });
    };
  }, [rightPanelWidth]);

  return (
    <div css={rightPanelStyles(isFixed)} data-testid={testId}>
      <SlotDimensions
        variableName={RIGHT_PANEL_WIDTH}
        value={rightPanelWidth}
      />
      {children}
    </div>
  );
};

export default RightPanel;
