import styled from 'styled-components';

export const CardSwitcherWrapper = styled.div`
  display: flex;
`;

export const CardSwitcherBtn = styled.button`
  margin: 10px auto;
  display: block;
`;

export const CardSwitcherTitle = styled.div`
  border-bottom: 1px solid;
  text-align: center;
`;

export const CardSwitcherRow = styled.div`
  width: 300px;
  height: 400px;
  overflow: hidden;
  border: 1px solid;
`;

export const EditableCardOptions = styled.div`
  padding: 20px;
  border-bottom: 1px solid #ccc;
  max-width: 700px;
`;

export const SliderWrapper = styled.div`
  display: flex;
  width: 50%;

  > * {
    flex: 1;
    margin: 10px;
  }
`;

export const EditableCardContent = styled.div`
  /* Not making the wrapper fancier or center elements in order to have a more realistic scenario */
  padding: 20px;
  border: 2px dashed;
  margin: 0 10px 50px 10px;
  overflow: hidden;
  background: antiquewhite;
  box-sizing: border-box;
`;

export const OptionsWrapper = styled.div`
  display: flex;

  > * {
    flex: 1;
    margin: 10px;
  }
`;

export const CardDimensionsWrapper = styled.div`
  margin: 10px 10px 20px 10px;
  display: flex;

  > div {
    border: 1px solid;
    margin: 5px;
    padding: 5px;
    border-radius: 3px;
  }
`;

export const FlexWrapper = styled.div`
  display: flex;
`;
export const CardPreviewWrapper = styled.div`
  flex: 1;
`;

export const CardTitle = styled.div`
  text-decoration: underline;
  padding-bottom: 10px;
`;

export const CardWrapper = styled.div`
  border: 1px solid;
  padding: 10px;
  margin: 5px;
  flex-direction: column;
  width: 310px;
  height: 280px;
  overflow: auto;
  display: inline-block;
`;

export const CardFlowHeader = styled.div`
  margin: 20px auto;
  padding: 10px 0;
`;

export const CardsWrapper = styled.div``;

export const CardState = styled.div`
  margin-top: 10px;

  pre {
    font-size: 11px;
  }
`;

export const ExternalIdentifierWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  margin: 0 auto;

  h2 {
    margin-bottom: 10px;
  }
`;

export const InlineCardVideoWrapper = styled.div``;
export const InlineCardVideoWrapperItem = styled.div`
  padding: 10px;
  border: 1px solid;
  margin: 10px;
`;

export const MediaViewerExampleColumn = styled.div`
  flex: 1;

  > div {
    width: initial;
    height: initial;
  }
`;

export const MediaViewerExampleWrapper = styled.div`
  display: flex;
`;
