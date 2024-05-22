import styled from '@emotion/styled';

import { N200 } from '@atlaskit/theme/colors';
import { gridSize } from '@atlaskit/theme/constants';
import { h400 } from '@atlaskit/theme/typography';
import { token } from '@atlaskit/tokens';

import { errorIconColor, errorTextColor, errorTitleColor } from './constants';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const ErrorWrapper = styled.div({
  textAlign: 'center',
  padding: token('space.300', '24px'),
  color: errorIconColor,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const ErrorTitle = styled.p({
  color: errorTitleColor,
  lineHeight: `${gridSize() * 3}px`,
  margin: `${token('space.100', '8px')} 0`,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const ErrorText = styled.span({
  color: errorTextColor,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const TeamErrorTitle = styled.p(h400);

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const TeamErrorText = styled.p({
  color: token('color.text.subtlest', N200),
  marginTop: token('space.100', '8px'),
});
