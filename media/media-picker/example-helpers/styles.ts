import { css } from '@emotion/react';
import { token } from '@atlaskit/tokens';
import { PastedImageStyleType } from './stylesWrapper';

interface DropzoneContainerProps {
  isActive: boolean;
}

export const popupContainerStyles = css`
  display: flex;
  flex-direction: column;
  overflow: scroll;
`;

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage, @atlaskit/design-system/ensure-design-token-usage-spacing
export const popupHeaderStyles = css`
  border-bottom: 1px solid #ccc;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  padding: 30px 0;

  > * {
    margin-right: 15px;
  }
`;

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage-spacing
export const previewImageWrapperStyles = css`
  position: relative;
  margin-right: 15px;
`;

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage, @atlaskit/design-system/ensure-design-token-usage-spacing
export const infoWrapperStyles = css`
  position: absolute;
  width: 160px;
  color: black;
  font-size: 12px;
  top: 120px;
  left: 0;
  text-align: center;
`;

export const dropzoneContainerStyles = ({
  isActive,
}: DropzoneContainerProps) => css`
  width: 600px;
  min-height: 500px;
  border: 1px dashed transparent;
  ${isActive ? `border-color: gray;` : ''}
`;

export const dropzoneRootStyles = css`
  display: flex;
`;

export const dropzoneContentWrapperStyles = css`
  display: flex;
  min-height: 200px;
`;

export const previewsWrapperStyles = css`
  display: flex;
  flex-direction: column;
  overflow: visible;
  margin-left: ${token('space.250', '20px')};
  margin-bottom: ${token('space.250', '20px')};
`;

export const previewsTitleStyles = css`
  width: 100%;
`;

export const uploadPreviewsFlexRowStyles = css`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

export const dropzoneItemsInfoStyles = css`
  flex: 1;
  min-width: 600px;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

interface ClipboardContainerProps {
  isWindowFocused: boolean;
}

export const clipboardContainerStyles = ({
  isWindowFocused,
}: // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage-spacing
ClipboardContainerProps) => css`
  padding: 10px;
  min-height: 400px;

  border: ${isWindowFocused ? `1px dashed gray` : `1px dashed transparent`};
`;

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage, @atlaskit/design-system/ensure-design-token-usage-spacing
export const infoContainerStyles = css`
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

export const pastedImageStyles = (style: PastedImageStyleType) => css`
  width: ${style.width ? `${style.width}px` : '100%'};
  ${style.height ? `height: ${style.height}px` : ''};
`;
