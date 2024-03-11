import { css } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import {
  RECENT_SEARCH_WIDTH_IN_PX,
  RECENT_SEARCH_WIDTH_WITHOUT_ITEMS_IN_PX,
} from '../../ui';

export const inputWrapper = css({
  display: 'flex',
  lineHeight: 0,
  padding: `${token('space.075', '6px')} 0`,
  alignItems: 'center',
});

export const container = css({
  display: 'flex',
  flexDirection: 'column',
  overflow: 'auto',
  padding: 0,
  width: `${RECENT_SEARCH_WIDTH_WITHOUT_ITEMS_IN_PX}px`,
  lineHeight: 'initial',
});

export const containerWithProvider = css({
  width: `${RECENT_SEARCH_WIDTH_IN_PX}px`,
});
