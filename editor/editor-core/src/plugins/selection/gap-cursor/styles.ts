import { keyframes } from 'styled-components';

const gapCursorBlink = keyframes`
  from, to {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
`;

export const hideCaretModifier = 'ProseMirror-hide-gapcursor';
const gapCursor = '.ProseMirror-gapcursor';
const prosemirrorwidget = '.ProseMirror-widget';
const wrapLeft = '[layout="wrap-left"]';
const wrapRight = '[layout="wrap-right"]';

export const gapCursorStyles = `
  /* =============== GAP CURSOR ================== */
  .ProseMirror {
    &.${hideCaretModifier} {
      caret-color: transparent;
    }

    ${gapCursor} {
      display: none;
      pointer-events: none;
      position: relative;

      & span {
        caret-color: transparent;
        position: absolute;
        height: 100%;
        width: 100%;
        display: block;
      }

      & span::after {
        animation: 1s ${gapCursorBlink} step-end infinite;
        border-left: 1px solid;
        content: '';
        display: block;
        position: absolute;
        top: 0;
        height: 100%;
      }
      &.-left span::after {
        left: -3px;
      }
      &.-right span::after {
        right: -3px;
      }
      & span[layout='full-width'],
      & span[layout='wide'] {
        margin-left: 50%;
        transform: translateX(-50%);
      }
      &${wrapRight} {
        float: right;
      }

      /* fix vertical alighment of gap cursor */
      &:first-child + ul,
      &:first-child + span + ul,
      &:first-child + ol,
      &:first-child + span + ol,
      &:first-child + pre,
      &:first-child + span + pre,
      &:first-child + blockquote,
      &:first-child + span + blockquote {
        margin-top: 0;
      }
    }
    &.ProseMirror-focused ${gapCursor} {
      display: block;
      border-color: transparent;
    }
  }

  /* This hack below is for two images aligned side by side */
  ${gapCursor}${wrapLeft} + span + ${wrapLeft},
  ${gapCursor}${wrapRight} + span + ${wrapRight},
  ${gapCursor} + ${wrapLeft} + ${wrapRight},
  ${gapCursor} + ${wrapLeft} + span + ${wrapRight},
  ${gapCursor} + ${wrapRight} + ${wrapLeft},
  ${gapCursor} + ${wrapRight} + span + ${wrapLeft},
  ${wrapLeft} + ${gapCursor} + ${wrapRight},
  ${wrapLeft} + ${gapCursor} + span ${wrapRight},
  ${wrapRight} + ${gapCursor} + ${wrapLeft},
  ${wrapRight} + ${gapCursor} + span + ${wrapLeft},
  ${wrapLeft} + ${gapCursor} {
    clear: none;
  }

  ${wrapLeft} + ${gapCursor} + ${wrapRight} > div,
  ${wrapLeft} + ${gapCursor} + span + ${wrapRight} > div,
  ${wrapRight} + ${gapCursor} + ${wrapLeft} > div,
  ${wrapRight} + ${gapCursor} + span + ${wrapLeft} > div,
  ${gapCursor} + ${wrapRight} + ${wrapLeft} > div,
  ${gapCursor} + ${wrapRight} + span + ${wrapLeft} > div,
  ${gapCursor} + ${wrapLeft} + ${wrapRight} > div,
  ${gapCursor} + ${wrapLeft} + span + ${wrapRight} > div {
    margin-right: 0;
    margin-left: 0;
    margin-bottom: 0;
  }

  ${wrapLeft} + ${gapCursor},
  ${wrapRight} + ${gapCursor} {
    float: left;
  }

  ${gapCursor} + ${wrapLeft} + span + ${wrapRight}::after,
  ${gapCursor} + ${wrapRight} + span + ${wrapLeft}::after,
  ${wrapLeft} + ${gapCursor} + ${wrapRight}::after,
  ${wrapLeft} + ${gapCursor} + span + ${wrapRight}::after,
  ${wrapRight} + ${gapCursor} + ${wrapLeft}::after,
  ${wrapRight} + ${gapCursor} + span + ${wrapLeft}::after {
    visibility: hidden;
    display: block;
    font-size: 0;
    content: ' ';
    clear: both;
    height: 0;
  }

  ${wrapLeft} + ${gapCursor} + ${wrapRight} + *,
  ${wrapLeft} + ${gapCursor} + ${wrapRight} + span + *,
  ${wrapRight} + ${gapCursor} + ${wrapLeft} + *,
  ${wrapRight} + ${gapCursor} + ${wrapLeft} + span + *,
  ${wrapLeft} + ${gapCursor} + span + ${wrapRight} + *,
  ${wrapRight} + ${gapCursor} + span + ${wrapLeft} + *,
  ${gapCursor} + ${wrapLeft} + span + ${wrapRight} + *,
  ${gapCursor} + ${wrapRight} + span + ${wrapLeft} + *,
  ${wrapLeft} + ${gapCursor} + ${wrapRight} + * > *,
  ${wrapLeft} + ${gapCursor} + ${wrapRight} + span + * > *,
  ${wrapRight} + ${gapCursor} + ${wrapLeft} + * > *,
  ${wrapRight} + ${gapCursor} + ${wrapLeft} + span + * > *,
  ${wrapLeft} + ${gapCursor} + span + ${wrapRight} + * > *,
  ${wrapRight} + ${gapCursor} + span + ${wrapLeft} + * > *,
  ${gapCursor} + ${wrapLeft} + span + ${wrapRight} + * > *,
  ${gapCursor} + ${wrapRight} + span + ${wrapLeft} + * > *,
  ${prosemirrorwidget} + ${gapCursor} + *,
  ${prosemirrorwidget} + ${gapCursor} + span + * {
    margin-top: 0;
  }
`;
