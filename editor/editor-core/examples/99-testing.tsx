import React from 'react';
import Button from '@atlaskit/button/standard-button';
import { customInsertMenuItems } from '@atlaskit/editor-test-helpers/mock-insert-menu';
import { AtlassianIcon } from '@atlaskit/logo/atlassian-icon';
import { cardClient } from '@atlaskit/media-integration-test-helpers/card-client';
import { EmbedHelper } from '@atlaskit/media-integration-test-helpers/embed-helper';
import { createCollabEditProvider } from '@atlaskit/synchrony-test-helpers';
import { Provider as SmartCardProvider } from '@atlaskit/smart-card';

import {
  createEditorExampleForTests,
  mapProvidersToProps,
} from '../example-helpers/create-editor-example-for-tests';
import { Editor, ContextPanel } from '../src';
import { SaveAndCancelButtons } from './5-full-page';
import { TitleInput } from '../example-helpers/PageElements';
import { CollabEditOptions } from '../src/plugins/collab-edit';

export default function EditorExampleForIntegrationTests({ clipboard = true }) {
  return createEditorExampleForTests<any>(
    (props, nonSerializableProps, lifecycleHandlers, withCollab) => {
      const { onMount, onChange, onDestroy } = lifecycleHandlers;

      if (props && props.primaryToolbarComponents) {
        props.primaryToolbarComponents = <SaveAndCancelButtons />;
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

      if (props && props.smartLinks) {
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
