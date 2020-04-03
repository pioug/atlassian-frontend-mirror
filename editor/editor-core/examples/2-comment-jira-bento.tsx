import React from 'react';
import Editor, { EditorProps } from './../src/editor';
import EditorContext from './../src/ui/EditorContext';
import WithEditorActions from './../src/ui/WithEditorActions';
import CollapsedEditor from '../src/ui/CollapsedEditor';
import ToolbarHelp from '../src/ui/ToolbarHelp';
import { mention, emoji } from '@atlaskit/util-data-test';
import { EmojiProvider } from '@atlaskit/emoji';
import { mediaProvider } from './5-full-page';
import { MockActivityResource } from '@atlaskit/activity/dist/es5/support';

export type Props = {
  editorProps?: EditorProps;
  replacementDoc?: any;
};

export type State = {
  isExpanded?: boolean;
  defaultValue?: Node | string | Object;
};

export class CommentEditorJiraBento extends React.Component<Props, State> {
  state = {
    isExpanded: false,
    defaultValue: '',
  };

  private providers = {
    emojiProvider: emoji.storyData.getEmojiResource({
      uploadSupported: true,
      currentUser: {
        id: emoji.storyData.loggedUser,
      },
    }) as Promise<EmojiProvider>,
    mentionProvider: Promise.resolve(mention.storyData.resourceProvider),
    activityProvider: Promise.resolve(new MockActivityResource()),
  };

  onChange = (actions: any) => () => {
    actions.getValue().then((value: any) => {
      this.setState({ defaultValue: value });
    });
  };

  onFocus = () =>
    this.setState(prevState => ({ isExpanded: !prevState.isExpanded }));

  render() {
    return (
      <EditorContext>
        <WithEditorActions
          render={actions => (
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
                onCancel={() => null}
                onChange={this.onChange(actions)}
                onSave={() => null}
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
                  <ToolbarHelp titlePosition="top" title="Help" />,
                ]}
              />
            </CollapsedEditor>
          )}
        />
      </EditorContext>
    );
  }
}

export default function CommentExample(props?: Props) {
  return <CommentEditorJiraBento {...props} />;
}
