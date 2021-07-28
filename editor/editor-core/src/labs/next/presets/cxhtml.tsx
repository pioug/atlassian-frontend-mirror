// #region Imports
import React from 'react';
import { MentionProvider } from '@atlaskit/mention/resource';

import {
  tablesPlugin,
  panelPlugin,
  listPlugin,
  textColorPlugin,
  breakoutPlugin,
  jiraIssuePlugin,
  extensionPlugin,
  rulePlugin,
  datePlugin,
  layoutPlugin,
  indentationPlugin,
  cardPlugin,
  statusPlugin,
  mediaPlugin,
  mentionsPlugin,
  tasksAndDecisionsPlugin,
  insertBlockPlugin,
  basePlugin,
  placeholderPlugin,
} from '../../../plugins';
import { MediaProvider } from '../../../plugins/media';
import { PresetProvider } from '../Editor';
import { EditorPresetProps } from './types';
import { useDefaultPreset } from './default';
// #endregion

export type EditorPresetCXHTMLProps = {
  children?: React.ReactNode;
  placeholder?: string;
  mentionProvider?: Promise<MentionProvider>;
  mediaProvider?: Promise<MediaProvider>;
} & EditorPresetProps;

export function useCXHTMLPreset({
  mentionProvider,
  mediaProvider,
  placeholder,
  featureFlags,
}: EditorPresetCXHTMLProps) {
  const [preset] = useDefaultPreset({
    featureFlags,
    paste: {},
  });

  preset.add([
    basePlugin,
    {
      allowInlineCursorTarget: true,
      allowScrollGutter: {
        getScrollElement: (_view) =>
          document.querySelector('.fabric-editor-popup-scroll-parent') || null,
      },
    },
  ]);
  preset.add([tablesPlugin, { tableOptions: { advanced: true } }]);
  preset.add([panelPlugin, { UNSAFE_allowCustomPanel: true }]);
  preset.add(listPlugin);
  preset.add(textColorPlugin);
  preset.add(breakoutPlugin);
  preset.add(jiraIssuePlugin);
  preset.add(extensionPlugin);
  preset.add(rulePlugin);
  preset.add(datePlugin);
  preset.add(layoutPlugin);
  preset.add(indentationPlugin);
  preset.add([cardPlugin, { allowBlockCards: true, platform: 'web' }]);
  preset.add([statusPlugin, { menuDisabled: false }]);
  preset.add(tasksAndDecisionsPlugin);
  preset.add(insertBlockPlugin);
  preset.add([placeholderPlugin, { placeholder }]);

  if (mentionProvider) {
    preset.add(mentionsPlugin);
  }

  if (mediaProvider) {
    preset.add([
      mediaPlugin,
      {
        provider: mediaProvider,
        allowMediaSingle: true,
        allowMediaGroup: true,
        allowAnnotation: true,
        allowResizing: true,
        allowLinking: true,
        allowResizingInTables: true,
        allowAltTextOnImages: true,
      },
    ]);
  }

  return [preset];
}

export function EditorPresetCXHTML(props: EditorPresetCXHTMLProps) {
  const { children, excludes } = props;
  const [preset] = useCXHTMLPreset(props);
  const plugins = preset.getEditorPlugins(excludes);

  return <PresetProvider value={plugins}>{children}</PresetProvider>;
}
