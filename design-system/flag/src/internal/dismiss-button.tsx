/** @jsx jsx */
import { memo } from 'react';

import { jsx, css } from '@emotion/react';
import FocusRing from '@atlaskit/focus-ring';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import ChevronUpIcon from '@atlaskit/icon/glyph/chevron-up';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import {
  borderRadius as getBorderRadius,
  gridSize as getGridSize,
} from '@atlaskit/theme/constants';
import { useGlobalTheme } from '@atlaskit/theme/components';

import { getFlagTextColor } from '../theme';
import { AppearanceTypes } from '../types';

const gridSize = getGridSize();
const borderRadius = getBorderRadius();

const dismissButtonStyles = css({
  marginLeft: gridSize,
  padding: 0,
  flex: '0 0 auto',
  appearance: 'none',
  background: 'none',
  border: 'none',
  borderRadius,
  cursor: 'pointer',
  lineHeight: '1',
  whiteSpace: 'nowrap',
});

const crossIconStyles = css({
  paddingTop: `${gridSize}px`,
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
  const { mode } = useGlobalTheme();

  let ButtonIcon = CrossIcon;
  let buttonLabel = 'Dismiss';

  let size: 'small' | 'large' = 'small';
  let buttonTestId = testId && `${testId}-dismiss`;

  if (isBold) {
    ButtonIcon = isExpanded ? ChevronUpIcon : ChevronDownIcon;
    buttonLabel = isExpanded ? 'Collapse' : 'Expand';
    size = 'large';
    buttonTestId = testId && `${testId}-toggle`;
  }

  return (
    <FocusRing>
      <button
        style={{
          color: getFlagTextColor(appearance, mode),
        }}
        css={[dismissButtonStyles, !isBold && crossIconStyles]}
        onClick={onClick}
        data-testid={buttonTestId}
        type="button"
        aria-expanded={isBold ? isExpanded : undefined}
      >
        <ButtonIcon label={buttonLabel} size={size} />
      </button>
    </FocusRing>
  );
};

export default memo(DismissButton);
