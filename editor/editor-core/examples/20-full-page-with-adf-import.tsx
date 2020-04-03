import React from 'react';
import styled from 'styled-components';
import {
  ExampleEditor as FullPageEditor,
  LOCALSTORAGE_defaultDocKey,
} from './5-full-page';
import EditorContext from '../src/ui/EditorContext';
import { DevTools } from '../example-helpers/DevTools';
import WithEditorActions from '../src/ui/WithEditorActions';
import { EditorActions } from '../src';

export const Textarea = styled.textarea`
  box-sizing: border-box;
  border: 1px solid lightgray;
  font-family: monospace;
  padding: 10px;
  width: 100%;
  height: 250px;
`;

export interface State {
  inputValue?: string;
}

export default class Example extends React.Component<any, State> {
  state: State = {};

  private inputRef?: HTMLTextAreaElement;
  private editorActions?: EditorActions;

  componentDidMount() {
    if (this.inputRef && this.editorActions && window.parent) {
      const query = window.parent.location.search;
      if (~query.indexOf('adf=')) {
        const adf = query
          .substr(1)
          .split('&')
          .filter(str => str.startsWith('adf='))[0]
          .substr(4);
        try {
          const document = JSON.parse(b64DecodeUnicode(adf));
          this.editorActions.replaceDocument(document);
        } catch (e) {
          console.warn(
            "Unable to apply malformed encoded ADF from query string\nIt's possible the url was too long for the browser",
          );
        }
      }
    }
  }

  render() {
    return (
      <EditorContext>
        <div style={{ height: '100%' }}>
          <DevTools />
          <Textarea
            id="adf-input"
            className="adf-input"
            innerRef={this.handleRef}
            value={this.state.inputValue}
            onChange={this.handleInputChange}
          />
          <WithEditorActions
            render={actions => {
              this.editorActions = actions;
              return (
                <React.Fragment>
                  <button
                    id="import-adf"
                    className="import-adf"
                    onClick={() => this.handleImport(actions)}
                  >
                    Import ADF
                  </button>
                  <button
                    id="export-adf"
                    className="export-adf"
                    onClick={() => this.handleExport(actions)}
                  >
                    Export ADF
                  </button>
                  <button
                    id="save-adf"
                    className="save-adf"
                    onClick={() => this.handleDefault()}
                  >
                    Save ADF as default
                  </button>
                  <button
                    id="query-adf"
                    className="query-adf"
                    onClick={() => this.hanldeQueryExport(actions)}
                  >
                    Convert ADF to Query String
                  </button>
                  <FullPageEditor />
                </React.Fragment>
              );
            }}
          />
        </div>
      </EditorContext>
    );
  }

  private handleRef = (ref: HTMLTextAreaElement | null) => {
    if (ref) {
      this.inputRef = ref;
    }
  };

  private handleInputChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    this.setState({ inputValue: event.target.value });
  };

  private handleImport = (actions: EditorActions) => {
    if (this.inputRef) {
      const document = JSON.parse(this.inputRef.value || '{}');
      actions.replaceDocument(document);
    }
  };

  private handleExport = (actions: EditorActions) => {
    actions.getValue().then(value => {
      this.setState({ inputValue: JSON.stringify(value, null, 2) });
    });
  };

  private hanldeQueryExport = (actions: EditorActions) => {
    actions.getValue().then(value => {
      const adfString = b64EncodeUnicode(JSON.stringify(value));
      const { origin, pathname, search } = window.parent.location;
      let query = search ? search.substr(1) + '&' : '';
      if (~query.indexOf('adf=')) {
        query = query
          .split('&')
          .filter(s => !s.startsWith('adf='))
          .join('&');
      }
      let url = `${origin + pathname}?${query}adf=${adfString}`;
      if (url.length > 2000) {
        url = `Warning:
        The generated url is ${url.length} characters which exceeds the 2000 character limit for safe urls. It _may_ not work in all browsers.
        Reduce the complexity of the document to reduce the url length if you're having problems.

${url}`;
      }
      this.setState({ inputValue: url });
    });
  };

  private handleDefault = () => {
    localStorage.setItem(
      LOCALSTORAGE_defaultDocKey,
      this.state.inputValue || '{}',
    );
  };
}

function b64EncodeUnicode(str: string) {
  // First we use encodeURIComponent to get percent-encoded UTF-8,
  // then we convert the percent encodings into raw bytes which can be fed into btoa.
  return btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function toSolidBytes(
      _match,
      p1,
    ) {
      return String.fromCharCode(Number.parseInt('0x' + p1));
    }),
  );
}

function b64DecodeUnicode(str: string) {
  // Going backwards: from bytestream, to percent-encoding, to original string.
  return decodeURIComponent(
    atob(str)
      .split('')
      .map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join(''),
  );
}
