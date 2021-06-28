import React from 'react';
import { EditorView } from 'prosemirror-view';
import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/standard-button';
import { JSONTransformer } from '@atlaskit/editor-json-transformer';
import WithEditorActions from './../src/ui/WithEditorActions';
import {
  default as FullPageExample,
  LOCALSTORAGE_defaultDocKey,
  LOCALSTORAGE_defaultTitleKey,
} from './5-full-page';
import { EditorActions } from '../src';

export const SaveAndCancelButtons = (props: {
  editorActions: EditorActions;
}) => (
  <ButtonGroup>
    <Button
      tabIndex={-1}
      appearance="primary"
      onClick={() => {
        location.href = location.href.replace('editor-core', 'renderer');
      }}
    >
      Publish
    </Button>
    <Button
      tabIndex={-1}
      appearance="subtle"
      onClick={() => {
        props.editorActions.clear();
        localStorage.removeItem(LOCALSTORAGE_defaultDocKey);
      }}
    >
      Close
    </Button>
  </ButtonGroup>
);

export type Props = {};

export default class ExampleEditor extends React.Component<Props> {
  transformer = new JSONTransformer();

  constructor(props: Props) {
    super(props);

    // opens an iframe
    if (window.top !== window.self) {
      window.top.location.replace(location.href);
    }
  }

  render() {
    return FullPageExample({
      onChange: this.handleOnChange,
      primaryToolbarComponents: (
        <WithEditorActions
          render={(actions) => <SaveAndCancelButtons editorActions={actions} />}
        />
      ),
      onTitleChange: this.handleTitleChange,
    });
  }

  private handleOnChange = (editorView: EditorView) => {
    const value = JSON.stringify(
      this.transformer.encode(editorView.state.doc),
      null,
      2,
    );
    localStorage.setItem(LOCALSTORAGE_defaultDocKey, value);
  };

  private handleTitleChange = (title: string) => {
    localStorage.setItem(LOCALSTORAGE_defaultTitleKey, title);
  };
}
