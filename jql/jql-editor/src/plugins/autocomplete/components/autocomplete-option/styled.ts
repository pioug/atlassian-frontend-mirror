import styled from '@emotion/styled';

import { N100, N20, N50, N800 } from '@atlaskit/theme/colors';
import { codeFontFamily, fontFamily } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const TooltipContent = styled.div({
  fontFamily: fontFamily(),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const OptionListItem = styled.li<{
  isSelected: boolean;
  isDeprecated: boolean;
}>(
  {
    cursor: 'pointer',
    padding: `${token('space.075', '6px')} ${token('space.100', '8px')}`,
    fontFamily: codeFontFamily(),
    lineHeight: '24px',
  },
  ({ isSelected }) =>
    isSelected && {
      background: token('color.background.neutral.subtle.hovered', N20),
    },
  ({ isDeprecated }) =>
    isDeprecated && {
      cursor: 'default',
      color: token('color.text.disabled', N50),
    },
);

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const OptionName = styled.div({
  color: token('color.text', N800),
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  // Added so that overflowed option names do not squish the deprecated info icon
  flex: 1,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const DeprecatedOptionContainer = styled.div({
  color: token('color.text.disabled', N50),
  display: 'flex',
  justifyContent: 'space-between',
  opacity: 0.6,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const OptionHighlight = styled.span({
  fontWeight: 'bold',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const FieldType = styled.div({
  display: 'flex',
  alignItems: 'center',
  marginTop: token('space.negative.025', '-2px'),
  color: token('color.text.subtlest', N100),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const FieldTypeIcon = styled.span({
  display: 'flex',
  marginRight: token('space.050', '4px'),
});
