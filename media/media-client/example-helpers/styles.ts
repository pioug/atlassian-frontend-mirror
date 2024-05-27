import { token } from '@atlaskit/tokens';
import { css } from '@emotion/react';
import { type FileStatus } from '../src';

export const wrapperStyles = css({
  display: 'flex',
});

export const imagePreviewStyles = css({
  width: '300px',
});

export const previewWrapperStyles = css({
  flex: 1,
});

export const metadataWrapperStyles = css({
  width: '400px',
  overflow: 'scroll',
  flex: 1,
});

export const fileInputStyles = css({
  color: 'transparent',
});

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
export const fileWrapperStyles = (status: FileStatus) =>
  css({
    padding: '5px',
    margin: '10px',
    display: 'inline-block',
    width: '315px',
    backgroundColor: statusColorMap[status],
  });

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
export const cardsWrapperStyles = css({
  width: '900px',
  padding: '10px',
  borderRight: `1px solid ${token('color.border', '#ccc')}`,
  h1: {
    textAlign: 'center',
    borderBottom: `1px solid ${token('color.border', '#ccc')}`,
  },
  '> div': {
    width: 'auto',
    display: 'inline-block',
    margin: '10px',
  },
});

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
export const headerStyles = css({
  button: {
    margin: '5px',
  },
});

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
export const fileStateWrapperStyles = css({
  border: `1px solid ${token('color.border', '#ccc')}`,
  margin: '10px',
  padding: '10px',
  width: '500px',
});

export const uploadTouchWrapperStyles = css({
  height: '100%',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  flexWrap: 'nowrap',
  alignItems: 'center',
  justifyContent: 'center',
  alignContent: 'center',
});

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
export const rowStyles = css({
  flexDirection: 'row',
  justifyContent: 'center',
  '> *': {
    marginRight: '10px',
  },
});

export const responseStyles = css({
  fontFamily: 'monospace',
  whiteSpace: 'pre',
});
