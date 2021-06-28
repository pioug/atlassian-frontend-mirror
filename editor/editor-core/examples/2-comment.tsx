/* eslint-disable no-console */

import React from 'react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/standard-button';
import LockCircleIcon from '@atlaskit/icon/glyph/lock-circle';
import Editor, { EditorProps } from './../src/editor';
import EditorContext from './../src/ui/EditorContext';
import WithEditorActions from './../src/ui/WithEditorActions';
import ToolbarHelp from './../src/ui/ToolbarHelp';
import ToolsDrawer from '../example-helpers/ToolsDrawer';
import CollapsedEditor from '../src/ui/CollapsedEditor';
import ToolbarFeedback from '../src/ui/ToolbarFeedback';
import { name, version } from '../package.json';

import { extensionHandlers } from '@atlaskit/editor-test-helpers/extensions';
import { customInsertMenuItems } from '@atlaskit/editor-test-helpers/mock-insert-menu';
import { DevTools } from '../example-helpers/DevTools';

const SAVE_ACTION = () => console.log('Save');
const CANCEL_ACTION = () => console.log('Cancel');
const EXPAND_ACTION = () => console.log('Expand');

const exampleDocument = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        { type: 'text', text: 'Some example document with emojis ' },
        {
          type: 'emoji',
          attrs: {
            shortName: ':catchemall:',
            id: 'atlassian-catchemall',
            text: ':catchemall:',
          },
        },
        { type: 'text', text: ' and mentions ' },
        {
          type: 'mention',
          attrs: { id: '0', text: '@Carolyn', accessLevel: '' },
        },
        { type: 'text', text: '. ' },
      ],
    },
  ],
};

export type Props = {
  editorProps?: EditorProps;
  replacementDoc?: any;
};

export type State = {
  hasJquery?: boolean;
  isExpanded?: boolean;
};

export class CommentEditorWithFeedback extends React.Component<Props, State> {
  state = {
    hasJquery: false,
    isExpanded: false,
  };

  componentDidMount() {
    delete window.jQuery;
    this.loadJquery();
  }

  onFocus = () =>
    this.setState((prevState) => ({ isExpanded: !prevState.isExpanded }));

  render() {
    if (!this.state.hasJquery) {
      return <h3>Please wait, loading jQuery ...</h3>;
    }

    return (
      <EditorContext>
        <div>
          <WithEditorActions
            render={(actions) => (
              <ButtonGroup>
                <Button
                  onClick={() =>
                    actions.replaceDocument(
                      this.props.replacementDoc || exampleDocument,
                    )
                  }
                >
                  Load Document
                </Button>
                <Button onClick={() => actions.clear()}>Clear</Button>
              </ButtonGroup>
            )}
          />
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
              <div style={{ padding: '20px' }}>
                <CollapsedEditor
                  placeholder="What do you want to say?"
                  isExpanded={this.state.isExpanded}
                  onFocus={this.onFocus}
                  onExpand={EXPAND_ACTION}
                >
                  <Editor
                    appearance="comment"
                    placeholder="What do you want to say?"
                    allowAnalyticsGASV3={true}
                    shouldFocus={true}
                    quickInsert={true}
                    allowTextColor={true}
                    allowRule={true}
                    allowTables={{
                      allowControls: true,
                    }}
                    allowHelpDialog={true}
                    disabled={disabled}
                    activityProvider={activityProvider}
                    mentionProvider={mentionProvider}
                    emojiProvider={emojiProvider}
                    media={{
                      provider: mediaProvider,
                      allowMediaSingle: true,
                      allowResizing: true,
                    }}
                    allowDynamicTextSizing={enabledFeatures.dynamicTextSizing}
                    taskDecisionProvider={taskDecisionProvider}
                    contextIdentifierProvider={contextIdentifierProvider}
                    onChange={onChange}
                    onSave={SAVE_ACTION}
                    onCancel={CANCEL_ACTION}
                    feedbackInfo={{
                      product: 'bitbucket',
                      packageVersion: version,
                      packageName: name,
                      labels: ['atlaskit-comment'],
                    }}
                    primaryToolbarComponents={
                      <>
                        <ToolbarFeedback
                          product="bitbucket"
                          key="toolbar-feedback"
                        />
                        <ToolbarHelp key="toolbar-help" />
                      </>
                    }
                    allowExtension={true}
                    insertMenuItems={customInsertMenuItems}
                    extensionHandlers={extensionHandlers}
                    secondaryToolbarComponents={[
                      <LockCircleIcon
                        key="permission"
                        size="large"
                        label="Permissions"
                      />,
                    ]}
                    {...this.props.editorProps}
                  />
                </CollapsedEditor>
              </div>
            )}
          />
          <DevTools />
        </div>
      </EditorContext>
    );
  }

  private loadJquery = () => {
    const scriptElem = document.createElement('script');
    scriptElem.type = 'text/javascript';
    scriptElem.src =
      'https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js';

    scriptElem.onload = () => {
      this.setState({
        ...this.state,
        hasJquery: true,
      });
    };

    document.body.appendChild(scriptElem);
  };
}

export default CommentEditorWithFeedback;
