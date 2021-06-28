import React from 'react';
import prettier from 'prettier/standalone';
import parser from 'prettier/parser-babel';

import TextArea from '@atlaskit/textarea';
import { defaultSchema as schema } from '@atlaskit/adf-schema';

import EditorContext from '../src/ui/EditorContext';
import { DevTools } from '../example-helpers/DevTools';
import { evaluateDocBuilderExpression } from '../example-helpers/evaluate-doc-builder-expression';
import WithEditorActions from '../src/ui/WithEditorActions';
import { EditorActions } from '../src';
import { ExampleEditor as FullPageEditor } from './5-full-page';

interface DocBuilderState {
  adfValid: boolean;
  docBuilderValid: boolean;
}

type NodeMapping = {
  name: string | ((node: any) => string);
  attrs?: Array<string>;
};

const nodeTypes: Record<string, NodeMapping> = {
  doc: { name: 'doc' },
  paragraph: { name: 'p' },
  blockquote: { name: 'blockquote' },
  heading: { name: (node) => `h${node.attrs.level}` },
  listItem: { name: 'li' },
  bulletList: { name: 'ul' },
  orderedList: { name: 'ol' },
  hardBreak: { name: 'hardBreak' },
  rule: { name: 'hr' },
  panel: { name: 'panel', attrs: ['panelType'] },
  codeBlock: { name: 'code_block', attrs: ['language'] },
  emoji: { name: 'emoji', attrs: ['shortName', 'id', 'fallback', 'text'] },
  expand: { name: 'expand', attrs: ['title'] },
  nestedExpand: { name: 'nestedExpand', attrs: ['title'] },
  mention: {
    name: 'mention',
    attrs: ['id', 'text', 'userType', 'accessLevel'],
  },
  table: { name: 'table', attrs: ['isNumberColumnEnabled', 'layout'] },
  tableRow: { name: 'tr' },
  tableCell: {
    name: 'td',
    attrs: ['colspan', 'rowspan', 'colwidth', 'background'],
  },
  tableHeader: {
    name: 'th',
    attrs: ['colspan', 'rowspan', 'colwidth', 'background'],
  },

  decisionList: { name: 'decisionList', attrs: ['localId'] },
  decisionItem: { name: 'decisionItem', attrs: ['localId'] },
  taskList: { name: 'taskList', attrs: ['localId'] },
  taskItem: { name: 'taskItem', attrs: ['localId'] },

  confluenceJiraIssue: {
    name: 'confluenceJiraIssue',
    attrs: ['issueKey', 'macroId', 'schemaVersion', 'server', 'serverId'],
  },
  inlineExtension: {
    name: 'inlineExtension',
    attrs: ['extensionKey', 'extensionType', 'parameters', 'text'],
  },
  extension: {
    name: 'extension',
    attrs: ['extensionKey', 'extensionType', 'parameters', 'text', 'layout'],
  },
  bodiedExtension: {
    name: 'bodiedExtension',
    attrs: ['extensionKey', 'extensionType', 'parameters', 'text', 'layout'],
  },

  date: { name: 'date', attrs: ['timestamp'] },
  status: { name: 'status', attrs: ['text', 'color', 'localId'] },
  mediaSingle: { name: 'mediaSingle', attrs: ['layout', 'width'] },
  mediaGroup: { name: 'mediaGroup' },
  media: {
    name: 'media',
    attrs: [
      'type',
      'id',
      'collection',
      'height',
      'width',
      'occurrenceKey',
      'url',
    ],
  },
  applicationCard: {
    name: 'applicationCard',
    attrs: [
      'actions',
      'background',
      'collapsible',
      'context',
      'description',
      'details',
      'link',
      'preview',
      'text',
      'textUrl',
      'title',
      'url',
    ],
  },
  placeholder: { name: 'placeholder', attrs: ['text'] },
  layoutSection: { name: 'layoutSection' },
  layoutColumn: { name: 'layoutColumn', attrs: ['width'] },
  inlineCard: { name: 'inlineCard', attrs: ['url', 'data'] },
  blockCard: { name: 'blockCard', attrs: ['url', 'data'] },

  // TODO: The attributes of unsupported content is type `any`
  // unsupportedInline: { name: 'unsupportedInline', attrs: [''] },
  // unsupportedBlock: { name: 'unsupportedBlock', attrs: [''] },

  //
  // Marks
  //
  em: { name: 'em' },
  subsup: { name: 'subsup', attrs: ['type'] },
  underline: { name: 'underline' },
  strong: { name: 'strong' },
  code: { name: 'code' },
  strike: { name: 'strike' },
  a: {
    name: 'a',
    attrs: [
      'href',
      'title',
      'id',
      'collection',
      'occurrenceKey',
      '__confluenceMetadata',
    ],
  },
  emojiQuery: { name: 'emojiQuery' },
  textColor: { name: 'textColor', attrs: ['color'] },
  confluenceInlineComment: {
    name: 'confluenceInlineComment',
    attrs: ['reference'],
  },

  //
  // Block Marks
  //
  alignment: { name: 'alignment', attrs: ['align'] },
  breakout: { name: 'breakout', attrs: ['mode'] },
  indentation: { name: 'indentation', attrs: ['level'] },
  dataConsumer: { name: 'dataConsumer', attrs: ['sources'] },
};
nodeTypes.link = nodeTypes.a;

