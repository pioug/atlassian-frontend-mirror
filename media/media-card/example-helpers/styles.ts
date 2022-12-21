import { token } from '@atlaskit/tokens';
import { css } from '@emotion/react';

export const editableCardOptionsStyles = css`
  padding: 20px;
  border-bottom: 1px solid ${token('color.border', '#ccc')};
  max-width: 700px;
`;

export const sliderWrapperStyles = css`
  display: flex;
  width: 50%;

  > * {
    flex: 1;
    margin: 10px;
  }
`;

export const editableCardContentStyles = css`
  /* Not making the wrapper fancier or center elements in order to have a more realistic scenario */
  padding: 20px;
  border: 2px dashed;
  margin: 0 10px 50px 10px;
  overflow: hidden;
  background: ${token(
    'color.background.accent.orange.subtlest',
    'antiquewhite',
  )};
  box-sizing: border-box;
`;

export const optionsWrapperStyles = css`
  display: flex;

  > * {
    flex: 1;
    margin: 10px;
  }
`;

export const cardDimensionsWrapperStyles = css`
  margin: 10px 10px 20px 10px;
  display: flex;

  > div {
    border: 1px solid ${token('color.border.bold', 'black')};
    margin: 5px;
    padding: 5px;
    border-radius: 3px;
  }
`;

export const flexWrapperStyles = css`
  display: flex;
`;
export const cardPreviewWrapperStyles = css`
  flex: 1;
`;

export const cardWrapperStyles = css`
  border: 1px solid ${token('color.border.bold', 'black')};
  padding: 10px;
  margin: 5px;
  flex-direction: column;
  width: 310px;
  height: 280px;
  overflow: auto;
  display: inline-block;
`;

export const cardFlowHeaderStyles = css`
  margin: 20px auto;
  padding: 10px 0;
`;

export const externalIdentifierWrapperStyles = css`
  display: flex;
  justify-content: space-around;
  margin: 0 auto;

  h2 {
    margin-bottom: 10px;
  }
`;

export const inlineCardVideoWrapperItemStyles = css`
  padding: 10px;
  border: 1px solid ${token('color.border.bold', 'black')};
  margin: 10px;
`;

export const mediaViewerExampleColumnStyles = css`
  flex: 1;

  > div {
    width: initial;
    height: initial;
  }
`;

export const mediaViewerExampleWrapperStyles = css`
  display: flex;
`;

export const mediaInlineWrapperStyles = css`
  display: flex;
  align-items: center;
  flex-direction: column;
  margin: 100px;
`;

export const mediaInlineTableStyles = css`
  width: 800px;
  tr,
  td {
    border: 1px solid ${token('color.border', '#ddd')};
  }
`;
