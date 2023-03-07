import React from 'react';
import ChevronUpIcon from '@atlaskit/icon/glyph/chevron-up';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';

const ChevronIcon: React.FC<{
  open: boolean;
}> = ({ open }) =>
  open ? (
    <ChevronUpIcon label="collapse" />
  ) : (
    <ChevronDownIcon label="expand" />
  );

export default ChevronIcon;