const buildMarks = (marks: Array<any>, leaf: string): string | undefined => {
  const mark = marks.pop();
  if (!mark) {
    return leaf;
  }

  const type = nodeTypes[mark.type];
  if (!type) {
    throw new TypeError('No builder for mark type ' + mark.type);
  }

  const name = typeof type.name === 'function' ? type.name(mark) : type.name;

  const children = buildMarks(marks, leaf);
  if (type.attrs) {
    const attrs = type.attrs.reduce<Record<string, any>>((acc, attrName) => {
      acc[attrName] = mark.attrs[attrName];
      return acc;
    }, {});

    const stringAttrs =
      Object.keys(attrs).length === 0 ? '' : JSON.stringify(attrs);
    return `${name}(${stringAttrs})(${children || leaf})`;
  }

  return `${name}(${children || leaf})`;
};

const nodeToDocBuilder = (node: any): string => {
  if (node.type === 'text') {
    const leaf = `'${node.text.replace(/'/g, `\\'`)}'`;
    if (node.marks) {
      const marks = node.marks.slice();
      return buildMarks(marks, leaf) || leaf;
    }

    return leaf;
  }

  const type = nodeTypes[node.type];
  if (!type) {
    throw new TypeError('No builder for node type ' + node.type);
  }

  const childrenBuilders: string[] = [];
  if (node.content) {
    node.content.forEach((child: any) => {
      childrenBuilders.push(nodeToDocBuilder(child));
    });
  }

  const name = typeof type.name === 'function' ? type.name(node) : type.name;

  let leaf = `${name}(${childrenBuilders.join(', ')})`;
  if (type.attrs) {
    const attrs = type.attrs.reduce<Record<string, any>>((acc, attrName) => {
      acc[attrName] = node.attrs[attrName];
      return acc;
    }, {});

    const stringAttrs =
      Object.keys(attrs).length === 0 ? '' : JSON.stringify(attrs);
    leaf = `${name}(${stringAttrs})(${childrenBuilders.join(', ')})`;
  }

  if (node.marks) {
    const marks = node.marks.slice();
    return buildMarks(marks, leaf) || leaf;
  }

  return leaf;
};

const toDocBuilder = (adf: any) => {
  return prettier.format(nodeToDocBuilder(adf), {
    parser: 'babel',
    plugins: [parser],
  });
};

export default class Example extends React.Component<any, DocBuilderState> {
  private editorActions?: EditorActions;
  private adfTextArea?: HTMLTextAreaElement;
  private docBuilderTextArea?: HTMLTextAreaElement;

  constructor(props: {}) {
    super(props);

    this.state = {
      adfValid: true,
      docBuilderValid: true,
    };
  }

  render() {
    return (
      <EditorContext>
        <div
          style={{
            display: 'grid',
            padding: '10px',
            gridTemplateColumns: '1fr 1fr 1fr',
            gridTemplateRows: '1fr 1fr',
            gridGap: '6px 6px',
          }}
        >
          <DevTools />
          <div style={{ gridArea: '1 / 1 / 3 / 3' }}>
            <WithEditorActions
              render={(actions) => {
                this.editorActions = actions;
                return (
                  <FullPageEditor onChange={(e) => this.handleEditorChange()} />
                );
              }}
            />
          </div>
          <div style={{ gridArea: '1 / 3 / 2 / 4' }}>
            <h2>ADF</h2>
            <TextArea
              onChange={(e) => this.handleAdfChange(e.target.value)}
              isInvalid={!this.state.adfValid}
              ref={(ref: any) => (this.adfTextArea = ref)}
              placeholder='{"version": 1...'
              isMonospaced={true}
              minimumRows={20}
            />
          </div>
          <div style={{ gridArea: '2 / 3 / 3 / 4' }}>
            <h2>Doc Builder</h2>
            <TextArea
              onChange={(e) => this.handleDocBuilderChange(e.target.value)}
              isInvalid={!this.state.docBuilderValid}
              ref={(ref: any) => (this.docBuilderTextArea = ref)}
              placeholder="doc(..."
              isMonospaced={true}
              minimumRows={20}
            />
          </div>
        </div>
      </EditorContext>
    );
  }

  private handleDocBuilderChange = (value: string) => {
    const buildDoc = evaluateDocBuilderExpression(value);
    const docBuilderValid = !(buildDoc instanceof Error);
    this.setState({ docBuilderValid });

    if (buildDoc instanceof Error) {
      console.error(buildDoc);
    } else {
      this.editorActions?.replaceDocument(buildDoc(schema).toJSON());
    }
  };

  private handleAdfChange = (value: string) => {
    try {
      this.editorActions?.replaceDocument(value);
      this.setState({ adfValid: true });
    } catch (error) {
      this.setState({ adfValid: false });
      throw new Error(error);
    }
  };

  private handleEditorChange = () => {
    this.updateFields();
  };

  private updateFields = () => {
    if (!this.editorActions) {
      return;
    }

    const activeElement = document.activeElement;

    this.editorActions.getValue().then((value) => {
      if (this.adfTextArea && activeElement !== this.adfTextArea) {
        this.adfTextArea.value = JSON.stringify(value, null, 2);
      }

      if (
        this.docBuilderTextArea &&
        activeElement !== this.docBuilderTextArea
      ) {
        this.docBuilderTextArea.value = toDocBuilder(value);
      }
    });
  };
}
