import React from 'react';
import type {
  FeatureFlags,
  NextEditorPlugin,
  OptionalPlugin,
} from '@atlaskit/editor-common/types';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import ToolbarListsIndentation from './ui';
import { ToolbarSize } from '../../ui/Toolbar/types';
import { createPlugin as indentationButtonsPlugin } from './pm-plugins/indentation-buttons';
import type featureFlagsPlugin from '@atlaskit/editor-plugin-feature-flags';
import type { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { ListPlugin } from '@atlaskit/editor-plugin-list';
import type { IndentationButtons } from './pm-plugins/indentation-buttons';
import type { ToolbarUiComponentFactoryParams } from '../../types';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { pluginKey as indentationButtonPluginKey } from './pm-plugins/indentation-buttons';

type Config = {
  showIndentationButtons: boolean;
  allowHeadingAndParagraphIndentation: boolean;
};
const toolbarListsIndentationPlugin: NextEditorPlugin<
  'toolbarListsIndentation',
  {
    pluginConfiguration: Config;
    dependencies: [
      typeof featureFlagsPlugin,
      ListPlugin,
      OptionalPlugin<typeof analyticsPlugin>,
    ];
    sharedState: IndentationButtons | undefined;
  }
> = ({ showIndentationButtons, allowHeadingAndParagraphIndentation }, api) => {
  const featureFlags =
    api?.dependencies.featureFlags?.sharedState.currentState() || {};

  return {
    name: 'toolbarListsIndentation',

    getSharedState(editorState) {
      if (!editorState) {
        return undefined;
      }
      return indentationButtonPluginKey.getState(editorState);
    },

    pmPlugins() {
      return [
        {
          name: 'indentationButtons',
          plugin: ({ dispatch }) =>
            indentationButtonsPlugin({
              dispatch,
              showIndentationButtons,
              allowHeadingAndParagraphIndentation,
              api,
            }),
        },
      ];
    },

    primaryToolbarComponent({
      editorView,
      popupsMountPoint,
      popupsBoundariesElement,
      popupsScrollableElement,
      toolbarSize,
      disabled,
      isToolbarReducedSpacing,
    }) {
      const isSmall = toolbarSize < ToolbarSize.L;

      return (
        <PrimaryToolbarComponent
          featureFlags={featureFlags}
          popupsMountPoint={popupsMountPoint}
          popupsBoundariesElement={popupsBoundariesElement}
          popupsScrollableElement={popupsScrollableElement}
          isSmall={isSmall}
          isToolbarReducedSpacing={isToolbarReducedSpacing}
          disabled={disabled}
          editorView={editorView}
          showIndentationButtons={showIndentationButtons}
          pluginInjectionApi={api}
        />
      );
    },
  };
};

type PrimaryToolbarComponentProps = Pick<
  ToolbarUiComponentFactoryParams,
  | 'editorView'
  | 'popupsMountPoint'
  | 'popupsBoundariesElement'
  | 'popupsScrollableElement'
  | 'disabled'
  | 'isToolbarReducedSpacing'
> & {
  featureFlags: FeatureFlags;
  isSmall: boolean;
  showIndentationButtons?: boolean;
  pluginInjectionApi?:
    | ExtractInjectionAPI<typeof toolbarListsIndentationPlugin>
    | undefined;
};

function PrimaryToolbarComponent({
  featureFlags,
  popupsMountPoint,
  popupsBoundariesElement,
  popupsScrollableElement,
  isSmall,
  isToolbarReducedSpacing,
  disabled,
  editorView,
  showIndentationButtons,
  pluginInjectionApi,
}: PrimaryToolbarComponentProps) {
  const { listState, toolbarListsIndentationState } = useSharedPluginState(
    pluginInjectionApi,
    ['list', 'toolbarListsIndentation'],
  );

  if (!listState) {
    return null;
  }
  return (
    <ToolbarListsIndentation
      featureFlags={featureFlags}
      isSmall={isSmall}
      isReducedSpacing={isToolbarReducedSpacing}
      disabled={disabled}
      editorView={editorView}
      popupsMountPoint={popupsMountPoint}
      popupsBoundariesElement={popupsBoundariesElement}
      popupsScrollableElement={popupsScrollableElement}
      bulletListActive={listState!.bulletListActive}
      bulletListDisabled={listState!.bulletListDisabled}
      orderedListActive={listState!.orderedListActive}
      orderedListDisabled={listState!.orderedListDisabled}
      showIndentationButtons={!!showIndentationButtons}
      indentDisabled={toolbarListsIndentationState!.indentDisabled}
      outdentDisabled={toolbarListsIndentationState!.outdentDisabled}
      pluginInjectionApi={pluginInjectionApi}
    />
  );
}

export default toolbarListsIndentationPlugin;
