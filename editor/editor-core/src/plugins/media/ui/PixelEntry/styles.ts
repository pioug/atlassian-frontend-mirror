import { css } from '@emotion/react';
import { token } from '@atlaskit/tokens';

const PIXEL_SIZING_WRAPPER_MINIMUM_WIDTH = 120;

export const pixelSizingWrapper = css`
  display: grid;
  grid-template-columns: 1fr 1em 1fr 0;
  grid-template-rows: auto;
  grid-template-areas: 'widthinput label heightinput submit';
  width: ${PIXEL_SIZING_WRAPPER_MINIMUM_WIDTH}px;
  text-align: center;
  height: ${token('space.300', '24px')};

  // Atlaskit fieldset does not allow style override
  & > * {
    margin-top: 0 !important;
  }
`;
export const pixelEntryForm = css`
  form {
    width: 100%;
  }
`;

export const pixelSizingInput = css`
  width: 100%;
  height: ${token('space.300', '24px')};
  & input {
    text-align: center;
  }
`;
export const pixelSizingLabel = css`
  grid-area: label;
  line-height: ${token('space.300', '24px')};
`;
export const pixelSizingWidthInput = css`
  grid-area: widthinput;
`;
export const pixelSizingHeightInput = css`
  grid-area: heightinput;
`;

export const pixelEntryHiddenSubmit = css`
  grid-area: submit;
  visibility: hidden;
  width: 0;
  height: 0;
`;

export const pixelSizingFullWidthLabelStyles = css`
  min-width: ${PIXEL_SIZING_WRAPPER_MINIMUM_WIDTH}px;
  height: ${token('space.300', '24px')};
  display: flex;
  justify-content: center;
  align-items: center;
`;
