/* eslint-disable @atlaskit/design-system/use-tokens-space */
import { css } from '@emotion/react';

export const indentationSharedStyles = css({
  '.fabric-editor-indentation-mark': {
    "&[data-level='1']": {
      marginLeft: '30px',
    },
    "&[data-level='2']": {
      marginLeft: '60px',
    },
    "&[data-level='3']": {
      marginLeft: '90px',
    },
    "&[data-level='4']": {
      marginLeft: '120px',
    },
    "&[data-level='5']": {
      marginLeft: '150px',
    },
    "&[data-level='6']": {
      marginLeft: '180px',
    },
  },
});
