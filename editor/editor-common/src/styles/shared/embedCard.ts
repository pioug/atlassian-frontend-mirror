import { css } from '@emotion/react';

import { token } from '@atlaskit/tokens';

export const embedCardStyles = css({
  '.ProseMirror': {
    ".embedCardView-content-wrap[layout^='wrap-']": {
      maxWidth: '100%',
    },
    ".embedCardView-content-wrap[layout='wrap-left']": {
      float: 'left',
    },
    ".embedCardView-content-wrap[layout='wrap-right']": {
      float: 'right',
    },
    ".embedCardView-content-wrap[layout='wrap-right'] + .embedCardView-content-wrap[layout='wrap-left']":
      {
        clear: 'both',
      },
  },
});

export const embedSpacingStyles = css({
  margin: `0 ${token('space.150', '12px')}`,
});
