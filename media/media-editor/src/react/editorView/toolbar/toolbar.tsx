import React from 'react';
import { Component } from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import {
  WithAnalyticsEventsProps,
  withAnalyticsEvents,
} from '@atlaskit/analytics-next';
import Button from '@atlaskit/button/custom-theme-button';
import Tooltip from '@atlaskit/tooltip';
import { messages } from '@atlaskit/media-ui';

import { Tool } from '../../../common';
import { fireAnalyticsEvent } from '../../../util';
import LineWidthButton from './buttons/lineWidthButton';
import ColorButton from './buttons/colorButton';
import { ToolButton } from './buttons/toolButton';
import { LineWidthPopup } from './popups/lineWidthPopup';
import { ColorPopup } from './popups/colorPopup';
import { ToolbarContainer, CenterButtons, VerticalLine } from './styles';
import { ShapePopup, shapeTools } from './popups/shapePopup';
import ShapeButton from './buttons/shapeButton';
import { ButtonGroup } from './buttons/buttonGroup';

export type PopupState = 'none' | 'color' | 'lineWidth' | 'shape';

export const tools: Tool[] = [
  'arrow',
  'rectangle',
  'oval',
  'line',
  'text',
  'blur',
  'brush',
];

export interface ToolbarProps {
  readonly color: string;
  readonly tool: Tool;
  readonly lineWidth: number;
  readonly onSave: () => void;
  readonly onCancel: () => void;
  readonly onToolChanged: (tool: Tool) => void;
  readonly onColorChanged: (color: string) => void;
  readonly onLineWidthChanged: (lineWidth: number) => void;
}

export interface ToolbarState {
  readonly popup: PopupState;
}

export class Toolbar extends Component<
  ToolbarProps & InjectedIntlProps & WithAnalyticsEventsProps,
  ToolbarState
> {
  state: ToolbarState = { popup: 'none' };

  onColorButtonClick = () => this.showOrHidePopup('color');
  onLineWidthButtonClick = () => this.showOrHidePopup('lineWidth');
  onShapeButtonClick = () => this.showOrHidePopup('shape');

  render() {
    const {
      color,
      tool,
      lineWidth,
      onColorChanged,
      onLineWidthChanged,
      onSave,
      onCancel,
      intl: { formatMessage },
      createAnalyticsEvent,
    } = this.props;
    const { popup } = this.state;

    const showColorPopup = popup === 'color';
    const showLineWidthPopup = popup === 'lineWidth';
    const showShapePopup = popup === 'shape';

    const onPickColor = (color: string) => {
      onColorChanged(color);

      fireAnalyticsEvent(
        {
          eventType: 'ui',
          action: 'selected',
          actionSubject: 'annotation',
          actionSubjectId: 'colour',
          attributes: { color },
        },
        createAnalyticsEvent,
      );
    };

    const onLineWidthClick = (lineWidth: number) => {
      onLineWidthChanged(lineWidth);

      fireAnalyticsEvent(
        {
          eventType: 'ui',
          action: 'selected',
          actionSubject: 'annotation',
          actionSubjectId: 'size',
          attributes: { lineWidth },
        },
        createAnalyticsEvent,
      );
    };

    const onCloseInlinePopup = () => {
      this.setState({ popup: 'none' });
    };

    const isShapeTool = shapeTools.indexOf(tool) > -1;

    return (
      <ToolbarContainer>
        <CenterButtons>
          <ButtonGroup>
            <Tooltip content={formatMessage(messages.annotate_tool_arrow)}>
              {this.renderSimpleTool('arrow')}
            </Tooltip>
            <Tooltip content={formatMessage(messages.annotate_tool_text)}>
              {this.renderSimpleTool('text')}
            </Tooltip>

            <ShapePopup
              isOpen={showShapePopup}
              shape={tool}
              onPickShape={this.onToolClick}
            >
              <div>
                <ShapeButton
                  onClick={this.onShapeButtonClick}
                  isActive={isShapeTool}
                  activeShape={tool}
                />
              </div>
            </ShapePopup>

            <Tooltip content={formatMessage(messages.annotate_tool_brush)}>
              {this.renderSimpleTool('brush')}
            </Tooltip>
            <Tooltip content={formatMessage(messages.annotate_tool_blur)}>
              {this.renderSimpleTool('blur')}
            </Tooltip>

            <VerticalLine />
            <LineWidthPopup
              onClose={onCloseInlinePopup}
              onLineWidthClick={onLineWidthClick}
              lineWidth={lineWidth}
              isOpen={showLineWidthPopup}
            >
              <div>
                <LineWidthButton
                  lineWidth={lineWidth}
                  isActive={showLineWidthPopup}
                  onClick={this.onLineWidthButtonClick}
                />
              </div>
            </LineWidthPopup>

            <ColorPopup
              onClose={onCloseInlinePopup}
              onPickColor={onPickColor}
              color={color}
              isOpen={showColorPopup}
            >
              <div>
                <ColorButton
                  color={color}
                  isActive={showColorPopup}
                  onClick={this.onColorButtonClick}
                />
              </div>
            </ColorPopup>

            <VerticalLine />

            <Button appearance="primary" onClick={onSave} autoFocus={true}>
              {formatMessage(messages.save)}
            </Button>
            <Button appearance="default" onClick={onCancel}>
              {formatMessage(messages.cancel)}
            </Button>
          </ButtonGroup>
        </CenterButtons>
      </ToolbarContainer>
    );
  }

  private onToolClick = (tool: Tool) => {
    this.setState({ popup: 'none' });
    this.props.onToolChanged(tool);

    fireAnalyticsEvent(
      {
        eventType: 'ui',
        action: 'selected',
        actionSubject: 'annotation',
        actionSubjectId: tool,
      },
      this.props.createAnalyticsEvent,
    );
  };

  private renderSimpleTool(tool: Tool) {
    const { tool: activeTool } = this.props;

    return (
      <ToolButton
        key={tool}
        tool={tool}
        activeTool={activeTool}
        onToolClick={this.onToolClick}
      />
    );
  }

  private showOrHidePopup(target: PopupState): void {
    if (this.state.popup === target) {
      this.setState({ popup: 'none' });
    } else {
      this.setState({ popup: target });
    }
  }
}

export default withAnalyticsEvents()(injectIntl(Toolbar));
