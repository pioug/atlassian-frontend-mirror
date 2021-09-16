import React from 'react';

import { EditorView } from 'prosemirror-view';
import { defineMessages, InjectedIntlProps, injectIntl } from 'react-intl';

import Button from '@atlaskit/button/custom-theme-button';
import { akEditorMenuZIndex } from '@atlaskit/editor-shared-styles';
import ExpandIcon from '@atlaskit/icon/glyph/chevron-down';
import EditorBackgroundColorIcon from '@atlaskit/icon/glyph/editor/background-color';

import ColorPalette from '../../../../ui/ColorPalette';
import { textColorPalette as originalTextColors } from '../../../../ui/ColorPalette/Palettes/textColorPalette';
import Dropdown from '../../../../ui/Dropdown';
import {
  ExpandIconWrapper,
  MenuWrapper,
  Separator,
  TriggerWrapper,
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
  TextColorShowMoreToggleAEP,
  TextColorShowPaletteToggleAEP,
  TextColorSelectedAttr,
  TextColorShowMoreToggleAttr,
  TextColorShowPaletteToggleAttr,
} from '../../../analytics/types/experimental-events';
import * as commands from '../../commands/change-color';
import { TextColorPluginState } from '../../pm-plugins/main';

import { EditorTextColorIcon } from './icon';
import {
  disabledRainbow,
  rainbow,
  ShowMoreWrapper,
  TextColorIconBar,
  TextColorIconWrapper,
} from './styles';

const EXPERIMENT_NAME: string = 'editor.toolbarTextColor.moreColors';
const EXPERIMENT_GROUP_CONTROL: string = 'control';
const EXPERIMENT_GROUP_SUBJECT: string = 'subject';

export const messages = defineMessages({
  textColor: {
    id: 'fabric.editor.textColor',
    defaultMessage: 'Text color',
    description: '',
  },
  moreColors: {
    id: 'fabric.editor.textColor.moreColors',
    defaultMessage: 'More colors',
    description: 'More colors',
  },
  lessColors: {
    id: 'fabric.editor.textColor.lessColors',
    defaultMessage: 'Fewer colors',
    description: 'Fewer colors',
  },
});

export interface State {
  isOpen: boolean;
  isShowingMoreColors: boolean;
}

export interface Props {
  pluginState: TextColorPluginState;
  editorView: EditorView;
  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
  popupsScrollableElement?: HTMLElement;
  isReducedSpacing?: boolean;
  showMoreColorsToggle?: boolean;
  dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
  disabled?: boolean;
}

interface HandleOpenChangeData {
  isOpen: boolean;
  logCloseEvent: boolean;
}

class ToolbarTextColor extends React.Component<
  Props & InjectedIntlProps,
  State
> {
  state: State = {
    isOpen: false,
    isShowingMoreColors: false,
  };

  changeColor = (color: string) =>
    commands.changeColor(color)(
      this.props.editorView.state,
      this.props.editorView.dispatch,
    );

  render() {
    const { isOpen, isShowingMoreColors } = this.state;
    const {
      popupsMountPoint,
      popupsBoundariesElement,
      popupsScrollableElement,
      isReducedSpacing,
      pluginState,
      pluginState: { paletteExpanded },
      intl: { formatMessage },
      showMoreColorsToggle,
      disabled,
    } = this.props;

    const labelTextColor = formatMessage(messages.textColor);

    const palette =
      isShowingMoreColors && paletteExpanded
        ? paletteExpanded
        : pluginState.palette;

    let fitWidth: number | undefined;
    if (document.body.clientWidth <= 740) {
      // This was originally hard-coded, but moved here to a const
      // My guess is it's based off (width of button * columns) + left/right padding
      // 240 = (32 * 7) + (8 + 8)
      // Not sure where the extra 2px comes from
      fitWidth = 242;
    }

    return (
      <MenuWrapper>
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
              title={labelTextColor}
              onClick={this.toggleOpen}
              iconBefore={
                <TriggerWrapper>
                  <TextColorIconWrapper>
                    <EditorTextColorIcon />
                    <TextColorIconBar
                      selectedColor={
                        pluginState.color !== pluginState.defaultColor &&
                        pluginState.color
                      }
                      gradientColors={
                        pluginState.disabled ? disabledRainbow : rainbow
                      }
                    />
                  </TextColorIconWrapper>
                  <ExpandIconWrapper>
                    <ExpandIcon label="" />
                  </ExpandIconWrapper>
                </TriggerWrapper>
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
          {showMoreColorsToggle && (
            <ShowMoreWrapper>
              <Button
                appearance="subtle"
                onClick={this.handleShowMoreToggle}
                iconBefore={<EditorBackgroundColorIcon label="" />}
              >
                {formatMessage(
                  isShowingMoreColors
                    ? messages.lessColors
                    : messages.moreColors,
                )}
              </Button>
            </ShowMoreWrapper>
          )}
        </Dropdown>
        <Separator />
      </MenuWrapper>
    );
  }

  private changeTextColor = (color: string, disabled?: boolean) => {
    if (!disabled) {
      const {
        pluginState: { palette, paletteExpanded, defaultColor },
      } = this.props;
      const { isShowingMoreColors } = this.state;

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
          isShowingMoreColors,
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
    const {
      pluginState: { palette, color },
    } = this.props;
    const { isShowingMoreColors } = this.state;

    // pre-expand if a non-standard colour has been selected
    const isExtendedPaletteSelected: boolean = !palette.find(
      (swatch) => swatch.value === color,
    );

    this.setState({
      isOpen,
      isShowingMoreColors: isExtendedPaletteSelected || isShowingMoreColors,
    });

    if (logCloseEvent) {
      this.dispatchAnalyticsEvent(
        this.buildAnalyticsPalette(isOpen ? ACTION.OPENED : ACTION.CLOSED, {
          isShowingMoreColors: isExtendedPaletteSelected || isShowingMoreColors,
          noSelect: isOpen === false,
        }),
      );
    }
  };

  private hide = (e: MouseEvent | KeyboardEvent) => {
    const { isOpen, isShowingMoreColors } = this.state;

    if (isOpen === true) {
      this.dispatchAnalyticsEvent(
        this.buildAnalyticsPalette(ACTION.CLOSED, {
          isShowingMoreColors,
          noSelect: true,
        }),
      );

      this.setState({ isOpen: false });
    }
  };

  private handleShowMoreToggle = (e: React.MouseEvent<HTMLElement>) => {
    // Prevent the event from bubbling up and triggering the hide handler.
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();

    this.setState((state) => {
      this.dispatchAnalyticsEvent(
        this.buildAnalyticsShowMore(
          state.isShowingMoreColors ? ACTION.CLOSED : ACTION.OPENED,
          {
            showMoreButton: !state.isShowingMoreColors,
            showLessButton: state.isShowingMoreColors,
          },
        ),
      );

      return {
        isShowingMoreColors: !state.isShowingMoreColors,
      };
    });
  };

  private getCommonAnalyticsAttributes() {
    const { showMoreColorsToggle } = this.props;
    return {
      experiment: EXPERIMENT_NAME,
      experimentGroup: showMoreColorsToggle
        ? EXPERIMENT_GROUP_SUBJECT
        : EXPERIMENT_GROUP_CONTROL,
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

  private buildAnalyticsShowMore(
    action: ACTION.OPENED | ACTION.CLOSED,
    data: TextColorShowMoreToggleAttr,
  ): TextColorShowMoreToggleAEP {
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
