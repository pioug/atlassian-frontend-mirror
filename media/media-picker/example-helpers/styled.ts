import styled from 'styled-components';
export interface DropzoneContainerProps {
  isActive: boolean;
}

export const PopupContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow: scroll;
`;

export const PopupHeader = styled.div`
  border-bottom: 1px solid #ccc;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  padding: 30px 0;

  > * {
    margin-right: 15px;
  }
`;

export const PopupEventsWrapper = styled.div`
  overflow: auto;
`;

export interface PreviewImageProps {
  fadedOut: boolean;
}
export const PreviewImage = styled.img`
  width: 300px;
  ${({ fadedOut }: PreviewImageProps) => `opacity: ${fadedOut ? 0.3 : 1};`};
`;

export const PreviewImageWrapper = styled.div`
  position: relative;
  margin-right: 15px;
`;

export const InfoWrapper = styled.pre`
  position: absolute;
  width: 160px;
  color: black;
  font-size: 12px;
  top: 120px;
  left: 0;
  text-align: center;
`;

export const DropzoneContainer = styled.div`
  width: 600px;
  min-height: 500px;
  border: 1px dashed transparent;

  ${(props: DropzoneContainerProps) =>
    props.isActive
      ? `
    border-color: gray;
  `
      : ''};
`;

export const DropzoneConfigOptions = styled.div``;
export const DropzoneRoot = styled.div`
  display: flex;
`;

export const DropzoneContentWrapper = styled.div`
  display: flex;
  min-height: 200px;
`;

export const PreviewsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow: visible;
  margin-left: 20px;
  margin-bottom: 20px;
`;

export const PreviewsTitle = styled.h1`
  width: 100%;
`;

export const UploadPreviewsFlexRow = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

export const ProgressCircleWrapper = styled.div`
  position: absolute;
  top: calc(50% - 50px);
  left: calc(50% - 50px);
  width: 100px;
  height: 100px;
`;

export const DropzoneItemsInfo = styled.div`
  flex: 1;
  min-width: 600px;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

export interface ClipboardContainerProps {
  isWindowFocused: boolean;
}

export const ClipboardContainer = styled.div`
  padding: 10px;
  min-height: 400px;

  border: ${({ isWindowFocused }: ClipboardContainerProps) =>
    isWindowFocused ? `1px dashed gray` : `1px dashed transparent`};
`;

export const UploadingFilesWrapper = styled.div``;

export const FileProgress = styled.progress`
  width: 400px;
`;

export const FilesInfoWrapper = styled.div`
  border: 1px solid;
  padding: 10px;
  margin-bottom: 10px;
  max-height: 250px;
  min-height: 250px;
  overflow: auto;
  display: flex;
`;

export const CardsWrapper = styled.div`
  flex: 1;
`;

export const CardItemWrapper = styled.div`
  display: inline-block;
`;

export const SelectWrapper = styled.div`
  width: 150px;
`;
export const OptionsWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  justify-content: space-around;
  width: 400px;
`;
export const ResultsWrapper = styled.div`
  > div {
    display: inline-block;
    width: auto;
    height: auto;
    margin: 10px;
  }
`;

export const EmojiWrapper = styled.div`
  overflow: auto;
`;

export const EmojiHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;

  label {
    display: none;
  }

  > div {
    flex: initial;
  }
`;

export const InfoContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  margin: 0;
  border: 5px dashed #81ebff;
  box-shadow: 10px 10px 15px rgba(0, 0, 0, 0.3);

  .info {
    position: absolute;
    left: 0;
    bottom: -30px;
    background-color: black;
    opacity: 0.5;
    color: white;
    white-space: nowrap;
  }

  .close_button {
    position: absolute;
    top: 0;
    right: 0;
  }
`;

export const PastedImage = styled.img`
  width: 100%;
`;
