import { css } from '@emotion/react';
import styled from '@emotion/styled';

import { N100, N20, N50, N800 } from '@atlaskit/theme/colors';
import {
  codeFontFamily,
  fontFamily,
  // eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
  gridSize,
} from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

export const TooltipContent = styled.div`
  font-family: ${fontFamily};
`;

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
export const OptionListItem = styled.li<{
  isSelected: boolean;
  isDeprecated: boolean;
}>`
  cursor: pointer;
  padding: ${token('space.075', '6px')} ${(5 / 4) * gridSize()}px;
  font-family: ${codeFontFamily};
  line-height: 24px;
  ${props =>
    props.isSelected
      ? css`
          background: ${token('color.background.neutral.subtle.hovered', N20)};
        `
      : ''}
  ${props =>
    props.isDeprecated
      ? css`
          cursor: default;
          color: ${token('color.text.disabled', N50)};
        `
      : ''}
`;

export const OptionName = styled.div`
  color: ${token('color.text', N800)};
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  // Added so that overflowed option names do not squish the deprecated info icon
  flex: 1;
`;

export const DeprecatedOptionContainer = styled.div`
  color: ${token('color.text.disabled', N50)};
  display: flex;
  justify-content: space-between;
  opacity: 0.6;
`;

export const OptionHighlight = styled.span`
  font-weight: bold;
`;

export const FieldType = styled.div`
  display: flex;
  align-items: center;
  margin-top: ${token('space.negative.025', '-2px')};
  color: ${token('color.text.subtlest', N100)};
`;

export const FieldTypeIcon = styled.span`
  display: flex;
  margin-right: ${token('space.050', '4px')};
`;
