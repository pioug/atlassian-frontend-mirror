import { css } from 'styled-components';

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

  .mediaSingleView-content-wrap[layout='center'] {
    clear: both;
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

  @media all and (max-width: ${wrappedMediaBreakoutPoint}px) {
    div.mediaSingleView-content-wrap[layout='wrap-left'],
    div.mediaSingleView-content-wrap[data-layout='wrap-left'],
    div.mediaSingleView-content-wrap[layout='wrap-right'],
    div.mediaSingleView-content-wrap[data-layout='wrap-right'] {
      float: none;
      overflow: auto;
      margin: 12px 0;
    }
  }
`;

export { mediaSingleSharedStyle, richMediaClassName };
