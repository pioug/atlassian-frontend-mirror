import React from 'react';
import { colors } from '@atlaskit/theme';
import InlineDialog from '../src';

const centeredContainerStyles = {
  display: 'flex',
  justifyContent: 'center',
};

const targetStyles = {
  background: colors.G300,
  padding: '10px',
};

const scrollContainer = {
  maxHeight: 'inherit',
  maxWidth: 'inherit',
  overflow: 'auto',
};

const oversizedStyles = {
  height: '2000px',
  width: '2000px',
  background: colors.Y300,
};

const dialogContent = (
  <div style={scrollContainer}>
    <div style={oversizedStyles}>
      The orange box and the scrollable area should not break out of the
      inline-dialog area.
    </div>
  </div>
);

export default () => (
  <div style={centeredContainerStyles}>
    <InlineDialog content={dialogContent} isOpen>
      <div style={targetStyles}>I am the target</div>
    </InlineDialog>
  </div>
);
