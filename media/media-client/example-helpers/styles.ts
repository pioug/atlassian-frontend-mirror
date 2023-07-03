import { token } from '@atlaskit/tokens';
import { css } from '@emotion/react';
import { FileStatus } from '../src';

export const wrapperStyles = css`
  display: flex;
`;

export const imagePreviewStyles = css`
  width: 300px;
`;

export const previewWrapperStyles = css`
  flex: 1;
`;

export const metadataWrapperStyles = css`
  width: 400px;
  overflow: scroll;
  flex: 1;
`;

export const fileInputStyles = css`
  color: transparent;
`;

export interface FilesWrapperProps {
  status: FileStatus;
  key: number;
}

const statusColorMap: { [key in FileStatus]: string } = {
  uploading: token('color.background.accent.blue.subtle', 'cornflowerblue'),
  processing: token('color.background.accent.orange.subtler', 'peachpuff'),
  processed: token('color.background.accent.green.subtle', 'darkseagreen'),
  error: token('color.background.accent.red.subtle', 'indianred'),
  'failed-processing': token('color.background.accent.red.subtle', 'indianred'),
};

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
export const fileWrapperStyles = (status: FileStatus) => css`
  padding: 5px;
  margin: 10px;
  display: inline-block;
  width: 315px;
  background-color: ${statusColorMap[status]};
`;

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
export const cardsWrapperStyles = css`
  width: 900px;
  padding: 10px;
  border-right: 1px solid ${token('color.border', '#ccc')};

  h1 {
    text-align: center;
    border-bottom: 1px solid ${token('color.border', '#ccc')};
  }

  > div {
    width: auto;
    display: inline-block;
    margin: 10px;
  }
`;

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
export const headerStyles = css`
  button {
    margin: 5px;
  }
`;

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
export const fileStateWrapperStyles = css`
  border: 1px solid ${token('color.border', '#ccc')};
  margin: 10px;
  padding: 10px;
  width: 500px;
`;

export const uploadTouchWrapperStyles = css`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  align-content: center;
`;

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
export const rowStyles = css`
  flex-direction: row;
  justify-content: center;
  > * {
    margin-right: 10px;
  }
`;

export const responseStyles = css`
  font-family: monospace;
  white-space: pre;
`;
