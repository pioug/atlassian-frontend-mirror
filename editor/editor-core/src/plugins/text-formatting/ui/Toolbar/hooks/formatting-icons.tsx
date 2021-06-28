import React, { useMemo } from 'react';
import { FormattedMessage, InjectedIntlProps } from 'react-intl';
import { Schema } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import BoldIcon from '@atlaskit/icon/glyph/editor/bold';
import ItalicIcon from '@atlaskit/icon/glyph/editor/italic';
import { Shortcut } from '../../../../../ui/styles';
import { toolbarMessages } from '../toolbar-messages';
import * as commands from '../../../commands/text-formatting';
import { TOOLBAR_ACTION_SUBJECT_ID } from '../../../../../plugins/analytics/types/toolbar-button';
import { pluginKey as textFormattingPluginKey } from '../../../pm-plugins/plugin-key';
import {
  toggleCode,
  toggleStrikethrough,
  toggleUnderline,
  tooltip,
  toggleBold,
  toggleItalic,
  ToolTipContent,
  Keymap,
} from '../../../../../keymaps';
import { Command } from '../../../../../types/command';
import { INPUT_METHOD } from '../../../../analytics/types/enums';
import { TextFormattingState } from '../../../pm-plugins/main';
import {
  IconHookProps,
  MenuIconItem,
  MenuIconState,
  IconTypes,
} from '../types';

const withToolbarInputMethod = (
  func: (props: { inputMethod: INPUT_METHOD.TOOLBAR }) => Command,
): Command => func({ inputMethod: INPUT_METHOD.TOOLBAR });

type BuildIconProps = {
  isToolbarDisabled: boolean;
  textFormattingPluginState: TextFormattingState;
  schema: Schema;
} & InjectedIntlProps;

type IconButtonType = {
  buttonId?: TOOLBAR_ACTION_SUBJECT_ID;
  message: FormattedMessage.MessageDescriptor;
  command: Command;
  tooltipKeymap?: Keymap;
  component?: (props: { label: string }) => React.ReactElement;
};

const IconButtons: Record<IconTypes, IconButtonType> = {
  strong: {
    buttonId: TOOLBAR_ACTION_SUBJECT_ID.TEXT_FORMATTING_STRONG,
    command: withToolbarInputMethod(commands.toggleStrongWithAnalytics),
    message: toolbarMessages.bold,
    tooltipKeymap: toggleBold,
    component: ({ label }) => <BoldIcon label={label} />,
  },
  em: {
    buttonId: TOOLBAR_ACTION_SUBJECT_ID.TEXT_FORMATTING_ITALIC,
    command: withToolbarInputMethod(commands.toggleEmWithAnalytics),
    message: toolbarMessages.italic,
    tooltipKeymap: toggleItalic,
    component: ({ label }) => <ItalicIcon label={label} />,
  },
  underline: {
    command: withToolbarInputMethod(commands.toggleUnderlineWithAnalytics),
    message: toolbarMessages.underline,
    tooltipKeymap: toggleUnderline,
  },
  strike: {
    command: withToolbarInputMethod(commands.toggleStrikeWithAnalytics),
    message: toolbarMessages.strike,
    tooltipKeymap: toggleStrikethrough,
  },
  code: {
    command: withToolbarInputMethod(commands.toggleCodeWithAnalytics),
    message: toolbarMessages.code,
    tooltipKeymap: toggleCode,
  },
  subscript: {
    command: withToolbarInputMethod(commands.toggleSubscriptWithAnalytics),
    message: toolbarMessages.subscript,
  },
  superscript: {
    command: withToolbarInputMethod(commands.toggleSuperscriptWithAnalytics),
    message: toolbarMessages.superscript,
  },
};

type GetIconProps = {
  iconType: IconTypes;
  isDisabled: boolean;
  isActive: boolean;
} & InjectedIntlProps;
const getIcon = ({
  iconType,
  isDisabled,
  isActive,
  intl,
}: GetIconProps): MenuIconItem => {
  const icon = IconButtons[iconType];
  const content = intl.formatMessage(icon.message);
  const { tooltipKeymap } = icon;

  return {
    content,
    buttonId: icon.buttonId,
    iconMark: iconType,
    key: iconType,
    command: icon.command,
    iconElement: icon.component
      ? icon.component({ label: content })
      : undefined,
    tooltipElement: tooltipKeymap ? (
      <ToolTipContent description={content} keymap={tooltipKeymap} />
    ) : undefined,
    elemAfter: tooltipKeymap ? (
      <Shortcut>{tooltip(tooltipKeymap)}</Shortcut>
    ) : undefined,
    value: {
      name: iconType,
    },
    isActive,
    isDisabled,
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

const buildMenuIconState = (iconMark: IconTypes) => ({
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
    textFormattingPluginState[`${iconMark}Active` as keyof TextFormattingState];
  const isDisabled =
    textFormattingPluginState[
      `${iconMark}Disabled` as keyof TextFormattingState
    ];
  const isHidden =
    textFormattingPluginState[`${iconMark}Hidden` as keyof TextFormattingState];

  return {
    isActive: Boolean(isActive),
    isDisabled: Boolean(isDisabled),
    isHidden: Boolean(isHidden),
    hasSchemaMark,
  };
};

const buildIcon = (iconMark: IconTypes) => {
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
        }),
      [isToolbarDisabled, isDisabled, isActive, intl],
    );
    const shouldRenderIcon = hasSchemaMark && !isHidden;

    return useMemo(() => (shouldRenderIcon ? iconComponent : null), [
      shouldRenderIcon,
      iconComponent,
    ]);
  };
};

const buildStrongIcon = buildIcon(IconTypes.strong);
const buildEmIcon = buildIcon(IconTypes.em);
const buildUnderlineIcon = buildIcon(IconTypes.underline);
const buildStrikeIcon = buildIcon(IconTypes.strike);
const buildCodeIcon = buildIcon(IconTypes.code);
const buildSubscriptIcon = buildIcon(IconTypes.subscript);
const buildSuperscriptIcon = buildIcon(IconTypes.superscript);

const useTextFormattingPluginState = (editorState: EditorState) =>
  useMemo(() => textFormattingPluginKey.getState(editorState), [editorState]);

export const useFormattingIcons = ({
  isToolbarDisabled,
  editorState,
  intl,
}: IconHookProps): Array<MenuIconItem | null> => {
  const textFormattingPluginState = useTextFormattingPluginState(editorState);
  const { schema } = editorState;
  const props = {
    schema,
    textFormattingPluginState,
    intl,
    isToolbarDisabled: Boolean(isToolbarDisabled),
  };
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
