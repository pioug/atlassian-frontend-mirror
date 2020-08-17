import styled from 'styled-components';

import { MediaSingle as UIMediaSingle } from '@atlaskit/editor-common';
const AkEditorMediaLinkClassName = 'ak-editor-media-link'; // TODO: Make this a prop

export const ExtendedUIMediaSingle = styled(UIMediaSingle)`
  .${AkEditorMediaLinkClassName} {
    align-items: center;
    justify-content: center;
  }

  /* web */
  @media (any-hover: hover) {
    .${AkEditorMediaLinkClassName} {
      width: 20px;
      height: 20px;

      /* ShortcutIcon */
      span[role='img'] {
        width: initial;
        height: initial;

        > svg {
          width: 24px;
          height: 24px;
        }
      }
    }

    &:not(:hover) {
      .${AkEditorMediaLinkClassName} {
        opacity: 0;
      }
    }

    &:focus-within {
      .${AkEditorMediaLinkClassName} {
        opacity: 1;
      }
    }
  }
  /* mobile */
  @media (pointer: none) {
    .${AkEditorMediaLinkClassName} {
      width: 36px;
      height: 36px;
    }
  }

  ${({ layout }) =>
    layout === 'full-width' || layout === 'wide'
      ? `
  margin-left: 50%;
  transform: translateX(-50%);
  `
      : ``} transition: all 0.1s linear;
`;
