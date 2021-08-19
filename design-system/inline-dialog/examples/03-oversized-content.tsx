/** @jsx jsx */
import { jsx } from '@emotion/core';

import { G300, Y300 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import InlineDialog from '../src';

const centeredContainerStyles = {
  display: 'flex',
  justifyContent: 'center',
};

const targetStyles = {
  background: token('color.background.boldSuccess.resting', G300),
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
  background: token('color.background.boldWarning.resting', Y300),
};

const dialogContentStyles = (
  <div style={scrollContainerStyles}>
    <div style={oversizedStyles}>
      The orange box and the scrollable area should not break out of the
      inline-dialog area.
    </div>
  </div>
);

const InlineDialogOversizedExample = () => (
  <div style={centeredContainerStyles}>
    <InlineDialog content={dialogContentStyles} isOpen>
      <div style={targetStyles}>I am the target</div>
    </InlineDialog>
  </div>
);

export default InlineDialogOversizedExample;
