import { css } from '@emotion/react';

import { gridMediumMaxWidth } from '@atlaskit/editor-shared-styles';

const columnLayoutSharedStyle = css({
  '[data-layout-section]': {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    '& > *': {
      flex: 1,
      minWidth: 0,
    },
    '& > .unsupportedBlockView-content-wrap': {
      minWidth: 'initial',
    },
    [`@media screen and (max-width: ${gridMediumMaxWidth}px)`]: {
      flexDirection: 'column',
    },
  },
});

export { columnLayoutSharedStyle };
