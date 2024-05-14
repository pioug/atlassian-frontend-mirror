import React, { memo } from 'react';

import ChevronDownIcon from '@atlaskit/icon/glyph/hipchat/chevron-down';
import ChevronUpIcon from '@atlaskit/icon/glyph/hipchat/chevron-up';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import { Pressable, xcss } from '@atlaskit/primitives';

import { flagTextColorToken } from '../theme';
import { type AppearanceTypes } from '../types';

const buttonStyles = xcss({
  display: 'flex',
  width: '24px',
  height: '24px',
  padding: 'space.0',
  alignItems: 'center',
  justifyContent: 'center',
  flex: '0 0 auto',
  background: 'none',
  borderStyle: 'none',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
});

interface DismissButtonProps {
  appearance: AppearanceTypes;
  onClick: (...args: any) => void;
  isExpanded: boolean;
  isBold: boolean;
  testId?: string;
}

const DismissButton = ({
  appearance,
  onClick,
  isBold,
  isExpanded,
  testId,
}: DismissButtonProps) => {
  let ButtonIcon = CrossIcon;
  let buttonLabel = 'Dismiss';

  let size: 'small' | 'medium' = 'small';
  let buttonTestId = testId && `${testId}-dismiss`;

  if (isBold) {
    ButtonIcon = isExpanded ? ChevronUpIcon : ChevronDownIcon;
    buttonLabel = isExpanded ? 'Collapse' : 'Expand';
    size = 'medium';
    buttonTestId = testId && `${testId}-toggle`;
  }

  return (
    <Pressable
      xcss={buttonStyles}
      onClick={onClick}
      aria-expanded={isBold ? isExpanded : undefined}
      testId={buttonTestId}
    >
      <ButtonIcon
        label={buttonLabel}
        size={size}
        primaryColor={flagTextColorToken[appearance]}
      />
    </Pressable>
  );
};

export default memo(DismissButton);
