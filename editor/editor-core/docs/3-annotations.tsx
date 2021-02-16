import React from 'react';
import { EditorView } from 'prosemirror-view';

import { md, code } from '@atlaskit/docs';
import { N20, N30 } from '@atlaskit/theme/colors';

import { Editor } from '../src';

const initialExample = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'For Q1, our main ',
        },
        {
          type: 'text',
          text: 'areas of focus are:',
          marks: [
            {
              type: 'annotation',
              attrs: {
                id: 'b81e1de8-9df7-4210-861d-89e13512ce33',
                annotationType: 'inlineComment',
              },
            },
          ],
        },
      ],
    },
    {
      type: 'bulletList',
      content: [
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Performance',
                  marks: [
                    {
                      type: 'strong',
                    },
                    {
                      type: 'annotation',
                      attrs: {
                        id: '5551fe04-3517-4821-8330-b7c506a43bd5',
                        annotationType: 'inlineComment',
                      },
                    },
                  ],
                },
                {
                  type: 'text',
                  text:
                    ': Instrument key performance metrics and improve typing speed in the editor.',
                  marks: [
                    {
                      type: 'annotation',
                      attrs: {
                        id: '5551fe04-3517-4821-8330-b7c506a43bd5',
                        annotationType: 'inlineComment',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Insertion & nesting logic:',
                  marks: [
                    {
                      type: 'strong',
                    },
                  ],
                },
                {
                  type: 'text',
                  text:
                    ' Remove invisible barriers by enabling more content to be placed ',
                },
                {
                  type: 'text',
                  text: 'inside each other.',
                  marks: [
                    {
                      type: 'annotation',
                      attrs: {
                        id: '42497172-2e64-4aa6-b8b1-5a37270ee1f9',
                        annotationType: 'inlineComment',
                      },
                    },
                  ],
                },
                {
                  type: 'text',
                  text: ' E.g. allow users to paste an image inside a panel.',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

const nestedExample = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          marks: [
            {
              type: 'annotation',
              attrs: {
                id: 'c7052cd7-5119-4837-85ce-45ba5207764c',
                annotationType: 'inlineComment',
              },
            },
          ],
          text: 'This is a paragraph with a outer comment ',
        },
        {
          type: 'text',
          marks: [
            {
              type: 'annotation',
              attrs: {
                id: 'a5ee9b09-f302-4fa6-89cb-d5703cb6ccdd',
                annotationType: 'inlineComment',
              },
            },
            {
              type: 'annotation',
              attrs: {
                id: 'c7052cd7-5119-4837-85ce-45ba5207764c',
                annotationType: 'inlineComment',
              },
            },
          ],
          text: 'that also contains a nested comment',
        },
        {
          type: 'text',
          text: ', where the nested comment has two annotation marks applied.',
        },
      ],
    },
  ],
};

const inlineCommentEditor = (
  adf: Object,
  onChange?: (editorView: EditorView) => void,
) => <Editor appearance="chromeless" defaultValue={adf} onChange={onChange} />;

class SplitExample extends React.Component<{ initialAdf: object }> {
  state = {
    adf: this.props.initialAdf,
  };

  onChange = (view: EditorView) => {
    this.setState({ adf: view.state.doc.toJSON() });
  };

  render() {
    const { adf } = this.state;
    return (
      <div
        style={{
          display: 'flex',
          maxHeight: '400px',
        }}
      >
        <div
          style={{
            margin: '8px',
            padding: '8px',
            backgroundColor: N20,
            border: `1px solid ${N30}`,
            flex: 1,
          }}
        >
          {inlineCommentEditor(nestedExample, this.onChange)}
        </div>
        <div
          style={{
            flex: 2,
            overflow: 'auto',
            margin: '8px',
          }}
        >
          <p>Paragraph node's content:</p>
          {code`${JSON.stringify((adf as any).content[0].content, null, 2)}`}
        </div>
      </div>
    );
  }
}

