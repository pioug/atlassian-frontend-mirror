import { css } from '@emotion/react';

export const indentationSharedStyles = css({
  '.fabric-editor-indentation-mark': {
    "&[data-level='1']": {
      // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview
      marginLeft: '30px',
    },
    "&[data-level='2']": {
      // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview
      marginLeft: '60px',
    },
    "&[data-level='3']": {
      // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview
      marginLeft: '90px',
    },
    "&[data-level='4']": {
      // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview
      marginLeft: '120px',
    },
    "&[data-level='5']": {
      // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview
      marginLeft: '150px',
    },
    "&[data-level='6']": {
      // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview
      marginLeft: '180px',
    },
  },
});
