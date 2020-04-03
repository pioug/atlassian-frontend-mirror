import { css } from 'styled-components';

const mediaSingleClassName = 'media-single';

const mediaSingleSharedStyle = css`
  li .${mediaSingleClassName} {
    margin: 0;
  }

  /* Hack for chrome to fix media single position
     inside a list when media is the first child */
  &.ua-chrome li > .mediaSingleView-content-wrap::before {
    content: '';
    display: block;
    height: 0;
  }

  table .${mediaSingleClassName} {
    margin-top: 12px;
    margin-bottom: 12px;
    clear: both;
  }

  .${mediaSingleClassName}.image-wrap-right
    + .${mediaSingleClassName}.image-wrap-left {
    clear: both;
  }

  .${mediaSingleClassName}.image-wrap-left
    + .${mediaSingleClassName}.image-wrap-right,
    .${mediaSingleClassName}.image-wrap-right
    + .${mediaSingleClassName}.image-wrap-left,
    .${mediaSingleClassName}.image-wrap-left
    + .${mediaSingleClassName}.image-wrap-left,
    .${mediaSingleClassName}.image-wrap-right
    + .${mediaSingleClassName}.image-wrap-right {
    margin-right: 0;
    margin-left: 0;
  }
`;

export { mediaSingleSharedStyle, mediaSingleClassName };
