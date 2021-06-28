import React from 'react';
import styled from 'styled-components';
import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/standard-button';

import {
  WithEditorActions,
  EditorActions,
  EditorContext,
  ContextPanel,
} from '../src';
import { TitleArea } from '../example-helpers/PageElements';
import { storyMediaProviderFactory } from '@atlaskit/editor-test-helpers/media-provider';

export const mediaProvider = storyMediaProviderFactory({
  includeUserAuthProvider: false,
});

/**
 * arch next imports
 */
import { EditorPresetCXHTML } from '../src/labs/next/presets/cxhtml';
import { FullPage as FullPageEditor } from '../src/labs/next/full-page';
import { AnalyticsListener } from '@atlaskit/analytics-next';

export const LOCALSTORAGE_defaultDocKey = 'fabric.editor.example.full-page';
export const LOCALSTORAGE_defaultTitleKey =
  'fabric.editor.example.full-page.title';

export const SaveAndCancelButtons = (props: {
  editorActions?: EditorActions;
}) => (
  <ButtonGroup>
    <Button
      tabIndex={-1}
      appearance="primary"
      onClick={() => {
        if (!props.editorActions) {
          return;
        }

        props.editorActions.getValue().then((value) => {
          console.log(value);
          localStorage.setItem(
            LOCALSTORAGE_defaultDocKey,
            JSON.stringify(value),
          );
        });
      }}
    >
      Publish
    </Button>
    <Button tabIndex={-1} appearance="subtle">
      Close
    </Button>
  </ButtonGroup>
);

export const Wrapper: any = styled.div`
  box-sizing: border-box;
  padding: 2px;
  height: calc(100vh - 32px);
`;
Wrapper.displayName = 'Wrapper';

export const Content: any = styled.div`
  padding: 0 20px;
  height: 100%;
  box-sizing: border-box;
`;
Content.displayName = 'Content';

export default function Example() {
  const [disabled, setDisabledState] = React.useState(false);
  const [panel, setPanelState] = React.useState(false);
  const [mounted, setMountState] = React.useState(true);
  const onMount = React.useCallback(() => {
    console.log('on mount');
  }, []);
  const handleEvent = React.useCallback((evt) => {
    console.groupCollapsed('gasv3 event:', evt.payload.action);
    console.log(evt.payload);
    console.groupEnd();
  }, []);

  return (
    <AnalyticsListener channel="editor" onEvent={handleEvent}>
      <EditorContext>
        <Wrapper>
          <Content>
            <button onClick={() => setDisabledState(!disabled)}>
              Toggle Disabled
            </button>
            <button onClick={() => setMountState(!mounted)}>
              Toggle Mount
            </button>
            <button onClick={() => setPanelState(!panel)}>
              Toggle Context Panel
            </button>
            {mounted ? (
              <EditorPresetCXHTML
                placeholder="Use markdown shortcuts to format your page as you type, like * for lists, # for headers, and *** for a horizontal rule."
                mediaProvider={mediaProvider}
              >
                <FullPageEditor
                  defaultValue={
                    (localStorage &&
                      localStorage.getItem(LOCALSTORAGE_defaultDocKey)) ||
                    undefined
                  }
                  onMount={onMount}
                  disabled={disabled}
                  contentComponents={[
                    <TitleArea
                      key="title=placeholder"
                      placeholder="Some text..."
                    />,
                  ]}
                  primaryToolbarComponents={[
                    <WithEditorActions
                      key="editor-actions-save"
                      // tslint:disable-next-line:jsx-no-lambda
                      render={(actions) => (
                        <SaveAndCancelButtons editorActions={actions} />
                      )}
                    />,
                  ]}
                  allowDynamicTextSizing={true}
                  contextPanel={
                    <ContextPanel visible={panel}>
                      <div>Good morning sunshine!</div>
                    </ContextPanel>
                  }
                />
              </EditorPresetCXHTML>
            ) : null}
          </Content>
        </Wrapper>
      </EditorContext>
    </AnalyticsListener>
  );
}
