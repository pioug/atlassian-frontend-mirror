import React from 'react';
import Button from '@atlaskit/button/standard-button';
import { customInsertMenuItems } from '@atlaskit/editor-test-helpers/mock-insert-menu';
import { AtlassianIcon } from '@atlaskit/logo/atlassian-icon';
import { cardClient } from '@atlaskit/media-integration-test-helpers/card-client';
import { EmbedHelper } from '@atlaskit/media-integration-test-helpers/embed-helper';
import { createCollabEditProvider } from '@atlaskit/synchrony-test-helpers';
import { SmartCardProvider } from '@atlaskit/link-provider';

import {
  createEditorExampleForTests,
  mapProvidersToProps,
} from '@atlaskit/editor-core/example-helpers/create-editor-example-for-tests';
import { Editor, ContextPanel } from '@atlaskit/editor-core/src';
import { SaveAndCancelButtons } from '@atlaskit/editor-core/examples/5-full-page';
import { TitleInput } from '@atlaskit/editor-core/example-helpers/PageElements';
import { getDefaultLinkPickerOptions } from '@atlaskit/editor-core/example-helpers/link-picker';
import { CollabEditOptions } from '@atlaskit/editor-core/src/plugins/collab-edit';
import { tablesPlugin as createTablesPlugin } from '../src';

import type { RelativeSelectionPos } from '@atlaskit/editor-common/selection';
import { normalizeFeatureFlags } from '@atlaskit/editor-common/normalize-feature-flags';
import type { FeatureFlags as EditorFeatureFlags } from '@atlaskit/editor-common/types';
import type { Transaction, Selection, EditorState } from 'prosemirror-state';
import type {
  EditorAnalyticsAPI,
  AnalyticsEventPayload,
} from '@atlaskit/editor-common/analytics';

const editorAnalyticsAPI: EditorAnalyticsAPI = {
  attachAnalyticsEvent: (payload: AnalyticsEventPayload) => {
    // You can send your payload to anyplace
    // It is recommend that you delay any blocking operation
    // with 'requestIdleCallback' or 'requestAnimationFrame'
    if (window.requestAnimationFrame) {
      window.requestAnimationFrame(() => {
        /* sending my data */
        console.log('Sending...', payload);
      });
    }

    return (_tr: Transaction) => {
      // Probably, you don't care about this.
      // just return true;
      return true;
    };
  },
};
const editorSelectionAPI = {
  getSelectionPluginState: (state: EditorState) => {
    // DO NOT COPY THIS KIND OF CODE OUTSIDE OF THIS API
    // IT IS DANGEROUS AND YOU WILL BREAK SOMETHING
    return (state as any)['selection$'];
  },
  setSelectionRelativeToNode: ({
    selectionRelativeToNode,
    selection,
  }: {
    selectionRelativeToNode?: RelativeSelectionPos;
    selection?: Selection | null;
  }) => (state: EditorState) => {
    const tr = state.tr;

    // THE CODE BELOW IS REALLY WRONG
    // DO NOT EVEN THINK TO USE THIS ANYWHERE ELSE
    tr.setMeta('selection$', {
      type: 'SET_RELATIVE_SELECTION',
      selectionRelativeToNode,
    });

    if (selection) {
      tr.setSelection(selection);
    }

    return tr;
  },
};

export default function EditorExampleForIntegrationTests({ clipboard = true }) {
  return createEditorExampleForTests<any>(
    (props, nonSerializableProps, lifecycleHandlers, withCollab) => {
      const { onMount, onChange, onDestroy } = lifecycleHandlers;

      if (props?.primaryToolbarComponents) {
        const saveIndicator = <div>Save Indicator</div>;
        const mainButtons = <SaveAndCancelButtons />;

        if (props.primaryToolbarComponents.before) {
          props.primaryToolbarComponents = {
            before: saveIndicator,
            after: mainButtons,
          };
        } else {
          props.primaryToolbarComponents = mainButtons;
        }
      }

      if (props && props.primaryToolbarIconBefore) {
        props.primaryToolbarIconBefore = (
          <Button
            iconBefore={<AtlassianIcon />}
            appearance="subtle"
            href="https://atlaskit.atlassian.com/"
            shouldFitContainer
          ></Button>
        );
      }

      if (props && props.contentComponents) {
        props.contentComponents = (
          <TitleInput placeholder="Give this page a title..." />
        );
      }

      if (nonSerializableProps.withContextPanel) {
        props.contextPanel = (
          <ContextPanel visible={true}>
            <div>
              {new Array(50).fill(
                <p>Somebody once told me the world is gonna roll me</p>,
              )}
            </div>
          </ContextPanel>
        );
      }

      if (nonSerializableProps.withLinkPickerOptions) {
        props.linking = {
          linkPicker: {
            ...getDefaultLinkPickerOptions(),
            ...props.linkPicker,
          },
        };
      }

      if (props.media) {
        props.media = {
          allowMediaSingle: true,
          allowResizing: true,
          allowResizingInTables: true,
          allowLinking: true,
          ...props.media,
        };
      }

      if (!props.performanceTracking) {
        props.performanceTracking = {
          ttiTracking: { enabled: true },
        };
      }

      const tableOptions =
        !props.allowTables || typeof props.allowTables === 'boolean'
          ? {}
          : props.allowTables;

      const getEditorFeatureFlags = (): EditorFeatureFlags => {
        const normalizedFeatureFlags = normalizeFeatureFlags(
          props.featureFlags,
        );

        return {
          ...normalizedFeatureFlags,
        };
      };

      const isMobile = props.appearance === 'mobile';
      const tablesPlugin = createTablesPlugin({
        tableOptions,
        breakoutEnabled: props.appearance === 'full-page',
        allowContextualMenu: !isMobile,
        fullWidthEnabled: props.appearance === 'full-width',
        editorAnalyticsAPI,
        editorSelectionAPI,
        getEditorFeatureFlags,
      });

      props.allowTables = false;
      const dangerouslyAppendPlugins = {
        __plugins: [tablesPlugin],
      };

      const createCollabEdit = (userId: string): CollabEditOptions => {
        return {
          provider: createCollabEditProvider({ userId }),
        };
      };
      const createEditor = (sessionId?: string) => {
        const collabEdit = sessionId ? createCollabEdit(sessionId) : undefined;

        return (
          <Editor
            {...mapProvidersToProps(nonSerializableProps.providers, props)}
            {...nonSerializableProps.providers}
            insertMenuItems={customInsertMenuItems}
            extensionHandlers={nonSerializableProps.extensionHandlers}
            onEditorReady={onMount}
            onChange={onChange}
            onDestroy={onDestroy}
            collabEdit={collabEdit}
            dangerouslyAppendPlugins={dangerouslyAppendPlugins}
          />
        );
      };
      const editorContent = withCollab ? (
        <div>
          {createEditor('rick')}
          {createEditor('morty')}
        </div>
      ) : (
        createEditor()
      );

      if (props.linking?.smartLinks || props.smartLinks) {
        return (
          <SmartCardProvider client={cardClient}>
            {editorContent}
            <EmbedHelper />
          </SmartCardProvider>
        );
      } else {
        return editorContent;
      }
    },
    { clipboard },
  );
}
