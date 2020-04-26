/** @jsx jsx */
import { useEffect } from 'react';

import { jsx } from '@emotion/core';

import { RIGHT_PANEL_WIDTH } from '../../common/constants';
import { SlotWidthProps } from '../../common/types';
import {
  removeFromGridStateInStorage,
  resolveDimension,
} from '../../common/utils';
import { usePageLayoutGrid } from '../../controllers';

import SlotDimensions from './slot-dimensions';
import { rightPanelStyles } from './styles';

export default (props: SlotWidthProps) => {
  const { children, isFixed, width, shouldPersistWidth, testId } = props;

  const rightPanelWidth = resolveDimension(
    RIGHT_PANEL_WIDTH,
    width,
    shouldPersistWidth,
  );

  usePageLayoutGrid({ [RIGHT_PANEL_WIDTH]: rightPanelWidth });
  useEffect(() => {
    return () => {
      removeFromGridStateInStorage('gridState', RIGHT_PANEL_WIDTH);
      document.documentElement.style.removeProperty(`--${RIGHT_PANEL_WIDTH}`);
    };
  }, []);

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
