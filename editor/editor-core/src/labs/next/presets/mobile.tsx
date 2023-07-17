// #region Imports
import React from 'react';
import {
  // useProvider,
  useProviderFactory,
} from '@atlaskit/editor-common/provider-factory';
//import analyticsPlugin from '../../../plugins/analytics';
//import basePlugin from '../../../plugins/base';
//import { cardPlugin } from '@atlaskit/editor-plugin-card';
//import datePlugin from '../../../plugins/date';
//import emojiPlugin from '../../../plugins/emoji';
//import extensionPlugin from '../../../plugins/extension';
//import layoutPlugin from '../../../plugins/layout';
//import listPlugin from '../../../plugins/list';
import { CustomMediaPicker } from '../../../plugins/media';
//import mentionsPlugin from '../../../plugins/mentions';
//import mobileDimensionsPlugin from '../../../plugins/mobile-dimensions';
//import panelPlugin from '../../../plugins/panel';
//import placeholderPlugin from '../../../plugins/placeholder';
//import rulePlugin from '../../../plugins/rule';
//import statusPlugin from '../../../plugins/status';
//import { tablesPlugin } from '@atlaskit/editor-plugin-table';
//import tasksAndDecisionsPlugin from '../../../plugins/tasks-and-decisions';
//import textColorPlugin from '../../../plugins/text-color';
//import maxContentSizePlugin from '../../../plugins/max-content-size';
//import expandPlugin from '../../../plugins/expand';
//import selectionPlugin from '../../../plugins/selection';
import { PresetProvider } from '../Editor';
import { EditorPresetProps } from './types';
import { useDefaultPreset } from './default';
import { addExcludesFromProviderFactory } from './utils';
//import { quickInsertPlugin } from '../../../plugins';

// #endregion

type EditorPresetMobileProps = {
  children?: React.ReactNode;
  placeholder?: string;
  maxContentSize?: number;
  createAnalyticsEvent?: any;
  media?: {
    picker?: CustomMediaPicker;
    allowMediaSingle?: boolean;
  };
} & EditorPresetProps;

export function useMobilePreset({
  media,
  placeholder,
  maxContentSize,
  createAnalyticsEvent,
  featureFlags,
}: EditorPresetMobileProps & EditorPresetProps) {
  //const mediaProvider = useProvider('mediaProvider');
  const [defaultPreset] = useDefaultPreset({
    featureFlags,
    paste: {},
  });

  const preset = defaultPreset;
  //.add([
  //  basePlugin,
  //  {
  //    allowScrollGutter: {
  //      getScrollElement: () => document.body,
  //      allowCustomScrollHandler: false,
  //    },
  //  },
  //])
  //.add([analyticsPlugin, createAnalyticsEvent])
  //.add([tablesPlugin, { tableOptions: { allowControls: false } }])
  //.add(panelPlugin)
  //.add(listPlugin)
  //.add(textColorPlugin)
  //.add(extensionPlugin)
  //.add(rulePlugin)
  //.add(datePlugin)
  //.add(layoutPlugin)
  //.add([quickInsertPlugin, { headless: true, disableDefaultItems: true }])
  //.add([statusPlugin, { menuDisabled: false }])
  //.add([placeholderPlugin, { placeholder }])
  //.add(mobileDimensionsPlugin)
  //.add(expandPlugin)
  ////.add([selectionPlugin, { useLongPressSelection: false }])
  //// Begin -> This would be exclude if the provider doesnt exist in the factory
  //.add(tasksAndDecisionsPlugin)
  //.add([cardPlugin, { allowBlockCards: true, platform: 'mobile' }])
  //.add(mentionsPlugin)
  //.add(emojiPlugin)
  //// End
  //.maybeAdd(maxContentSizePlugin, (plugin, builder) => {
  //  if (maxContentSize) {
  //    return builder.add([plugin, maxContentSize as any]);
  //  }
  //  return builder;
  //})
  //.maybeAdd(mediaPlugin, (plugin, builder) => {
  //  if (media) {
  //    return builder.add([
  //      plugin,
  //      {
  //        provider: mediaProvider,
  //        customMediaPicker: media.picker,
  //        fullWidthEnabled: false,
  //        allowMediaSingle: true,
  //        allowLazyLoading: false,
  //        allowMediaSingleEditable: false,
  //        allowRemoteDimensionsFetch: false,
  //        allowMarkingUploadsAsIncomplete: true,
  //        allowAltTextOnImages: true,
  //        allowTemplatePlaceholders: { allowInserting: true },
  //      },
  //    ]);
  //  }

  //  return builder;
  //});

  return [preset];
}

export type MobilePresetProps = EditorPresetMobileProps & EditorPresetProps;

export function EditorPresetMobile(props: MobilePresetProps) {
  const { children, excludes } = props;
  const [preset] = useMobilePreset(props);
  const providerFactory = useProviderFactory();

  const plugins = preset.build({
    excludePlugins: addExcludesFromProviderFactory(providerFactory, excludes),
  });

  return <PresetProvider value={plugins}>{children}</PresetProvider>;
}
