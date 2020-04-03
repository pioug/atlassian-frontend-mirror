import { md, code } from '@atlaskit/docs';

export default md`
  # Editor Labs

  Where API changes can sit for experimental use

  ## CollapsedEditor (with async support)

  To improve the initial page-weight of pages that *only* show a collapsed editor, we've proposed a new API for CollapsedEditor which will allow us to code-split it behind the scenes. See [the discussion page](https://product-fabric.atlassian.net/wiki/spaces/E/pages/560890834/How+should+we+support+async+loading+of+the+Collapsed+Editor) for more details.

  The new code will look like:

${code`
import { CollapsedEditor } from '@atlaskit/editor-core';
import { ConfluenceTransformer } from '@atlaskit/editor-confluence-transformer';

class ExampleEditorIntegration extends React.Component {
  renderEditorAsync = (Editor, module) => (
    <Editor
      appearance="comment"
      onSave={this.onSave}
      onCancel={this.collapseEditor}
	    contentTransformerProvider={schema => new ConfluenceTransformer(schema)}
    />
  )

  render() {
    return (
      <CollapsedEditor
        placeholder="What would you like to say?"
        isExpanded={this.state.isExpanded}
        onFocus={this.expandEditor}
        /** this render-prop will callback with the async-required modules */
        renderEditor={this.renderEditorAsync}
      />
    );
  }
}
`}

  The \`renderEditor\` prop will code-split the rest of @atlaskit/editor-core behind the scenes, allowing products to consume the least amount of JS to load the initial page as possible.

  To get most of these benefits, the products will need to:
   * support tree-shaking in their source
   * support dynamic imports & ensure that @atlaskit-internal-* chunks don't get merged into other chunks.

  ## EditorWithActions

  Based off feedback from our consumers, the existing approach of passing the EditorView as the argument to the onSave / onCancel / onChange callback functions unnecessarily leaks the abstraction over Prosemirror that the editor is supposed to provide.

  This change introduces a breaking API change that passes the EditorActions object as the argument instead.

${code`
  import { EditorWithActions } from '@atlaskit/editor-core';

  handleSave = actions => {
    actions.getValue().then(value => console.log(value));
  };

  render(<Editor onSave={this.handleSave} />);
`}

  This replaces code that looked like:

${code`
  import {
    Editor,
    WithEditorActions,
    EditorContext,
  } from '@atlaskit/editor-core';

  handleSave = actions => () => {
    actions.getValue().then(value => console.log(value));
  };

  render(
    <EditorContext>
      <WithEditorActions
        render={actions => <Editor onSave={this.handleSave(actions)} />}
      />
    </EditorContext>,
  );
`}

  or

${code`
  import { Editor, WithEditorActions, EditorContext } from '@atlaskit/editor-core';

  class ExtendedEditor extends React.Component {
    handleSave = () => {
      this.props.actions.getValue().then(value => console.log(value));
    }

    render() {
      const { actions, ...props } = this.props;
      return <Editor {...props} onSave={this.handleSave} />;
    }
  }

  render(
    <EditorContext>
      <WithEditorActions
        render={actions => <ExtendedEditor {...props} actions={actions} />
      />
    </EditorContext>
  )
`}
`;
