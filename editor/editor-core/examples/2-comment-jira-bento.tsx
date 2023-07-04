import React from 'react';
import { IntlProvider } from 'react-intl-next';
import Button from '@atlaskit/button/standard-button';
import Form, { Field, FormFooter } from '@atlaskit/form';

import Textfield from '@atlaskit/textfield';

import { Editor, EditorProps } from './../src';
import EditorContext from './../src/ui/EditorContext';
import WithEditorActions from './../src/ui/WithEditorActions';
import CollapsedEditor from '../src/ui/CollapsedEditor';
import ToolbarHelp from '../src/ui/ToolbarHelp';
import {
  currentUser,
  getEmojiProvider,
} from '@atlaskit/util-data-test/get-emoji-provider';
import { mentionResourceProvider } from '@atlaskit/util-data-test/mention-story-data';
import { mediaProvider } from './5-full-page';
import { MockActivityResource } from '../example-helpers/activity-provider';

export type Props = {
  editorProps?: EditorProps;
  replacementDoc?: any;
};

export type State = {
  isExpanded?: boolean;
  defaultValue?: Node | string | Object;
  assistiveLabel?: string;
};

export class CommentEditorJiraBento extends React.Component<Props, State> {
  state = {
    isExpanded: false,
    defaultValue: '',
    assistiveLabel: 'Default: ',
  };

  private providers = {
    emojiProvider: getEmojiProvider({
      uploadSupported: true,
      currentUser,
    }),
    mentionProvider: Promise.resolve(mentionResourceProvider),
    activityProvider: Promise.resolve(new MockActivityResource()),
  };

  onChange = (actions: any) => () => {
    actions.getValue().then((value: any) => {
      this.setState({ defaultValue: value });
    });
  };

  onFocus = () =>
    this.setState((prevState) => ({ isExpanded: !prevState.isExpanded }));

  onAssitiveLabelInputChange = (assistiveLabel: string) => {
    this.setState({ assistiveLabel });
  };

  render() {
    return (
      <IntlProvider locale="en">
        <div>
          <Form
            onSubmit={({ assistiveLabel }: { assistiveLabel: string }) =>
              this.onAssitiveLabelInputChange(assistiveLabel)
            }
          >
            {({ formProps }: any) => (
              <form
                {...formProps}
                style={{
                  display: 'flex',
                  padding: '5px',
                  alignItems: 'center',
                }}
              >
                <Field label="Assistive Label" name="assistiveLabel">
                  {({ fieldProps }: any) => (
                    <Textfield
                      placeholder="Enter assistiveLabel"
                      {...fieldProps}
                    />
                  )}
                </Field>
                <FormFooter>
                  <Button type="submit" appearance="primary">
                    Save
                  </Button>
                </FormFooter>
              </form>
            )}
          </Form>
        </div>
        <EditorContext>
          <WithEditorActions
            render={(actions) => (
              <CollapsedEditor
                isExpanded={this.state.isExpanded}
                onFocus={this.onFocus}
                placeholder="Add a comment..."
              >
                <Editor
                  appearance="comment"
                  defaultValue={this.state.defaultValue}
                  shouldFocus={true}
                  disabled={false}
                  onCancel={() => this.setState({ isExpanded: false })}
                  onChange={this.onChange(actions)}
                  onSave={() => this.setState({ isExpanded: false })}
                  {...this.providers}
                  media={{
                    provider: mediaProvider,
                    allowMediaSingle: true,
                  }}
                  allowRule={true}
                  allowTextColor={true}
                  allowTables={{
                    allowControls: true,
                  }}
                  allowPanel={true}
                  allowHelpDialog={true}
                  placeholder="We support markdown! Try **bold**, `inline code`, or ``` for code blocks."
                  primaryToolbarComponents={[
                    <ToolbarHelp titlePosition="top" title="Help" key="help" />,
                  ]}
                  useStickyToolbar={true}
                  assistiveLabel={this.state.assistiveLabel}
                />
              </CollapsedEditor>
            )}
          />
        </EditorContext>
      </IntlProvider>
    );
  }
}

export default function CommentExample(props?: Props) {
  return <CommentEditorJiraBento {...props} />;
}
