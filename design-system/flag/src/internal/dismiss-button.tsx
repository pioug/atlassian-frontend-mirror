/** @jsx jsx */
import { memo } from 'react';

import { css, jsx } from '@emotion/react';
import FocusRing from '@atlaskit/focus-ring';
import ChevronDownIcon from '@atlaskit/icon/glyph/hipchat/chevron-down';
import ChevronUpIcon from '@atlaskit/icon/glyph/hipchat/chevron-up';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import { token } from '@atlaskit/tokens';

import { flagTextColorToken } from '../theme';
import { AppearanceTypes } from '../types';

const buttonStyles = css({
  display: 'flex',
  width: '24px',
  height: '24px',
  padding: token('space.0', '0px'),
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
    <FocusRing>
      <button
        type="button"
        css={buttonStyles}
        onClick={onClick}
        aria-expanded={isBold ? isExpanded : undefined}
        data-testid={buttonTestId}
      >
        <ButtonIcon
          label={buttonLabel}
          size={size}
          primaryColor={flagTextColorToken[appearance]}
        />
      </button>
    </FocusRing>
  );
};

export default memo(DismissButton);
