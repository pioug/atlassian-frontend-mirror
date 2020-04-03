import { EditorView } from 'prosemirror-view';
import React from 'react';
import { defineMessages, injectIntl, InjectedIntlProps } from 'react-intl';

import ExpandIcon from '@atlaskit/icon/glyph/chevron-down';
import { akEditorMenuZIndex } from '@atlaskit/editor-common';
import Button from '@atlaskit/button';
import EditorBackgroundColorIcon from '@atlaskit/icon/glyph/editor/background-color';
import {
  ACTION_SUBJECT,
  ACTION,
  EVENT_TYPE,
  ACTION_SUBJECT_ID,
  DispatchAnalyticsEvent,
  AnalyticsEventPayload,
} from '../../../analytics';
import { withAnalytics } from '../../../../analytics';
import ToolbarButton from '../../../../ui/ToolbarButton';
import ColorPalette from '../../../../ui/ColorPalette';
import Dropdown from '../../../../ui/Dropdown';
import { TextColorPluginState } from '../../pm-plugins/main';
import * as commands from '../../commands/change-color';
import { EditorTextColorIcon } from './icon';
import {
  TextColorIconWrapper,
  TextColorIconBar,
  ShowMoreWrapper,
  rainbow,
  disabledRainbow,
} from './styles';
import {
  Separator,
  TriggerWrapper,
  MenuWrapper,
  ExpandIconWrapper,
} from '../../../../ui/styles';
import {
  ExperimentalTextColorSelectedAEP,
  ExperimentalTextColorShowMoreToggleAEP,
  ExperimentalTextColorShowPaletteToggleAEP,
  TextColorSelectedAttr,
  TextColorShowMoreToggleAttr,
  TextColorShowPaletteToggleAttr,
} from '../../../analytics/types/experimental-events';
import { textColorPalette as originalTextColors } from '../../../../ui/ColorPalette/Palettes/textColorPalette';

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

    return (
      <MenuWrapper>
        <Dropdown
          mountTo={popupsMountPoint}
          boundariesElement={popupsBoundariesElement}
          scrollableElement={popupsScrollableElement}
          isOpen={isOpen && !pluginState.disabled}
          handleClickOutside={this.hide}
          handleEscapeKeydown={this.hide}
          fitWidth={242}
          fitHeight={80}
          zIndex={akEditorMenuZIndex}
          trigger={
            <ToolbarButton
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
                    <ExpandIcon label={labelTextColor} />
                  </ExpandIconWrapper>
                </TriggerWrapper>
              }
            />
          }
        >
          <ColorPalette
            palette={palette}
            onClick={color => this.changeTextColor(color, pluginState.disabled)}
            selectedColor={pluginState.color}
          />
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

  private changeTextColor = withAnalytics(
    'atlassian.editor.format.textcolor.button',
    (color: string, disabled: boolean) => {
      if (!disabled) {
        const {
          pluginState: { palette, paletteExpanded, defaultColor },
        } = this.props;
        const { isShowingMoreColors } = this.state;

        // we store color names in analytics
        const swatch = (paletteExpanded || palette).find(
          sw => sw.value === color,
        );
        const isNewColor =
          color !== defaultColor &&
          !originalTextColors.some(col => col.value === color);

        this.dispatchAnalyticsEvent(
          this.buildExperimentalAnalyticsSelectColor({
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
    },
  );

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
      swatch => swatch.value === color,
    );

    this.setState({
      isOpen,
      isShowingMoreColors: isExtendedPaletteSelected || isShowingMoreColors,
    });

    if (logCloseEvent) {
      this.dispatchAnalyticsEvent(
        this.buildExperimentalAnalyticsPalette(
          isOpen ? ACTION.OPENED : ACTION.CLOSED,
          {
            isShowingMoreColors:
              isExtendedPaletteSelected || isShowingMoreColors,
            noSelect: isOpen === false,
          },
        ),
      );
    }
  };

  private hide = () => {
    const { isOpen, isShowingMoreColors } = this.state;

    if (isOpen === true) {
      this.dispatchAnalyticsEvent(
        this.buildExperimentalAnalyticsPalette(ACTION.CLOSED, {
          isShowingMoreColors,
          noSelect: true,
        }),
      );

      this.setState({ isOpen: false });
    }
  };

  private handleShowMoreToggle = () => {
    this.setState(state => {
      this.dispatchAnalyticsEvent(
        this.buildExperimentalAnalyticsShowMore(
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

  private getCommonExperimentalAnalyticsAttributes() {
    const { showMoreColorsToggle } = this.props;
    return {
      experiment: EXPERIMENT_NAME,
      experimentGroup: showMoreColorsToggle
        ? EXPERIMENT_GROUP_SUBJECT
        : EXPERIMENT_GROUP_CONTROL,
    };
  }

  private buildExperimentalAnalyticsPalette(
    action: ACTION.OPENED | ACTION.CLOSED,
    data: TextColorShowPaletteToggleAttr,
  ): ExperimentalTextColorShowPaletteToggleAEP {
    return {
      action,
      actionSubject: ACTION_SUBJECT.TOOLBAR,
      actionSubjectId: ACTION_SUBJECT_ID.FORMAT_COLOR,
      eventType: EVENT_TYPE.TRACK,
      attributes: {
        ...this.getCommonExperimentalAnalyticsAttributes(),
        ...data,
      },
    };
  }

  private buildExperimentalAnalyticsShowMore(
    action: ACTION.OPENED | ACTION.CLOSED,
    data: TextColorShowMoreToggleAttr,
  ): ExperimentalTextColorShowMoreToggleAEP {
    return {
      action,
      actionSubject: ACTION_SUBJECT.TOOLBAR,
      actionSubjectId: ACTION_SUBJECT_ID.FORMAT_COLOR,
      eventType: EVENT_TYPE.TRACK,
      attributes: {
        ...this.getCommonExperimentalAnalyticsAttributes(),
        ...data,
      },
    };
  }

  private buildExperimentalAnalyticsSelectColor(
    data: TextColorSelectedAttr,
  ): ExperimentalTextColorSelectedAEP {
    return {
      action: ACTION.FORMATTED,
      actionSubject: ACTION_SUBJECT.TEXT,
      actionSubjectId: ACTION_SUBJECT_ID.FORMAT_COLOR,
      eventType: EVENT_TYPE.TRACK,
      attributes: {
        ...this.getCommonExperimentalAnalyticsAttributes(),
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
