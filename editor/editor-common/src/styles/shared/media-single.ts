import { css } from '@emotion/react';

import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

const richMediaClassName = 'rich-media-item';

const wrappedMediaBreakoutPoint = 410;

const mediaSingleSharedStyle = css`
  li .${richMediaClassName} {
    margin: 0;
  }

  /* Hack for chrome to fix media single position
     inside a list when media is the first child */
  &.ua-chrome li > .mediaSingleView-content-wrap::before {
    content: '';
    display: block;
    height: 0;
  }

  &.ua-firefox {
    .mediaSingleView-content-wrap {
      user-select: none;
    }

    .captionView-content-wrap {
      user-select: text;
    }
  }

  .mediaSingleView-content-wrap[layout='center'] {
    clear: both;
  }

  table .${richMediaClassName} {
    margin-top: ${token('space.150', '12px')};
    margin-bottom: ${token('space.150', '12px')};
    clear: both;

    &.image-wrap-left,
    &.image-wrap-right {
      clear: none;

      &:first-child {
        margin-top: ${token('space.150', '12px')};
      }
    }
  }

  .${richMediaClassName}.image-wrap-right
    + .${richMediaClassName}.image-wrap-left {
    clear: both;
  }

  .${richMediaClassName}.image-wrap-left
    + .${richMediaClassName}.image-wrap-right,
    .${richMediaClassName}.image-wrap-right
    + .${richMediaClassName}.image-wrap-left,
    .${richMediaClassName}.image-wrap-left
    + .${richMediaClassName}.image-wrap-left,
    .${richMediaClassName}.image-wrap-right
    + .${richMediaClassName}.image-wrap-right {
    margin-right: 0;
    margin-left: 0;
  }

  ${!getBooleanFF('platform.editor.media.extended-resize-experience') &&
  `@media all and (max-width: ${wrappedMediaBreakoutPoint}px) {
    div.mediaSingleView-content-wrap[layout='wrap-left'],
    div.mediaSingleView-content-wrap[data-layout='wrap-left'],
    div.mediaSingleView-content-wrap[layout='wrap-right'],
    div.mediaSingleView-content-wrap[data-layout='wrap-right'] {
      float: none;
      overflow: auto;
      margin: 12px 0;
    }
  }`}
`;

export { mediaSingleSharedStyle, richMediaClassName };
