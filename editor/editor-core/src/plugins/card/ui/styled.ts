import styled, { css } from 'styled-components';
export const embedCardStyles = css`
  .ProseMirror {
    .embedCardView-content-wrap[layout^='wrap-'] {
      max-width: 100%;
    }

    .embedCardView-content-wrap[layout='wrap-left'] {
      float: left;
    }

    .embedCardView-content-wrap[layout='wrap-right'] {
      float: right;
    }

    .embedCardView-content-wrap[layout='wrap-right']
      + .embedCardView-content-wrap[layout='wrap-left'] {
      clear: both;
    }
  }
`;

export const EmbedSpacing = styled.div`
  margin: 0 10px;
`;
