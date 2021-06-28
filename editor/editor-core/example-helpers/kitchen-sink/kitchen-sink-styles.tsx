import { N50, background, N30 } from '@atlaskit/theme/colors';
import { relativeFontSizeToBase16 } from '@atlaskit/editor-shared-styles';
import styled from 'styled-components';
import ContentStyles from '../../src/ui/ContentStyles';

export const Container = styled.div<{ vertical?: boolean; root?: boolean }>`
  display: flex;
  position: ${(props) => (props.root ? 'relative' : 'static')};
  margin-top: ${(props) => (props.root ? '0' : '0.5em')};
  flex-direction: ${(props) => (props.vertical ? 'column' : 'row')};
`;

export const Controls = styled.div`
  user-select: none;
  border-bottom: 1px dashed ${N50};
  padding: 1em;

  h5 {
    margin-bottom: 0.5em;
  }

  button {
    margin-left: 1em;
  }

  .theme-select {
    margin-left: 1em;
    width: 140px;
  }
`;

export const Column = styled.div<{ narrow?: boolean }>`
  flex: 1;
  margin-right: ${(props) => (props.narrow ? '360px' : '0')};
`;

export const Rail = styled.div`
  position: absolute;
  height: 100%;
  top: 0;
  right: 0;
  bottom: 0;
  background: ${background};
`;

export const EditorColumn = styled.div<{
  vertical: boolean;
  narrow: boolean;
}>`
  flex: 1;
  margin-right: ${(props) => (props.narrow ? '360px' : '0')};
  ${(p) =>
    !p.vertical
      ? `border-right: 1px solid ${N30}; min-height: 85vh; resize: horizontal;`
      : `border-bottom: 1px solid ${N30}; resize: vertical;`};
`;

export const PopupWrapper = styled.div.attrs({ className: 'popups-wrapper' })`
  position: relative;
  height: 100%;
`;

/** Without ContentStyles some SVGs in floating toolbar are missing .hyperlink-open-link styles */
export const PopUps = styled(ContentStyles).attrs({ className: 'popups' })`
  z-index: 9999;
`;

export const InputPadding = styled.div`
  height: 100%;
`;

export const InputForm = styled.div`
  height: 100%;
`;

export const Textarea = styled.textarea`
  box-sizing: border-box;
  border: 1px solid lightgray;
  font-family: monospace;
  font-size: ${relativeFontSizeToBase16(14)};
  padding: 1em;
  width: 100%;
  height: 80%;
`;

export const RendererPadding = styled.div<{ hasPadding: boolean }>`
  padding: 0 32px;
  padding-top: ${(props) => (props.hasPadding ? '132px' : '0')};
`;
