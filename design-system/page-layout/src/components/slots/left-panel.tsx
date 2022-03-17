/** @jsx jsx */
import { useEffect } from 'react';

import { css, jsx } from '@emotion/core';

import {
  DEFAULT_LEFT_PANEL_WIDTH,
  LEFT_PANEL,
  LEFT_PANEL_WIDTH,
  VAR_LEFT_PANEL_WIDTH,
} from '../../common/constants';
import { SlotWidthProps } from '../../common/types';
import {
  getPageLayoutSlotSelector,
  resolveDimension,
} from '../../common/utils';
import { publishGridState, useSkipLink } from '../../controllers';

import SlotFocusRing from './internal/slot-focus-ring';
import SlotDimensions from './slot-dimensions';

const leftPanelStyles = css({
  gridArea: LEFT_PANEL,
});

const leftPanelFixedStyles = css({
  width: LEFT_PANEL_WIDTH,
  position: 'fixed',
  top: 0,
  bottom: 0,
  left: 0,
});

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
  }, [leftPanelWidth]);

  useSkipLink(id, skipLinkTitle);

  return (
    <SlotFocusRing>
      {({ className }) => (
        <div
          css={[leftPanelStyles, isFixed && leftPanelFixedStyles]}
          className={className}
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
      )}
    </SlotFocusRing>
  );
};

export default LeftPanel;