export default md`
# Annotations

## Introduction

Annotations allow you to apply, well, annotations around sections of text.

Currently, there is only the \`inlineComment\` type of annotation. In the future, other kinds of annotations like *reactions*, might be added.

### Inline comments

These denote a comment thread about the given text, and are denoted by a yellow highlight. This is commonly seen within Confluence after selecting some text in View mode.

${(
  <div
    style={{
      margin: '8px',
      padding: '8px',
      backgroundColor: N20,
      border: `1px solid ${N30}`,
    }}
  >
    {inlineCommentEditor(initialExample)}
  </div>
)}

### Example ADF

An annotation is defined in ADF like so;

${code`
{
  "type": "text",
  "text": "areas of focus are:",
  "marks": [
    {
      "type": "annotation",
      "attrs": {
        "id": "b81e1de8-9df7-4210-861d-89e13512ce33",
        "annotationType": "inlineComment"
      }
    }
  ]
}`}

## Using annotations

You can do this with the \`annotationProvider\` prop on the \`<Editor />\` component. Passing a truthy value to this (e.g. the empty object \`{}\`) will:

* enable support for working with the \`annotation\` ADF mark
* will render highlights around any annotations, and
* allow copying and pasting of annotations within the same document, or between documents

## Displaying and creating annotations

You can also optionally pass a React component to the \`component\`, so you can render custom components on top of or around the editor when the user's text cursor is inside an annotation.

An annotation mark only describes an \`id\` and a \`type\`, so your component will probably want to fetch a remote resource based on these IDs and display the relevant information.

### Example

The full page examples in the storybook use the \`ExampleInlineCommentComponent\` within the \`@atlaskit/editor-test-helpers\` package, like so:

${code`
import { Editor } from '@atlaskit/editor-core';
import { ExampleInlineCommentComponent } from '@atlaskit/editor-test-helpers/example-inline-component';

class MyEditor extends React.Component {
  render() {
    return <Editor
            // ... other providers and props here
            annotationProvider={{
              component: ExampleInlineCommentComponent,
            }}
          />;
  }
}`}

### API and usage

The interface looks like:

${code`export type AnnotationInfo = {
  id: string;
  type: AnnotationType;
};

export type AnnotationComponentProps = {
  /**
   * Existing annotations where the cursor is placed.
   * These are provided in order, inner-most first.
   */
  annotations: Array<AnnotationInfo>;

  /**
   * Selected text (can be used when creating a comment)
   */
  textSelection?: string;

  /**
   * DOM element around selected text (for positioning)
   */
  dom?: HTMLElement;

  /**
   * Deletes an annotation with the given ID around the selection.
   */
  onDelete: (id: string) => void;
};`}

The Editor will render your component with the above props, given the lifecycle described below.

### Multiple annotations

Note that the \`annotations\` prop provides an array. This is because text can have multiple annotation marks.

This array is *ordered* so that the inner-most appears first. If you always want to display the outer one, for instance, just reverse the order. Here's an example of a document with multiple annotations. They are rendered slightly transparent.


${(<SplitExample initialAdf={nestedExample} />)}

### Annotation types

You are also provided the type of the annotation. You can use this to filter only to specific annotation types if you so choose.

You could also mix and match to render a combined component that applies multiple types of annotations at once (e.g. a combined inline comments + reaction annotation component).

If you just want to render the first annotation of a single type, you can do something like:

${code`
// only find inline comments
const comments = annotations.filter(
  annotation => annotation.type === 'inlineComment',
);
`}

to filter, and then just take the first one if the array contains any items.

Currently, only the \`inlineComment\` annotation type is valid ADF.

### Lifecycle

The component is mounted when entering a region of text containing an annotation.

It can be re-rendered if remaining in a region with annotations, possibly with different annotations or selections passed as props.

It is unmounted when exiting a region of text with an annotation.


## Resources

* [ADF change proposal](https://product-fabric.atlassian.net/wiki/spaces/E/pages/853377081/ADF+Change+38+Annotation+mark)
`;
