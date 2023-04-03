// #region Imports
import React from 'react';
import { MentionProvider } from '@atlaskit/mention/resource';
//import { tablesPlugin } from '@atlaskit/editor-plugin-table';
//
//import {
//  panelPlugin,
//  listPlugin,
//  textColorPlugin,
//  breakoutPlugin,
//  jiraIssuePlugin,
//  extensionPlugin,
//  rulePlugin,
//  datePlugin,
//  layoutPlugin,
//  indentationPlugin,
//  cardPlugin,
//  statusPlugin,
//  mediaPlugin,
//  mentionsPlugin,
//  tasksAndDecisionsPlugin,
//  insertBlockPlugin,
//  basePlugin,
//  //placeholderPlugin,
//} from '../../../plugins';
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
  const [defaultPreset] = useDefaultPreset({
    featureFlags,
    paste: {},
  });

  const preset = defaultPreset;
  //.add([
  //  basePlugin,
  //  {
  //    allowInlineCursorTarget: true,
  //    allowScrollGutter: {
  //      getScrollElement: (_view) =>
  //        document.querySelector('.fabric-editor-popup-scroll-parent') ||
  //        null,
  //    },
  //  },
  //])
  //.add([tablesPlugin, { tableOptions: { advanced: true } }])
  //.add([panelPlugin, { allowCustomPanel: true }])
  //.add(listPlugin)
  //.add(textColorPlugin)
  //.add(breakoutPlugin)
  //.add(jiraIssuePlugin)
  //.add(extensionPlugin)
  //.add(rulePlugin)
  //.add(datePlugin)
  //.add(layoutPlugin)
  //.add(indentationPlugin)
  //.add([cardPlugin, { allowBlockCards: true, platform: 'web' }])
  //.add([statusPlugin, { menuDisabled: false }])
  //.add(tasksAndDecisionsPlugin)
  //.add(insertBlockPlugin)
  ////.add([placeholderPlugin, { placeholder }])
  //.maybeAdd(mentionsPlugin, (plugin, builder) => {
  //  if (mentionProvider) {
  //    return builder.add(plugin);
  //  }
  //  return builder;
  //})
  //.maybeAdd(mediaPlugin, (plugin, builder) => {
  //  if (mediaProvider) {
  //    preset.add([
  //      plugin,
  //      {
  //        provider: mediaProvider,
  //        allowMediaSingle: true,
  //        allowMediaGroup: true,
  //        allowResizing: true,
  //        allowLinking: true,
  //        allowResizingInTables: true,
  //        allowAltTextOnImages: true,
  //      },
  //    ]);
  //  }
  //  return builder;
  //});

  return [preset];
}

export function EditorPresetCXHTML(props: EditorPresetCXHTMLProps) {
  const { children, excludes } = props;
  const [preset] = useCXHTMLPreset(props);
  const plugins = preset.build({ excludePlugins: excludes });

  return <PresetProvider value={plugins}>{children}</PresetProvider>;
}
