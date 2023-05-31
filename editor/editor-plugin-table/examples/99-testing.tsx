import React from 'react';
import { IntlProvider } from 'react-intl-next';
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

      const createCollabEdit = (userId: string): CollabEditOptions => {
        return {
          provider: createCollabEditProvider({ userId }),
        };
      };
      const createEditor = (sessionId?: string) => {
        const collabEdit = sessionId ? createCollabEdit(sessionId) : undefined;

        return (
          <IntlProvider locale="en">
            <Editor
              {...mapProvidersToProps(nonSerializableProps.providers, props)}
              {...nonSerializableProps.providers}
              insertMenuItems={customInsertMenuItems}
              extensionHandlers={nonSerializableProps.extensionHandlers}
              onEditorReady={onMount}
              onChange={onChange}
              onDestroy={onDestroy}
              collabEdit={collabEdit}
            />
          </IntlProvider>
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
