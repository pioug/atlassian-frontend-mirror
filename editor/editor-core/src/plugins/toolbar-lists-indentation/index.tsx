import React from 'react';
import type {
  FeatureFlags,
  NextEditorPlugin,
  OptionalPlugin,
} from '@atlaskit/editor-common/types';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import ToolbarListsIndentation from './ui';
import { ToolbarSize } from '../../ui/Toolbar/types';
import { getIndentationButtonsState } from './pm-plugins/indentation-buttons';
import type { FeatureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { ListPlugin } from '@atlaskit/editor-plugin-list';
import type { ToolbarUiComponentFactoryParams } from '../../types';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { IndentationPlugin } from '@atlaskit/editor-plugin-indentation';
import type { TaskAndDecisionsPlugin } from '../tasks-and-decisions/types';

type Config = {
  showIndentationButtons: boolean;
  allowHeadingAndParagraphIndentation: boolean;
};

type ToolbarListsIndentationPlugin = NextEditorPlugin<
  'toolbarListsIndentation',
  {
    pluginConfiguration: Config;
    dependencies: [
      FeatureFlagsPlugin,
      ListPlugin,
      OptionalPlugin<IndentationPlugin>,
      OptionalPlugin<TaskAndDecisionsPlugin>,
      OptionalPlugin<AnalyticsPlugin>,
    ];
  }
>;

const toolbarListsIndentationPlugin: ToolbarListsIndentationPlugin = ({
  config,
  api,
}) => {
  const {
    showIndentationButtons = false,
    allowHeadingAndParagraphIndentation = false,
  } = config ?? {};
  const featureFlags = api?.featureFlags?.sharedState.currentState() || {};

  return {
    name: 'toolbarListsIndentation',

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
          allowHeadingAndParagraphIndentation={
            allowHeadingAndParagraphIndentation
          }
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
  pluginInjectionApi:
    | ExtractInjectionAPI<typeof toolbarListsIndentationPlugin>
    | undefined;
  allowHeadingAndParagraphIndentation: boolean;
};

export function PrimaryToolbarComponent({
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
  allowHeadingAndParagraphIndentation,
}: PrimaryToolbarComponentProps) {
  const { listState, indentationState, taskDecisionState } =
    useSharedPluginState(pluginInjectionApi, [
      'list',
      'indentation',
      'taskDecision',
    ]);

  const toolbarListsIndentationState = getIndentationButtonsState(
    editorView.state,
    allowHeadingAndParagraphIndentation,
    taskDecisionState,
    indentationState,
    pluginInjectionApi?.list.actions.isInsideListItem,
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
      indentationStateNode={toolbarListsIndentationState?.node}
      pluginInjectionApi={pluginInjectionApi}
    />
  );
}

export default toolbarListsIndentationPlugin;
