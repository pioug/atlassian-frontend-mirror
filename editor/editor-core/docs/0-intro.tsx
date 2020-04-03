import React from 'react';
import {
  md,
  code,
  Example,
  Props,
  AtlassianInternalWarning,
} from '@atlaskit/docs';

export default md`
${(<AtlassianInternalWarning />)}

  ### Note:

  Don't forget to add these polyfills to your product build if you're using emoji or mentions in the editor and you want to target older browsers:

  * Promise ([polyfill](https://www.npmjs.com/package/es6-promise), [browser support](http://caniuse.com/#feat=promises))
  * Fetch API ([polyfill](https://www.npmjs.com/package/whatwg-fetch), [browser support](http://caniuse.com/#feat=fetch))
  * Element.closest ([polyfill](https://www.npmjs.com/package/element-closest), [browser support](http://caniuse.com/#feat=element-closest))

  # Starting to use the editor

  ## Simplest Editor

  The simplest editor in the world is just:

${code`
  import { Editor } from '@atlaskit/editor-core';

  <Editor appearance="comment" />;
`}

  This will render the comment editor with only text formatting (bold / italics / underline / superscript/subscript) enabled.

  You can enable more functionality in the editor via passing extra props.

  ## Editor with mentions

  To add mention capabilities to the editor, you will need to pass in a "Mention Provider". At a high level, this is simply an object that will allow us to interface whatever mention source you want to use with the editor. This looks like:

${code`
  import { Editor } from '@atlaskit/editor-core';
  import mentionProvider from './mentionProvider';

  <Editor
    appearance="comment"
    mentionProvider={mentionProvider.get()}
  />;
`}

  ## Collapsed Editor

  Sometimes we don't want to show the whole editor at the start and instead show a collapsed state for a user to click on to start typing. This looks like:

${code`
  import { Editor, CollapsedEditor } from '@atlaskit/editor-core';

  class CollapsibleEditor extends React.Component {
    state = { isExpanded: false };

    expandEditor = () => this.setState({ isExpanded: true });
    collapseEditor = () => this.setState({ isExpanded: false });

    onSave = () => {
      /* do something */
    };

    render() {
      return (
        <CollapsedEditor
          placeholder="What would you like to say?"
          isExpanded={this.state.isExpanded}
          onFocus={this.expandEditor}
        >
          <Editor
            appearance="comment"
            onSave={this.onSave}
            onCancel={this.collapseEditor}
          />
        </CollapsedEditor>
      );
    }
  }
`}

  ## What is EditorContext?!?!

  EditorContext allows you, in conjunction with WithEditorActions, to manipulate the editor from anywhere inside the EditorContext. In the example below, notice that no reference is kept to the editor instance.

${code`
  import { EditorContext, WithEditorActions } from '@atlaskit/editor-core';
  import { CollapsibleEditor } from 'previous-example';

  <EditorContext>
    <div>
      <CollapsibleEditor />
      <WithEditorActions
        render={actions => (
          <ButtonGroup>
            <Button onClick={() => actions.clear()}>Clear Editor</Button>
            <Button onClick={() => actions.focus()}>Focus Editor</Button>
          </ButtonGroup>
        )}
      />
    </div>
  </EditorContext>;
`}

  ## How can I set the content of the editor?

  There's two ways at the moment. It depends on whether the editor is mounted yet or not.

  ### If the editor is not mounted

  You can just pass through the value you want to set the editor to, as the \`defaultValue\` prop

  ### If the Editor is Mounted

  You can use \`WithEditorActions\` and \`actions.replaceDocument(documentValueHere)\` together

  ## Using a non-'Atlassian Document Format' storage format

  Using a custom storage format is fairly straightforward - you simply have to import the relevant transformer and pass it through to the editor. That's all!

${code`
  import { Editor, BitbucketTransformer } from '@atlaskit/editor-core';

  <Editor
    appearance="comment"
    contentTransformerProvider={schema => new BitbucketTransformer(schema)}
  />;
`}

  ## Example saving content

  If you want an example of actually using \`WithEditorActions\` to save content, you've got it!

${code`
  class SaveExample extends React.Component {
    onSubmit = actions => editorView => {
      actions.getValue().then(value => {
        if (value != null) {
          dispatch({ type: 'SAVE_COMMENT', payload: value });
        }
      })
    }

    render() {
      return (
        <EditorContext>
          <WithEditorActions
            render={actions => (
              <Editor
                appearance="comment"
                onSave={this.onSubmit(actions)}
              />
            )}
          />
        </EditorContext>
      )
    }
`}

  alternatively

${code`
  class EditorWrapper extends React.Component {
    propTypes = { actions: PropTypes.object };

    onSubmit = () => {
      this.props.actions.getValue().then(value => {
        if (value != null) {
          dispatch({ type: 'SAVE_COMMENT', payload: value });
        }
      });
    };

    render() {
      return (
        <Editor
          appearance="comment"
          onSave={this.onSubmit}
        />
      );
    }
  }

  class SaveExample extends React.Component {
    render() {
      return (
        <EditorContext>
          <WithEditorActions
            render={actions => <EditorWrapper actions={actions} />}
          />
        </EditorContext>
      );
    }
  }
`}

  We’d love to hear your feedback.

  ## Tab indexing / focus
  If you are displaying a title you may need to listen for a tab event to 
  explicitly enable and focus the editor.
  
  Shift + Tab will move from the title bar to the toolbar preserving tab order.

  See the Full Page Example code for a complete implementation.
  
  For example:

${code`
  <WithEditorActions
     
    render={actions => (
      <TitleInput
        placeholder="Give this page a title..."
        onKeyDown={(e: KeyboardEvent) =>
          this.onKeyPressed(e, actions)
        }
      />
    )}
  />
`}

${code`
  private onKeyPressed = (e: KeyboardEvent, actions: EditorActions) => {
    if (e.key === 'Tab' && !e.shiftKey) {
      actions.focus();
      return false;
    }
  };
`}

${(
  <Example
    packageName="@atlaskit/editor-core"
    Component={require('../examples/1-basic').default}
    title="Basic"
    source={require('!!raw-loader!../examples/1-basic')}
  />
)}

  ${(
    <Props
      shouldCollapseProps
      heading="Props"
      props={require('!!extract-react-types-loader!../src/editor')}
    />
  )}
`;
