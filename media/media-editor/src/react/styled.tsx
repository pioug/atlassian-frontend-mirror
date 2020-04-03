import styled, { ThemedOuterStyledProps } from 'styled-components';

import {
  HTMLAttributes,
  ComponentClass,
  CanvasHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react';
import { layers } from '@atlaskit/theme/constants';
import { N700A, N600A, N50A, N200, N40 } from '@atlaskit/theme/colors';

export interface LineWidthFrontCircleProps {
  width: number;
}

export const blanketColor = N700A;
const overlayZindex = layers.modal();

export const MediaEditorContainer: ComponentClass<HTMLAttributes<{}>> = styled.div`
  position: absolute;
  top: 0;
`;
MediaEditorContainer.displayName = 'MediaEditorContainer';

export const OutputArea: ComponentClass<HTMLAttributes<{}> &
  ThemedOuterStyledProps<{}, {}>> = styled.div`
  position: absolute;
  overflow: hidden;
`;
OutputArea.displayName = 'OutputArea';

export const DrawingCanvas: ComponentClass<CanvasHTMLAttributes<{}> &
  ThemedOuterStyledProps<{}, {}>> = styled.canvas`
  position: absolute;
  left: 0;
  top: 0;
`;
DrawingCanvas.displayName = 'DrawingCanvas';

export const SupplementaryCanvas: ComponentClass<CanvasHTMLAttributes<{}> &
  ThemedOuterStyledProps<{}, {}>> = styled.canvas`
  position: absolute;
  display: none;
  left: 0;
  top: 0;
`;
SupplementaryCanvas.displayName = 'SupplementaryCanvas';

// TODO Check with transparent canvas, because DefaultKeyboardInput makes the text area visible to get focus.
// https://jira.atlassian.com/browse/FIL-4059
export const HiddenTextArea: ComponentClass<TextareaHTMLAttributes<{}> &
  ThemedOuterStyledProps<{}, {}>> = styled.textarea`
  position: absolute;
  display: block;
  visibility: hidden; /* display:none won't allow to get the keyboard focus */
  left: 0;
  top: 0;
  width: 0;
  height: 0;
  overflow: hidden;
  resize: none;
  opacity: 0;
`;
HiddenTextArea.displayName = 'HiddenTextArea';

export const HiddenTextHelperDiv: ComponentClass<HTMLAttributes<{}> &
  ThemedOuterStyledProps<{}, {}>> = styled.div`
  position: absolute;
  display: block;
  visibility: hidden; /* display:none won't allow us to call getClientBoundingRect() for children */
  left: 0;
  top: 0;
  width: 100px;
  height: 100px;
  overflow: hidden;
  white-space: pre; /* to preserve multiple whitespace characters and not to break lines */
`;
HiddenTextHelperDiv.displayName = 'HiddenTextHelperDiv';

export const ToolbarContainer: ComponentClass<HTMLAttributes<{}>> = styled.div`
  width: 32px;
  height: 392px;
  background-color: ${N600A};
  border-radius: 4px;
  padding: 8px;
`;
ToolbarContainer.displayName = 'ToolbarContainer';

export const ColorSquare: ComponentClass<HTMLAttributes<{}>> = styled.div`
  width: 20px;
  height: 20px;
  margin: 4px;
  background-color: ${props => props.color || 'transparent'};
  border-radius: 4px;
  border-width: 2px;
  border-color: ${N50A};
  border-style: solid;
`;
ColorSquare.displayName = 'ColorSquare';

export const LineWidthBackCircle: ComponentClass<HTMLAttributes<{}>> = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  margin: 6px;
  background-color: ${N200};
  border-radius: 10px;
`;
LineWidthBackCircle.displayName = 'LineWidthBackCircle';

export const LineWidthFrontCircle: ComponentClass<HTMLAttributes<{}> &
  LineWidthFrontCircleProps> = styled.div`
  width: ${(props: LineWidthFrontCircleProps) =>
    props.width ? `${props.width}px` : '0'};
  height: ${(props: LineWidthFrontCircleProps) =>
    props.width ? `${props.width}px` : '0'};
  background-color: ${N40};
  border-radius: 50%;
  margin: ${(props: LineWidthFrontCircleProps) =>
    props.width ? `${10 - props.width / 2}px` : '0'};
`;
LineWidthFrontCircle.displayName = 'LineWidthFrontCircle';

export const ToolIcon: ComponentClass<HTMLAttributes<{}>> = styled.div`
  width: 20px;
  height: 20px;
  margin: 4px;
  color: ${N40};
`;
ToolIcon.displayName = 'ToolIcon';

// TODO This is copy paste from media-viewer
export const Blanket = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: ${blanketColor};
  z-index: ${overlayZindex};
`;
Blanket.displayName = 'Blanket';

export const SpinnerWrapper: ComponentClass<HTMLAttributes<{}>> = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
SpinnerWrapper.displayName = 'SpinnerWrapper';
