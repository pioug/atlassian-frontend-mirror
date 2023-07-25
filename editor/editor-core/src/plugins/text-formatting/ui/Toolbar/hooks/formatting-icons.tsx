/** @jsx jsx */
import React, { useMemo } from 'react';
import { jsx } from '@emotion/react';
import type { MessageDescriptor, WrappedComponentProps } from 'react-intl-next';
import type { Schema } from 'prosemirror-model';
import type { EditorState } from 'prosemirror-state';
import BoldIcon from '@atlaskit/icon/glyph/editor/bold';
import ItalicIcon from '@atlaskit/icon/glyph/editor/italic';
import { shortcutStyle } from '../../../../../ui/styles';
import { toolbarMessages } from '../toolbar-messages';
import * as commands from '../../../commands/text-formatting';
import { TOOLBAR_ACTION_SUBJECT_ID } from '../../../../../plugins/analytics/types/toolbar-button';
import { pluginKey as textFormattingPluginKey } from '../../../pm-plugins/plugin-key';
import type { Keymap } from '../../../../../keymaps';
import {
  toggleCode,
  toggleStrikethrough,
  toggleUnderline,
  tooltip,
  toggleBold,
  toggleItalic,
  toggleSubscript,
  toggleSuperscript,
  ToolTipContent,
} from '../../../../../keymaps';
import type { Command } from '../../../../../types/command';
import { INPUT_METHOD } from '../../../../analytics/types/enums';
import type { TextFormattingState } from '../../../pm-plugins/main';
import type { IconHookProps, MenuIconItem, MenuIconState } from '../types';
import { IconTypes } from '../types';
import { getAriaKeyshortcuts } from '@atlaskit/editor-common/keymaps';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';

const withToolbarInputMethod = (
  func: (props: { inputMethod: INPUT_METHOD.TOOLBAR }) => Command,
): Command => func({ inputMethod: INPUT_METHOD.TOOLBAR });

type BuildIconProps = {
  isToolbarDisabled: boolean;
  textFormattingPluginState: TextFormattingState;
  schema: Schema;
} & WrappedComponentProps;

type IconButtonType = {
  buttonId?: TOOLBAR_ACTION_SUBJECT_ID;
  message: MessageDescriptor;
  command: Command;
  tooltipKeymap?: Keymap;
  component?: () => React.ReactElement;
};

const IconButtons = (
  editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
): Record<IconTypes, IconButtonType> => ({
  strong: {
    buttonId: TOOLBAR_ACTION_SUBJECT_ID.TEXT_FORMATTING_STRONG,
    command: withToolbarInputMethod(
      commands.toggleStrongWithAnalytics(editorAnalyticsAPI),
    ),
    message: toolbarMessages.bold,
    tooltipKeymap: toggleBold,
    component: () => <BoldIcon label="" />,
  },
  em: {
    buttonId: TOOLBAR_ACTION_SUBJECT_ID.TEXT_FORMATTING_ITALIC,
    command: withToolbarInputMethod(
      commands.toggleEmWithAnalytics(editorAnalyticsAPI),
    ),
    message: toolbarMessages.italic,
    tooltipKeymap: toggleItalic,
    component: () => <ItalicIcon label="" />,
  },
  underline: {
    command: withToolbarInputMethod(
      commands.toggleUnderlineWithAnalytics(editorAnalyticsAPI),
    ),
    message: toolbarMessages.underline,
    tooltipKeymap: toggleUnderline,
  },
  strike: {
    command: withToolbarInputMethod(
      commands.toggleStrikeWithAnalytics(editorAnalyticsAPI),
    ),
    message: toolbarMessages.strike,
    tooltipKeymap: toggleStrikethrough,
  },
  code: {
    command: withToolbarInputMethod(
      commands.toggleCodeWithAnalytics(editorAnalyticsAPI),
    ),
    message: toolbarMessages.code,
    tooltipKeymap: toggleCode,
  },
  subscript: {
    command: withToolbarInputMethod(
      commands.toggleSubscriptWithAnalytics(editorAnalyticsAPI),
    ),
    message: toolbarMessages.subscript,
    tooltipKeymap: toggleSubscript,
  },
  superscript: {
    command: withToolbarInputMethod(
      commands.toggleSuperscriptWithAnalytics(editorAnalyticsAPI),
    ),
    message: toolbarMessages.superscript,
    tooltipKeymap: toggleSuperscript,
  },
});

type GetIconProps = {
  iconType: IconTypes;
  isDisabled: boolean;
  isActive: boolean;
  editorAnalyticsAPI: EditorAnalyticsAPI | undefined;
} & WrappedComponentProps;
const getIcon = ({
  iconType,
  isDisabled,
  isActive,
  intl,
  editorAnalyticsAPI,
}: GetIconProps): MenuIconItem => {
  const icon = IconButtons(editorAnalyticsAPI)[iconType];
  const content = intl.formatMessage(icon.message);
  const { tooltipKeymap } = icon;

  return {
    content,
    buttonId: icon.buttonId,
    iconMark: iconType,
    key: iconType,
    command: icon.command,
    iconElement: icon.component ? icon.component() : undefined,
    tooltipElement: tooltipKeymap ? (
      <ToolTipContent description={content} keymap={tooltipKeymap} />
    ) : undefined,
    elemAfter: tooltipKeymap ? (
      <div css={shortcutStyle}>{tooltip(tooltipKeymap)}</div>
    ) : undefined,
    value: {
      name: iconType,
    },
    isActive,
    isDisabled,
    'aria-label': tooltipKeymap
      ? tooltip(tooltipKeymap, String(content))
      : String(content),
    'aria-keyshortcuts': getAriaKeyshortcuts(tooltipKeymap),
  };
};

