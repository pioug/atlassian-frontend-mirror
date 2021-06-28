import React from 'react';
import { create, ReactTestRenderer } from 'react-test-renderer';
import { Editor, EditorContent, EditorProps } from '../../Editor';
import { basePlugin } from '../../../../plugins';

export const TestEditor = (props: EditorProps) => (
  <Editor plugins={[basePlugin()]} {...props}>
    <EditorContent />
  </Editor>
);

export const createEditorFactory = () => {
  let testRenderer: ReactTestRenderer;

  afterEach(() => {
    if (testRenderer) {
      testRenderer.unmount();
    }
  });

  return ({
    props = {},
    createNodeMock,
  }: {
    props?: EditorProps;
    createNodeMock?: (element: any) => any;
  }) => {
    if (testRenderer) {
      testRenderer.unmount();
    }

    testRenderer = create(<TestEditor {...props} />, {
      createNodeMock:
        createNodeMock ||
        ((element) => document.createElement(element.type as any)),
    });

    return testRenderer;
  };
};
