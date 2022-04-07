/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/react';

import { EditorView } from 'prosemirror-view';
import {
  defineMessages,
  WrappedComponentProps,
  injectIntl,
} from 'react-intl-next';

import { akEditorMenuZIndex } from '@atlaskit/editor-shared-styles';
import ExpandIcon from '@atlaskit/icon/glyph/chevron-down';

import ColorPalette from '../../../../ui/ColorPalette';
import { textColorPalette as originalTextColors } from '../../../../ui/ColorPalette/Palettes/textColorPalette';
import Dropdown from '../../../../ui/Dropdown';
import {
  expandIconWrapperStyle,
  wrapperStyle,
  separatorStyles,
  triggerWrapperStyles,
} from '../../../../ui/styles';
import ToolbarButton, { TOOLBAR_BUTTON } from '../../../../ui/ToolbarButton';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  AnalyticsEventPayload,
  DispatchAnalyticsEvent,
  EVENT_TYPE,
} from '../../../analytics';
import {
  TextColorSelectedAEP,
  TextColorShowPaletteToggleAEP,
  TextColorSelectedAttr,
  TextColorShowPaletteToggleAttr,
} from '../../../analytics/types/experimental-events';
import * as commands from '../../commands/change-color';
import { TextColorPluginState } from '../../pm-plugins/main';

import { EditorTextColorIcon } from './icon';
import {
  backgroundDisabled,
  textColorIconBar,
  textColorIconWrapper,
} from './styles';

const EXPERIMENT_NAME: string = 'editor.toolbarTextColor.moreColors';
const EXPERIMENT_GROUP_CONTROL: string = 'control';

export const messages = defineMessages({
  textColor: {
    id: 'fabric.editor.textColor',
    defaultMessage: 'Text color',
    description: '',
  },
});

export interface State {
  isOpen: boolean;
}

export interface Props {
  pluginState: TextColorPluginState;
  editorView: EditorView;
  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
  popupsScrollableElement?: HTMLElement;
  isReducedSpacing?: boolean;
  dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
  disabled?: boolean;
}

interface HandleOpenChangeData {
  isOpen: boolean;
  logCloseEvent: boolean;
}

export class ToolbarTextColor extends React.Component<
  Props & WrappedComponentProps,
  State
