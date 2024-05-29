/** @jsx jsx */
import { useEffect } from 'react';

import { css, jsx } from '@emotion/react';

import {
  DEFAULT_RIGHT_PANEL_WIDTH,
  RIGHT_PANEL,
  RIGHT_PANEL_WIDTH,
  VAR_RIGHT_PANEL_WIDTH,
} from '../../common/constants';
import { type SlotWidthProps } from '../../common/types';
import {
  getPageLayoutSlotSelector,
  resolveDimension,
} from '../../common/utils';
import { publishGridState, useSkipLink } from '../../controllers';

import SlotFocusRing from './internal/slot-focus-ring';
import SlotDimensions from './slot-dimensions';

const baseStyles = css({
  gridArea: RIGHT_PANEL,
});

const fixedStyles = css({
  width: RIGHT_PANEL_WIDTH,
  position: 'fixed',
  top: 0,
  right: 0,
  bottom: 0,
});

/**
 * __Right panel__
 *
 * Provides a slot for a right panel within the PageLayout.
 *
 * - [Examples](https://atlassian.design/components/page-layout/examples)
 * - [Code](https://atlassian.design/components/page-layout/code)
 */
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

  useEffect(() => {
    publishGridState({ [VAR_RIGHT_PANEL_WIDTH]: rightPanelWidth });
    return () => {
      publishGridState({ [VAR_RIGHT_PANEL_WIDTH]: 0 });
    };
  }, [rightPanelWidth]);

  useSkipLink(id, skipLinkTitle);

  return (
    <SlotFocusRing>
      {({ className }) => (
        <div
          css={[baseStyles, isFixed && fixedStyles]}
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
          className={className}
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
      )}
    </SlotFocusRing>
  );
};

export default RightPanel;
