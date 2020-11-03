import React from 'react';
import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/standard-button';

import Editor from './../src/editor';
import EditorContext from './../src/ui/EditorContext';
import WithEditorActions from './../src/ui/WithEditorActions';
import { cardProvider } from '@atlaskit/editor-test-helpers/card-provider';
import { macroProvider } from '@atlaskit/editor-test-helpers/mock-macro-provider';
import ToolsDrawer from '../example-helpers/ToolsDrawer';

import { extensionHandlers } from '@atlaskit/editor-test-helpers/extensions';
import { customInsertMenuItems } from '@atlaskit/editor-test-helpers/mock-insert-menu';
import { exampleDocument } from '../example-helpers/example-document';
import quickInsertProviderFactory from '../example-helpers/quick-insert-provider';
import { DevTools } from '../example-helpers/DevTools';
import { Wrapper, Content } from './5-full-page';
import withSentry from '../example-helpers/withSentry';
import { EditorActions } from '../src';

// eslint-disable-next-line no-console
const SAVE_ACTION = () => console.log('Save');

const SaveAndCancelButtons = (props: { editorActions: EditorActions }) => (
  <ButtonGroup>
    <Button
      className="loadExampleDocument"
      onClick={() =>
        props.editorActions.replaceDocument(exampleDocument, false)
      }
    >
      Load Example
    </Button>
    <Button
      appearance="primary"
      onClick={() =>
        props.editorActions
          .getValue()
          // eslint-disable-next-line no-console
          .then(value => console.log(value))
      }
    >
      Publish
    </Button>
    <Button appearance="subtle" onClick={() => props.editorActions.clear()}>
      Close
    </Button>
  </ButtonGroup>
);

export type Props = {
  defaultValue?: Object;
};

const quickInsertProvider = quickInsertProviderFactory();

class ExampleEditorFullPage extends React.Component<Props> {
  render() {
    return (
      <Wrapper>
        <Content>
          <ToolsDrawer
            renderEditor={({
              mentionProvider,
              emojiProvider,
              mediaProvider,
              activityProvider,
              taskDecisionProvider,
              contextIdentifierProvider,
              onChange,
              disabled,
              enabledFeatures,
            }: any) => (
              <Editor
                defaultValue={this.props.defaultValue}
                appearance="full-page"
                allowAnalyticsGASV3={true}
                quickInsert={{
                  provider: Promise.resolve(quickInsertProvider),
                }}
                allowBreakout={true}
                allowTextColor={true}
                allowTextAlignment={true}
                allowIndentation={true}
                allowTables={{
                  allowColumnSorting: true,
                  allowColumnResizing: true,
                  allowMergeCells: true,
                  allowNumberColumn: true,
                  allowBackgroundColor: true,
                  allowHeaderRow: true,
                  allowHeaderColumn: true,
                  permittedLayouts: 'all',
                  stickToolbarToBottom: true,
                }}
                allowJiraIssue={true}
                allowPanel={true}
                allowStatus={true}
                allowExtension={{
                  allowBreakout: true,
                }}
                allowRule={true}
                allowDate={true}
                allowLayouts={true}
                allowTemplatePlaceholders={{ allowInserting: true }}
                UNSAFE_cards={{
                  provider: Promise.resolve(cardProvider),
                }}
                activityProvider={activityProvider}
                mentionProvider={mentionProvider}
                emojiProvider={emojiProvider}
                taskDecisionProvider={taskDecisionProvider}
                contextIdentifierProvider={contextIdentifierProvider}
                macroProvider={Promise.resolve(macroProvider)}
                media={{
                  provider: mediaProvider,
                  allowMediaSingle: true,
                  allowResizing: enabledFeatures.imageResizing,
                }}
                allowDynamicTextSizing={enabledFeatures.dynamicTextSizing}
                placeholder="Write something..."
                shouldFocus={false}
                onChange={onChange}
                disabled={disabled}
                primaryToolbarComponents={
                  <WithEditorActions
                    render={actions => (
                      <SaveAndCancelButtons editorActions={actions} />
                    )}
                  />
                }
                onSave={SAVE_ACTION}
                insertMenuItems={customInsertMenuItems}
                extensionHandlers={extensionHandlers}
              />
            )}
          />
        </Content>
      </Wrapper>
    );
  }
}

export const ExampleEditor = withSentry(ExampleEditorFullPage);

function Example(defaultValue: string | object) {
  return (
    <EditorContext>
      <div style={{ height: '100%' }}>
        <DevTools />
        <ExampleEditorFullPage defaultValue={defaultValue} />
      </div>
    </EditorContext>
  );
}

export default withSentry(Example);
