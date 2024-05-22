/** @jsx jsx */

import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { fontSizeSmall } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';
import * as colors from '@atlaskit/theme/colors';

export const truncate = (width: string = '100%') =>
  css({
    overflowX: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    width: width,
  });

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const WhatsNewResultsListContainer = styled.div({
  position: 'relative',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const WhatsNewResultsListGroupWrapper = styled.div({
  padding: `${token('space.100', '8px')} 0 ${token('space.100', '8px')} 0`,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const WhatsNewResultsListGroupTitle = styled.div({
  color: token('color.text.subtlest', colors.N200),
  fontSize: `${fontSizeSmall()}px`,
  fontWeight: 'bold',
  padding: `0 ${token('space.100', '8px')} ${token('space.100', '8px')} ${token(
    'space.100',
    '8px',
  )}`,
  textTransform: 'uppercase',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const ToggleShowWhatsNewResultsContainer = styled.div({
  padding: `${token('space.100', '8px')} 0`,
  span: {
    margin: 0,
  },
});
