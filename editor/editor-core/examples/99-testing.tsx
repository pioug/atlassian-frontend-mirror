import React from 'react';
import { customInsertMenuItems } from '@atlaskit/editor-test-helpers/mock-insert-menu';
import Button from '@atlaskit/button';
import { AtlassianIcon } from '@atlaskit/logo';
import { Provider as SmartCardProvider } from '@atlaskit/smart-card';

import {
  createEditorExampleForTests,
  mapProvidersToProps,
} from '../example-helpers/create-editor-example-for-tests';
import { Editor, ContextPanel } from '../src';
import { SaveAndCancelButtons } from './5-full-page';
import { TitleInput } from '../example-helpers/PageElements';
import { cardClient } from '../example-helpers/smart-card';

export default function EditorExampleForIntegrationTests({ clipboard = true }) {
  return createEditorExampleForTests<any>(
    (props, nonSerializableProps, lifecycleHandlers) => {
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
      const editor = (
        <Editor
          {...mapProvidersToProps(nonSerializableProps.providers, props)}
          {...nonSerializableProps.providers}
          insertMenuItems={customInsertMenuItems}
          extensionHandlers={nonSerializableProps.extensionHandlers}
          onEditorReady={onMount}
          onChange={onChange}
          onDestroy={onDestroy}
        />
      );

      if (props && props.UNSAFE_cards) {
        return (
          <SmartCardProvider client={cardClient}>{editor}</SmartCardProvider>
        );
      } else {
        return editor;
      }
    },
    { clipboard },
  );
}