> {
  state: State = {
    isOpen: false,
  };

  changeColor = (color: string) =>
    commands.changeColor(color)(
      this.props.editorView.state,
      this.props.editorView.dispatch,
    );

  render() {
    const { isOpen } = this.state;
    const {
      popupsMountPoint,
      popupsBoundariesElement,
      popupsScrollableElement,
      isReducedSpacing,
      pluginState,
      pluginState: { paletteExpanded },
      intl: { formatMessage },
      disabled,
    } = this.props;

    const labelTextColor = formatMessage(messages.textColor);

    const palette = paletteExpanded || pluginState.palette;

    let fitWidth: number | undefined;
    if (document.body.clientWidth <= 740) {
      // This was originally hard-coded, but moved here to a const
      // My guess is it's based off (width of button * columns) + left/right padding
      // 240 = (32 * 7) + (8 + 8)
      // Not sure where the extra 2px comes from
      fitWidth = 242;
    }

    const selectedColor =
      pluginState.color !== pluginState.defaultColor && pluginState.color;

    return (
      <span css={wrapperStyle}>
        <Dropdown
          mountTo={popupsMountPoint}
          boundariesElement={popupsBoundariesElement}
          scrollableElement={popupsScrollableElement}
          isOpen={isOpen && !pluginState.disabled}
          handleClickOutside={this.hide}
          handleEscapeKeydown={this.hide}
          zIndex={akEditorMenuZIndex}
          fitWidth={fitWidth}
          trigger={
            <ToolbarButton
              buttonId={TOOLBAR_BUTTON.TEXT_COLOR}
              spacing={isReducedSpacing ? 'none' : 'default'}
              disabled={disabled || pluginState.disabled}
              selected={isOpen}
              aria-label={labelTextColor}
              aria-expanded={isOpen}
              aria-haspopup
              title={labelTextColor}
              onClick={this.toggleOpen}
              iconBefore={
                <div css={triggerWrapperStyles}>
                  <div css={textColorIconWrapper}>
                    <EditorTextColorIcon />
                    <div
                      css={[
                        textColorIconBar,
                        selectedColor
                          ? `background: ${selectedColor};`
                          : pluginState.disabled && backgroundDisabled,
                      ]}
                    />
                  </div>
                  <span css={expandIconWrapperStyle}>
                    <ExpandIcon label="" />
                  </span>
                </div>
              }
            />
          }
        >
          <div data-testid="text-color-palette">
            <ColorPalette
              palette={palette}
              onClick={(color) =>
                this.changeTextColor(color, pluginState.disabled)
              }
              selectedColor={pluginState.color}
            />
          </div>
        </Dropdown>
        <span css={separatorStyles} />
      </span>
    );
  }

  private changeTextColor = (color: string, disabled?: boolean) => {
    if (!disabled) {
      const {
        pluginState: { palette, paletteExpanded, defaultColor },
      } = this.props;

      // we store color names in analytics
      const swatch = (paletteExpanded || palette).find(
        (sw) => sw.value === color,
      );
      const isNewColor =
        color !== defaultColor &&
        !originalTextColors.some((col) => col.value === color);

      this.dispatchAnalyticsEvent(
        this.buildAnalyticsSelectColor({
          color: (swatch ? swatch.label : color).toLowerCase(),
          isNewColor,
        }),
      );

      this.handleOpenChange({
        isOpen: false,
        logCloseEvent: false,
      });
      return this.changeColor(color);
    }

    return false;
  };

  private toggleOpen = () => {
    this.handleOpenChange({ isOpen: !this.state.isOpen, logCloseEvent: true });
  };

  private handleOpenChange = ({
    isOpen,
    logCloseEvent,
  }: HandleOpenChangeData) => {
    this.setState({
      isOpen,
    });

    if (logCloseEvent) {
      this.dispatchAnalyticsEvent(
        this.buildAnalyticsPalette(isOpen ? ACTION.OPENED : ACTION.CLOSED, {
          noSelect: isOpen === false,
        }),
      );
    }
  };

  private hide = (e: MouseEvent | KeyboardEvent) => {
    const { isOpen } = this.state;

    if (isOpen === true) {
      this.dispatchAnalyticsEvent(
        this.buildAnalyticsPalette(ACTION.CLOSED, {
          noSelect: true,
        }),
      );

      this.setState({ isOpen: false });
    }
  };

  private getCommonAnalyticsAttributes() {
    return {
      experiment: EXPERIMENT_NAME,
      experimentGroup: EXPERIMENT_GROUP_CONTROL,
    };
  }

  private buildAnalyticsPalette(
    action: ACTION.OPENED | ACTION.CLOSED,
    data: TextColorShowPaletteToggleAttr,
  ): TextColorShowPaletteToggleAEP {
    return {
      action,
      actionSubject: ACTION_SUBJECT.TOOLBAR,
      actionSubjectId: ACTION_SUBJECT_ID.FORMAT_COLOR,
      eventType: EVENT_TYPE.TRACK,
      attributes: {
        ...this.getCommonAnalyticsAttributes(),
        ...data,
      },
    };
  }

  private buildAnalyticsSelectColor(
    data: TextColorSelectedAttr,
  ): TextColorSelectedAEP {
    return {
      action: ACTION.FORMATTED,
      actionSubject: ACTION_SUBJECT.TEXT,
      actionSubjectId: ACTION_SUBJECT_ID.FORMAT_COLOR,
      eventType: EVENT_TYPE.TRACK,
      attributes: {
        ...this.getCommonAnalyticsAttributes(),
        ...data,
      },
    };
  }

  private dispatchAnalyticsEvent(payload: AnalyticsEventPayload) {
    const { dispatchAnalyticsEvent } = this.props;

    if (dispatchAnalyticsEvent) {
      dispatchAnalyticsEvent(payload);
    }
  }
}

export default injectIntl(ToolbarTextColor);
