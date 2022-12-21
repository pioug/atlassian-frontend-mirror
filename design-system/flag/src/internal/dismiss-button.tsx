/** @jsx jsx */
import { memo } from 'react';

import { jsx } from '@emotion/react';
import { UNSAFE_Box as Box } from '@atlaskit/ds-explorations';
import FocusRing from '@atlaskit/focus-ring';
import ChevronDownIcon from '@atlaskit/icon/glyph/hipchat/chevron-down';
import ChevronUpIcon from '@atlaskit/icon/glyph/hipchat/chevron-up';
import CrossIcon from '@atlaskit/icon/glyph/cross';

import { flagTextColorToken } from '../theme';
import { AppearanceTypes } from '../types';

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
      <Box
        as="button"
        type="button"
        justifyContent="center"
        alignItems="center"
        borderStyle="none"
        borderRadius="normal"
        padding="scale.0"
        width="size.200"
        height="size.200"
        onClick={onClick}
        aria-expanded={isBold ? isExpanded : undefined}
        UNSAFE_style={{
          flex: '0 0 auto',
          background: 'none',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}
        testId={buttonTestId}
      >
        <ButtonIcon
          label={buttonLabel}
          size={size}
          primaryColor={flagTextColorToken[appearance]}
        />
      </Box>
    </FocusRing>
  );
};

export default memo(DismissButton);
