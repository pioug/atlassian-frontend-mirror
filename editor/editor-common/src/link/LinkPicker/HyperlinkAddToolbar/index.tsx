import React from 'react';

import { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { EditorView } from '@atlaskit/editor-prosemirror/view';
import { LinkPickerProps } from '@atlaskit/link-picker';

import { INPUT_METHOD } from '../../../analytics';
import type { HyperlinkState } from '../../../link';
import { ProviderFactory, WithProviders } from '../../../provider-factory';
import type {
  Command,
  FeatureFlags,
  LinkInputType,
  LinkPickerOptions,
} from '../../../types';
import { EditorLinkPicker, EditorLinkPickerProps } from '../EditorLinkPicker';

import HyperlinkAddToolbarComp from './HyperlinkAddToolbar';

export interface HyperlinkAddToolbarProps
  extends Pick<EditorLinkPickerProps, 'onCancel' | 'invokeMethod' | 'onClose'> {
  view: EditorView;
  providerFactory: ProviderFactory;
  onSubmit: (
    href: string,
    title: string | undefined,
    displayText: string | undefined,
    inputMethod: LinkInputType,
    analytic?: UIAnalyticsEvent | null | undefined,
  ) => void;
  featureFlags: FeatureFlags;
  linkPickerOptions?: LinkPickerOptions;
  displayText?: string;
  displayUrl?: string;
  onEscapeCallback?: Command;
  onClickAwayCallback?: Command;
}

/**
 * Wraps around the editor's onSubmit handler so that the plugin can interface with the link picker
 */
const onSubmitInterface =
  (
    onSubmit: HyperlinkAddToolbarProps['onSubmit'],
  ): LinkPickerProps['onSubmit'] =>
  ({ url, title, displayText, rawUrl, meta }, analytic) => {
    onSubmit(
      url,
      title ?? rawUrl,
      displayText || undefined,
      meta.inputMethod === 'manual'
        ? INPUT_METHOD.MANUAL
        : INPUT_METHOD.TYPEAHEAD,
      analytic,
    );
  };

export function HyperlinkAddToolbar({
  linkPickerOptions = {},
  onSubmit,
  displayText,
  displayUrl,
  providerFactory,
  view,
  onCancel,
  invokeMethod,
  featureFlags,
  onClose,
  onEscapeCallback,
  onClickAwayCallback,
  hyperlinkPluginState,
}: HyperlinkAddToolbarProps & {
  hyperlinkPluginState: HyperlinkState | undefined;
}) {
  return (
    <WithProviders
      providers={['activityProvider', 'searchProvider']}
      providerFactory={providerFactory}
      renderNode={({ activityProvider, searchProvider }) => {
        const { lpLinkPicker } = featureFlags;

        if (lpLinkPicker) {
          return (
            <EditorLinkPicker
              view={view}
              invokeMethod={
                // Provide `invokeMethod` prop as preferred value (card plugin passes as prop) otherwise assume this
                // is being used from inside the hyperlink plugin and use inputMethod from plugin state
                invokeMethod ?? hyperlinkPluginState?.inputMethod
              }
              editorAppearance={hyperlinkPluginState?.editorAppearance}
              {...linkPickerOptions}
              url={displayUrl}
              displayText={displayText}
              onSubmit={onSubmitInterface(onSubmit)}
              onCancel={onCancel}
              onClose={onClose}
              onEscapeCallback={onEscapeCallback}
              onClickAwayCallback={onClickAwayCallback}
            />
          );
        }

        return (
          <HyperlinkAddToolbarComp
            activityProvider={activityProvider}
            searchProvider={searchProvider}
            onSubmit={onSubmit}
            displayText={displayText}
            displayUrl={displayUrl}
            pluginState={hyperlinkPluginState!}
            view={view}
            onEscapeCallback={onEscapeCallback}
            onClickAwayCallback={onClickAwayCallback}
          />
        );
      }}
    />
  );
}
