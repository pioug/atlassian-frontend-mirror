/** @jsx jsx */
import { useEffect } from 'react';

import { jsx } from '@emotion/core';

import {
  DEFAULT_RIGHT_PANEL_WIDTH,
  VAR_RIGHT_PANEL_WIDTH,
} from '../../common/constants';
import { SlotWidthProps } from '../../common/types';
import {
  getPageLayoutSlotSelector,
  resolveDimension,
} from '../../common/utils';
import { publishGridState, useSkipLinks } from '../../controllers';

import SlotDimensions from './slot-dimensions';
import { rightPanelStyles } from './styles';

const RightPanel = (props: SlotWidthProps) => {
  const {
    children,
    isFixed,
    width = DEFAULT_RIGHT_PANEL_WIDTH,
    shouldPersistWidth,
    testId,
    id,
    skipLinkTitle,
  } = props;

  const rightPanelWidth = resolveDimension(
    VAR_RIGHT_PANEL_WIDTH,
    width,
    shouldPersistWidth,
  );

  const { registerSkipLink, unregisterSkipLink } = useSkipLinks();

  useEffect(() => {
    publishGridState({ [VAR_RIGHT_PANEL_WIDTH]: rightPanelWidth });
    return () => {
      publishGridState({ [VAR_RIGHT_PANEL_WIDTH]: 0 });
      unregisterSkipLink(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rightPanelWidth, id]);

  if (id && skipLinkTitle) {
    registerSkipLink({ id, skipLinkTitle });
  }

  return (
    <div
      css={rightPanelStyles(isFixed)}
      data-testid={testId}
      id={id}
      {...getPageLayoutSlotSelector('right-panel')}
    >
      <SlotDimensions
        variableName={VAR_RIGHT_PANEL_WIDTH}
        value={rightPanelWidth}
      />
      {children}
    </div>
  );
};

export default RightPanel;
