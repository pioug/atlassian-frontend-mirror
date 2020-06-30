/** @jsx jsx */
import { useEffect } from 'react';

import { jsx } from '@emotion/core';

import {
  DEFAULT_LEFT_PANEL_WIDTH,
  LEFT_PANEL_WIDTH,
} from '../../common/constants';
import { SlotWidthProps } from '../../common/types';
import { resolveDimension } from '../../common/utils';
import { publishGridState, useSkipLinks } from '../../controllers';

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
    LEFT_PANEL_WIDTH,
    width,
    shouldPersistWidth,
  );

  const { registerSkipLink, unregisterSkipLink } = useSkipLinks();

  if (id && skipLinkTitle) {
    registerSkipLink({ id, skipLinkTitle });
  }
  useEffect(() => {
    publishGridState({ [LEFT_PANEL_WIDTH]: leftPanelWidth });
    return () => {
      publishGridState({ [LEFT_PANEL_WIDTH]: 0 });
      unregisterSkipLink(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leftPanelWidth, id]);

  return (
    <div css={leftPanelStyles(isFixed)} data-testid={testId} id={id}>
      <SlotDimensions variableName={LEFT_PANEL_WIDTH} value={leftPanelWidth} />
      {children}
    </div>
  );
};

export default LeftPanel;
