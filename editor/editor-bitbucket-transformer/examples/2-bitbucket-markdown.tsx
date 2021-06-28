/* eslint-disable no-console */

import React from 'react';

import { Editor, EditorContext, CollapsedEditor } from '@atlaskit/editor-core';
import { getMockTaskDecisionResource } from '@atlaskit/util-data-test/task-decision-story-data';
import ToolsDrawer from '../example-helpers/ToolsDrawer';
import { BitbucketTransformer } from '../src';

const SAVE_ACTION = () => console.log('Save');
const CANCEL_ACTION = () => console.log('Cancel');
const EXPAND_ACTION = () => console.log('Expand');

export type Props = {};
export type State = {
  hasJquery?: boolean;
  isExpanded?: boolean;
};

export default class EditorWithFeedback extends React.Component<Props, State> {
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
          <ToolsDrawer
            renderEditor={({
              mentionProvider,
              emojiProvider,
              onChange,
              disabled,
            }) => (
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
                    shouldFocus={true}
                    allowRule={true}
                    allowHelpDialog={true}
                    disabled={disabled}
                    mentionProvider={mentionProvider}
                    emojiProvider={emojiProvider}
                    onChange={onChange}
                    onSave={SAVE_ACTION}
                    onCancel={CANCEL_ACTION}
                    contentTransformerProvider={(schema) =>
                      new BitbucketTransformer(schema)
                    }
                    taskDecisionProvider={Promise.resolve(
                      getMockTaskDecisionResource(),
                    )}
                  />
                </CollapsedEditor>
              </div>
            )}
          />
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
