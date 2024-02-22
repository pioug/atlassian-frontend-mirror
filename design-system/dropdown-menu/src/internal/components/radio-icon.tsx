import React from 'react';

import SVGIcon from '@atlaskit/icon/svg';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import { B400, N10, N100, N40 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

/**
 * __Radio icon__
 *
 * Used to visually represent the selected state in DropdownItemRadio
 *
 * @internal
 */
const RadioIcon = ({ checked }: { checked: boolean }) => {
  return (
    <SVGIcon
      label=""
      size="medium"
      primaryColor={
        checked
          ? token('color.background.selected.bold', B400)
          : token('color.background.input', N10)
      }
      secondaryColor={
        checked ? token('color.icon.inverse', N10) : 'transparent'
      }
    >
      <g fillRule="evenodd">
        <circle
          fill="currentColor"
          cx="12"
          cy="12"
          r="6"
          stroke={
            checked
              ? token('color.border.selected', B400)
              : token(
                  'color.border.input',
                  getBooleanFF(
                    'platform.design-system-team.border-checkbox_nyoiu',
                  )
                    ? N100
                    : N40,
                )
          }
          strokeWidth={
            getBooleanFF(
              'platform.design-system-team.update-input-border-wdith_5abwv',
            )
              ? 1
              : 2
          }
        />
        <circle fill="inherit" cx="12" cy="12" r="2" />
      </g>
    </SVGIcon>
  );
};

export default RadioIcon;
