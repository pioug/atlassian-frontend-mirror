/**
 *
 * PLEASE DO NOT REMOVE THIS EXAMPLE
 * it is used on developer.atlassian.com documentation
 *
 * this is the page where it is used; https://developer.atlassian.com/cloud/jira/platform/apis/document/playground/
 *
 */
import React from 'react';
import TextArea from '@atlaskit/textarea';
import EditorContext from '../src/ui/EditorContext';
import WithEditorActions from '../src/ui/WithEditorActions';
import { EditorActions } from '../src';
import ToolbarHelp from '../src/ui/ToolbarHelp';
import Editor from './../src/editor';
import {
  getEmojiProvider,
  currentUser,
} from '@atlaskit/util-data-test/get-emoji-provider';
import { mentionResourceProvider } from '@atlaskit/util-data-test/mention-story-data';
import { getMockTaskDecisionResource } from '@atlaskit/util-data-test/task-decision-story-data';
import { mediaProvider } from './5-full-page';
import { EmojiProvider } from '@atlaskit/emoji/resource';
import styled from 'styled-components';

interface AdfState {
  isValidAdf: boolean;
}

const Wrapper: any = styled.div`
  display: 'flex';
  padding: '10px';
  flex-direction: 'column';
`;

export const providers: any = {
  emojiProvider: getEmojiProvider({
    uploadSupported: true,
    currentUser,
  }) as Promise<EmojiProvider>,
  taskDecisionProvider: Promise.resolve(getMockTaskDecisionResource()),
  mentionProvider: Promise.resolve(mentionResourceProvider),
};

export default class Example extends React.Component<{}, AdfState> {
  private editorActions?: EditorActions;
  private adfTextArea?: HTMLTextAreaElement;
  state = {
    isValidAdf: true,
  };

  render() {
    return (
      <EditorContext>
        <Wrapper>
          <div>
            <WithEditorActions
              render={(actions) => {
                this.editorActions = actions;
                return (
                  <Editor
                    onChange={this.handleEditorChange}
                    appearance="full-page"
                    allowRule={true}
                    allowTextColor={true}
                    allowTables={{
                      allowControls: true,
                    }}
                    allowPanel={true}
                    allowHelpDialog={true}
                    placeholder="We support markdown! Try **bold**, `inline code`, or ``` for code blocks."
                    primaryToolbarComponents={[
                      <ToolbarHelp key={1} titlePosition="top" title="Help" />,
                    ]}
                    media={{
                      provider: mediaProvider,
                      allowMediaSingle: true,
                    }}
                    {...providers}
                  />
                );
              }}
            />
          </div>
          <div>
            <h2>ADF</h2>
            <TextArea
              onChange={this.handleAdfChange}
              isInvalid={!this.state.isValidAdf}
              ref={(ref: any) => (this.adfTextArea = ref)}
              placeholder='{"version": 1...'
              isMonospaced={true}
              minimumRows={20}
            />
          </div>
        </Wrapper>
      </EditorContext>
    );
  }

  private handleAdfChange = (e: { target: { value: string } }) => {
    try {
      if (this.editorActions) {
        this.editorActions.replaceDocument(e.target.value);
      }
    } catch (error) {
      this.setState({ isValidAdf: false });
      throw new Error(error);
    }
    this.setState({ isValidAdf: true });
  };

  private handleEditorChange = () => {
    this.updateFields();
  };

  private updateFields = () => {
    if (!this.editorActions) {
      return;
    }

    this.editorActions.getValue().then((value) => {
      if (this.adfTextArea) {
        this.adfTextArea.value = JSON.stringify(value, null, 2);
      }
    });
  };
}
