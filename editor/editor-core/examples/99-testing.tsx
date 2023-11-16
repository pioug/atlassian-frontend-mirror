import React from 'react';
import Button from '@atlaskit/button/standard-button';
import { customInsertMenuItems } from '@atlaskit/editor-test-helpers/mock-insert-menu';
import { AtlassianIcon } from '@atlaskit/logo/atlassian-icon';
import { EmbedHelper } from '@atlaskit/media-integration-test-helpers/embed-helper';
import { createCollabEditProvider } from '@atlaskit/synchrony-test-helpers';

import {
  createEditorExampleForTests,
  mapProvidersToProps,
} from '../example-helpers/create-editor-example-for-tests';
import { Editor, ContextPanel } from '../src';
import { SaveAndCancelButtons } from './5-full-page';
import { TitleInput } from '../example-helpers/PageElements';
import { getDefaultLinkPickerOptions } from '../example-helpers/link-picker';
import type { CollabEditOptions } from '@atlaskit/editor-common/collab';
import { mockDatasourceFetchRequests } from '@atlaskit/link-test-helpers/datasource';
import type { EditorProps } from '../src/types/editor-props';

import { CardClient, SmartCardProvider } from '@atlaskit/link-provider';
import { APIError } from '@atlaskit/linking-common';
import { getData } from '@atlaskit/media-integration-test-helpers/card-client';

import type { ResolveResponse } from '@atlaskit/smart-card/types';
// copied from packages/media/media-integration-test-helpers/src/integration/smart-links-mock-client-utils.ts
class MockedSmartCardClientNoTimeout extends CardClient {
  mockRequest(
    url: string,
  ): Promise<ResolveResponse & { datasources?: Array<any> }> {
    const data = getData(url)!;
    return new Promise((resolve, reject) => {
      const resolution = () => {
        if (url.endsWith('fatal')) {
          reject(new APIError('fatal', 'randomhost', 'It all went wrong'));
        }
        if (url.includes('errored')) {
          reject(new Error('Ohhhh boy'));
        } else {
          resolve(data);
        }
      };

      window.setTimeout(resolution, 0);
    });
  }

  fetchData(url: string): Promise<ResolveResponse> {
    return this.mockRequest(url);
  }

  async prefetchData(url: string): Promise<ResolveResponse | undefined> {
    return this.mockRequest(url);
  }
}

const cardClient = new MockedSmartCardClientNoTimeout('staging');

const EditorTitle: React.FC<{ setDisabled: (arg: boolean) => void }> = ({
  setDisabled,
}) => {
  const onFocus = React.useCallback(() => {
    setDisabled(true);
  }, [setDisabled]);
  const onBlur = React.useCallback(() => {
    setDisabled(false);
  }, [setDisabled]);

  return (
    <TitleInput
      onFocus={onFocus}
      onBlur={onBlur}
      placeholder="Give this page a title..."
    />
  );
};
const EditorWithTitleFocusBehavior: React.FC<EditorProps> = (props) => {
  const [disabled, setDisabled] = React.useState(false);

  const contentComponents = React.useMemo(() => {
    return <EditorTitle setDisabled={setDisabled} />;
  }, []);

  return (
    <Editor
      {...props}
      disabled={disabled}
      contentComponents={contentComponents}
    />
  );
};

export default function EditorExampleForIntegrationTests({ clipboard = true }) {
  return createEditorExampleForTests<any>(
    (props, nonSerializableProps, lifecycleHandlers, withCollab) => {
      const { onMount, onChange, onDestroy } = lifecycleHandlers;

      if (props?.primaryToolbarComponents) {
        const saveIndicator = (
          <div style={{ backgroundColor: '#00FFFF' }}>Save Indicator</div>
        );
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

        if (nonSerializableProps.withTitleFocusHandler) {
          return (
            <EditorWithTitleFocusBehavior
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
        }

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

      if (props.linking?.smartLinks || props.smartLinks) {
        mockDatasourceFetchRequests({ shouldMockORSBatch: true });
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