const IconsMarkSchema: Record<IconTypes, string> = {
  [IconTypes.strong]: 'strong',
  [IconTypes.em]: 'em',
  [IconTypes.strike]: 'strike',
  [IconTypes.code]: 'code',
  [IconTypes.underline]: 'underline',
  [IconTypes.superscript]: 'subsup',
  [IconTypes.subscript]: 'subsup',
};

const buildMenuIconState =
  (iconMark: IconTypes) =>
  ({
    schema,
    textFormattingPluginState,
  }: Pick<
    BuildIconProps,
    'schema' | 'textFormattingPluginState'
  >): MenuIconState => {
    const hasPluginState = Boolean(textFormattingPluginState);
    const markSchema = IconsMarkSchema[iconMark];
    const hasSchemaMark = Boolean(schema.marks[markSchema]);

    if (!hasPluginState) {
      return {
        isActive: false,
        isDisabled: true,
        isHidden: false,
        hasSchemaMark,
      };
    }

    const isActive =
      textFormattingPluginState[
        `${iconMark}Active` as keyof TextFormattingState
      ];
    const isDisabled =
      textFormattingPluginState[
        `${iconMark}Disabled` as keyof TextFormattingState
      ];
    const isHidden =
      textFormattingPluginState[
        `${iconMark}Hidden` as keyof TextFormattingState
      ];

    return {
      isActive: Boolean(isActive),
      isDisabled: Boolean(isDisabled),
      isHidden: Boolean(isHidden),
      hasSchemaMark,
    };
  };

const buildIcon = (
  iconMark: IconTypes,
  editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
) => {
  const getState = buildMenuIconState(iconMark);

  return ({
    schema,
    textFormattingPluginState,
    intl,
    isToolbarDisabled,
  }: BuildIconProps): MenuIconItem | null => {
    const iconState = getState({
      schema,
      textFormattingPluginState,
    });

    const { isActive, isDisabled, isHidden, hasSchemaMark } = iconState;
    const iconComponent = useMemo(
      () =>
        getIcon({
          iconType: IconTypes[iconMark],
          isDisabled: isToolbarDisabled || isDisabled,
          isActive,
          intl,
          editorAnalyticsAPI,
        }),
      [isToolbarDisabled, isDisabled, isActive, intl],
    );
    const shouldRenderIcon = hasSchemaMark && !isHidden;

    return useMemo(
      () => (shouldRenderIcon ? iconComponent : null),
      [shouldRenderIcon, iconComponent],
    );
  };
};

const useTextFormattingPluginState = (
  editorState: EditorState,
): TextFormattingState =>
  useMemo(() => {
    const pluginState = textFormattingPluginKey.getState(editorState);

    // TODO: ED-13910 for reasons that goes beyond my knowledge. This is the only way to make the current unit tests happy. Even thought this was wrong before
    return pluginState!;
  }, [editorState]);

interface FormattingIconHookProps extends IconHookProps {
  editorAnalyticsAPI: EditorAnalyticsAPI | undefined;
}

export const useFormattingIcons = ({
  isToolbarDisabled,
  editorState,
  intl,
  editorAnalyticsAPI,
}: FormattingIconHookProps): Array<MenuIconItem | null> => {
  const textFormattingPluginState = useTextFormattingPluginState(editorState);
  const { schema } = editorState;
  const props = {
    schema,
    textFormattingPluginState,
    intl,
    isToolbarDisabled: Boolean(isToolbarDisabled),
  };

  const buildStrongIcon = buildIcon(IconTypes.strong, editorAnalyticsAPI);
  const buildEmIcon = buildIcon(IconTypes.em, editorAnalyticsAPI);
  const buildUnderlineIcon = buildIcon(IconTypes.underline, editorAnalyticsAPI);
  const buildStrikeIcon = buildIcon(IconTypes.strike, editorAnalyticsAPI);
  const buildCodeIcon = buildIcon(IconTypes.code, editorAnalyticsAPI);
  const buildSubscriptIcon = buildIcon(IconTypes.subscript, editorAnalyticsAPI);
  const buildSuperscriptIcon = buildIcon(
    IconTypes.superscript,
    editorAnalyticsAPI,
  );

  const strongIcon = buildStrongIcon(props);
  const emIcon = buildEmIcon(props);
  const underlineIcon = buildUnderlineIcon(props);
  const strikeIcon = buildStrikeIcon(props);
  const codeIcon = buildCodeIcon(props);
  const subscriptIcon = buildSubscriptIcon(props);
  const superscriptIcon = buildSuperscriptIcon(props);

  const result = useMemo(
    () => [
      strongIcon,
      emIcon,
      underlineIcon,
      strikeIcon,
      codeIcon,
      subscriptIcon,
      superscriptIcon,
    ],
    [
      strongIcon,
      emIcon,
      underlineIcon,
      strikeIcon,
      codeIcon,
      subscriptIcon,
      superscriptIcon,
    ],
  );

  return result;
};

type Props = {
  editorState: EditorState;
  iconTypeList: IconTypes[];
};
export const useHasFormattingActived = ({
  editorState,
  iconTypeList,
}: Props) => {
  const textFormattingPluginState = useTextFormattingPluginState(editorState);
  const hasActiveFormatting = useMemo(() => {
    if (!textFormattingPluginState) {
      return false;
    }

    return iconTypeList.some(
      (iconType) =>
        textFormattingPluginState[
          `${iconType}Active` as keyof TextFormattingState
        ],
    );
  }, [textFormattingPluginState, iconTypeList]);

  return hasActiveFormatting;
};
