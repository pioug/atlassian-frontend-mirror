import { css } from 'styled-components';

const richMediaClassName = 'rich-media-item';

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

  table .${richMediaClassName} {
    margin-top: 12px;
    margin-bottom: 12px;
    clear: both;
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
`;

export { mediaSingleSharedStyle, richMediaClassName };
