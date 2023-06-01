/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import { token } from '@atlaskit/tokens';
import { N50, N30, N0, DN30 } from '@atlaskit/theme/colors';
import { themed } from '@atlaskit/theme/components';
import { relativeFontSizeToBase16 } from '@atlaskit/editor-shared-styles';
import { css } from '@emotion/react';
import { createEditorContentStyle } from '../../src/ui/ContentStyles';
import { ThemeProps } from '@atlaskit/theme/types';

export const container = ({
  vertical,
  root,
}: {
  vertical?: boolean;
  root?: boolean;
}) => css`
  display: flex;
  position: ${root ? 'relative' : 'static'};
  margin-top: ${root ? '0' : '0.5em'};
  flex-direction: ${vertical ? 'column' : 'row'};
`;

export const controls = css`
  user-select: none;
  border-bottom: 1px dashed ${N50};
  padding: 1em;

  h5 {
    margin-bottom: 0.5em;
  }

  .theme-select {
    margin-left: 1em;
    width: 140px;
  }
`;

export const kitchenSinkControl = css`
  display: inline-block;
  vertical-align: middle;
  margin-top: 0.25em;
  margin-bottom: 0.25em;
  margin-right: 0.5em;
`;

export const appearanceControl = css`
  width: 240px;
`;

export const column = ({ narrow }: { narrow?: boolean }) => css`
  flex: 1;
  margin-right: ${narrow ? '360px' : '0'};
`;

export const rail = (props: ThemeProps) => css`
  position: absolute;
  height: 100%;
  top: 0;
  right: 0;
  bottom: 0;
  background: ${themed({
    light: token('elevation.surface', N0),
    dark: token('elevation.surface', DN30),
  })(props)};
`;

export const editorColumn = ({
  vertical,
  narrow,
}: {
  vertical: boolean;
  narrow: boolean;
}) => css`
  flex: 1;
  margin-right: ${narrow ? '360px' : '0'};
  ${!vertical
    ? `border-right: 1px solid ${N30}; min-height: 85vh; resize: horizontal;`
    : `border-bottom: 1px solid ${N30}; resize: vertical;`};
`;

export const popupWrapper = css`
  position: relative;
  height: 100%;
`;

/** Without ContentStyles some SVGs in floating toolbar are missing .hyperlink-open-link styles */
export const PopUps = createEditorContentStyle(css`
  z-index: 9999;
`);

export const inputPadding = css`
  height: 100%;
`;

export const inputForm = css`
  height: 100%;
`;

export const textareaStyle = css`
  box-sizing: border-box;
  border: 1px solid lightgray;
  font-family: monospace;
  font-size: ${relativeFontSizeToBase16(14)};
  padding: 1em;
  width: 100%;
  height: 80%;
`;

export const rendererPadding = (hasPadding: boolean) => css`
  padding: 0 32px;
  padding-top: ${hasPadding ? '132px' : '0'};
`;
