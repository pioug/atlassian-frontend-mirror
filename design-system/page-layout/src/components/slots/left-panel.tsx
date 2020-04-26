/** @jsx jsx */
import { useEffect } from 'react';

import { jsx } from '@emotion/core';

import { LEFT_PANEL_WIDTH } from '../../common/constants';
import { SlotWidthProps } from '../../common/types';
import {
  removeFromGridStateInStorage,
  resolveDimension,
} from '../../common/utils';
import { usePageLayoutGrid } from '../../controllers';

import SlotDimensions from './slot-dimensions';
import { leftPanelStyles } from './styles';

export default (props: SlotWidthProps) => {
  const { children, isFixed, width, shouldPersistWidth, testId } = props;

  const leftPanelWidth = resolveDimension(
    LEFT_PANEL_WIDTH,
    width,
    shouldPersistWidth,
  );

  usePageLayoutGrid({ [LEFT_PANEL_WIDTH]: leftPanelWidth });
  useEffect(() => {
    return () => {
      removeFromGridStateInStorage('gridState', LEFT_PANEL_WIDTH);
      document.documentElement.style.removeProperty(`--${LEFT_PANEL_WIDTH}`);
    };
  }, []);

  return (
    <div css={leftPanelStyles(isFixed)} data-testid={testId}>
      <SlotDimensions variableName={LEFT_PANEL_WIDTH} value={leftPanelWidth} />
      {children}
    </div>
  );
};
