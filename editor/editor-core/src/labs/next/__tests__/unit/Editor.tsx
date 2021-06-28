import React from 'react';
import { act, ReactTestRenderer } from 'react-test-renderer';
import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';
import { createEditorFactory, TestEditor } from './__create-editor-helper';
import EditorActions from '../../../../actions';

describe('next/Editor', () => {
  const createEditor = createEditorFactory();

  it('should fire onChange when text is inserted', async () => {
    const handleChange = jest.fn();
    createEditor({
      props: {
        onMount(actions) {
          actions.appendText('hello');
        },
        onChange: handleChange,
      },
    });

    expect(handleChange).toHaveBeenCalled();
  });

  it('should use transformer for processing onChange', async () => {
    const handleChange = jest.fn();
    createEditor({
      props: {
        onMount(actions) {
          actions.appendText('hello');
        },
        onChange: handleChange,
        transformer: (schema) => ({
          encode: () => 'encoded document',
          parse: () => doc(p(''))(schema),
        }),
      },
    });

    expect(handleChange).toHaveBeenCalledWith('encoded document', {
      source: 'local',
    });
  });

  it("shouldn't call 'onMount' twice when re-rendering editor with the same 'onMount' handler", () => {
    const onMount = jest.fn();
    let testRenderer: ReactTestRenderer;

    act(() => {
      testRenderer = createEditor({
        props: { onMount },
      });
    });

    act(() => {
      testRenderer.update(<TestEditor onMount={onMount} />);
    });

    expect(onMount).toHaveBeenCalledTimes(1);
  });

  it('should propagate `disabled` prop change', () => {
    let testRenderer: ReactTestRenderer;
    let actions: EditorActions;
    let onMount = (editorActions: EditorActions) => {
      actions = editorActions;
    };

    act(() => {
      testRenderer = createEditor({
        props: { disabled: false, onMount },
      });
    });
    expect(actions!._privateGetEditorView()!.editable).toBe(true);

    act(() => {
      testRenderer.update(<TestEditor onMount={onMount} disabled={true} />);
    });
    expect(actions!._privateGetEditorView()!.editable).toBe(false);
  });
});
