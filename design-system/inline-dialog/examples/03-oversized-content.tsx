/** @jsx jsx */
import { jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import InlineDialog from '../src';

const centeredContainerStyles = {
  display: 'flex',
  justifyContent: 'center',
};

const targetStyles = {
  background: token('color.background.success.bold'),
  padding: '10px',
};

const scrollContainerStyles = {
  maxHeight: 'inherit',
  maxWidth: 'inherit',
  overflow: 'auto',
};

const oversizedStyles = {
  height: '2000px',
  width: '2000px',
  background: token('color.background.warning.bold'),
};

const dialogContentStyles = (
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
  <div style={scrollContainerStyles}>
{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
    <div style={oversizedStyles}>
      The orange box and the scrollable area should not break out of the
      inline-dialog area.
    </div>
  </div>
);

const InlineDialogOversizedExample = () => (
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
  <div style={centeredContainerStyles}>
    <InlineDialog content={dialogContentStyles} isOpen>
{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
      <div style={targetStyles}>I am the target</div>
    </InlineDialog>
  </div>
);

export default InlineDialogOversizedExample;
