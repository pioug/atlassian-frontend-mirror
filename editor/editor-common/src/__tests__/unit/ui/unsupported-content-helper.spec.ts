import { IntlProvider } from 'react-intl';

import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  DocBuilder,
  unsupportedBlock,
} from '@atlaskit/editor-test-helpers/doc-builder';

import { getUnsupportedContent } from '../../../ui/unsupported-content-helper';

describe('getUnsupportedContent', () => {
  const createEditor = createEditorFactory();

  const unsupportedInlineContent = {
    id: 'fabric.editor.unsupportedContent',
    defaultMessage: 'Unsupported content',
    description: 'Unsupported content',
  };

  const editor = (doc: DocBuilder) => {
    return createEditor({
      doc,
    });
  };

  describe('when locale is en', () => {
    it('should return Unsupported content when no node is provided', () => {
      const result = getUnsupportedContent(unsupportedInlineContent, '');

      expect(result).toEqual('Unsupported content');
    });

    it('should return "Unsupported <content type>" when unsupported node has a type', () => {
      const node = doc(
        unsupportedBlock({
          originalValue: {
            attrs: {},

            type: 'FooBarNode',
          },
        })(),
      );
      const { editorView: view } = editor(node);

      const result = getUnsupportedContent(
        unsupportedInlineContent,
        'Unsupported',
        view.state.doc.nodeAt(view.state.selection.$from.pos)!,
      );

      expect(result).toEqual('Unsupported FooBarNode');
    });

    it('should have text content as actual value of text when unsupported node has a text property', () => {
      const node = doc(
        unsupportedBlock({
          originalValue: {
            attrs: {},
            type: 'SomeNode',
            text: 'I am some node',
          },
        })(),
      );
      const { editorView: view } = editor(node);

      const result = getUnsupportedContent(
        unsupportedInlineContent,
        'Unsupported',
        view.state.doc.nodeAt(view.state.selection.$from.pos)!,
      );

      expect(result).toEqual('I am some node');
    });

    it(`should have text content as "Unsupported <content type>" when unsupported node
        has a empty text property and a type`, () => {
      const node = doc(
        unsupportedBlock({
          originalValue: {
            attrs: {},
            type: 'SomeNode',
            text: '',
          },
        })(),
      );
      const { editorView: view } = editor(node);

      const result = getUnsupportedContent(
        unsupportedInlineContent,
        'Unsupported',
        view.state.doc.nodeAt(view.state.selection.$from.pos)!,
      );

      expect(result).toEqual('Unsupported SomeNode');
    });

    it(`should have text content as "Unsupported content" when unsupported node
        has a empty text property and no type`, () => {
      const node = doc(
        unsupportedBlock({
          originalValue: {
            attrs: {},
            text: '',
          },
        })(),
      );
      const { editorView: view } = editor(node);

      const result = getUnsupportedContent(
        unsupportedInlineContent,
        'Unsupported',
        view.state.doc.nodeAt(view.state.selection.$from.pos)!,
      );

      expect(result).toEqual('Unsupported content');
    });

    it(`should have text content as actual value of text when unsupported node
        has an attr as text property`, () => {
      const node = doc(
        unsupportedBlock({
          originalValue: {
            attrs: { text: 'I am some node' },
            type: 'SomeNode',
          },
        })(),
      );
      const { editorView: view } = editor(node);

      const result = getUnsupportedContent(
        unsupportedInlineContent,
        'Unsupported',
        view.state.doc.nodeAt(view.state.selection.$from.pos)!,
      );

      expect(result).toEqual('I am some node');
    });

    it(`should have text content as "Unsupported <content type>" when unsupported node
        has a empty attr text property and a type`, () => {
      const node = doc(
        unsupportedBlock({
          originalValue: {
            attrs: { text: '' },
            type: 'SomeNode',
          },
        })(),
      );
      const { editorView: view } = editor(node);

      const result = getUnsupportedContent(
        unsupportedInlineContent,
        'Unsupported',
        view.state.doc.nodeAt(view.state.selection.$from.pos)!,
      );

      expect(result).toEqual('Unsupported SomeNode');
    });

    it(`should have text content as "Unsupported content" when unsupported node
        has a empty attr text property and no type`, () => {
      const node = doc(
        unsupportedBlock({
          originalValue: {
            attrs: { text: '' },
          },
        })(),
      );
      const { editorView: view } = editor(node);

      const result = getUnsupportedContent(
        unsupportedInlineContent,
        'Unsupported',
        view.state.doc.nodeAt(view.state.selection.$from.pos)!,
      );

      expect(result).toEqual('Unsupported content');
    });

    it(`should have text content as "Unsupported <content type>" when unsupported node
        has a no attr or text property and has a type`, () => {
      const node = doc(
        unsupportedBlock({
          originalValue: {
            type: 'SomeNode',
          },
        })(),
      );
      const { editorView: view } = editor(node);

      const result = getUnsupportedContent(
        unsupportedInlineContent,
        'Unsupported',
        view.state.doc.nodeAt(view.state.selection.$from.pos)!,
      );

      expect(result).toEqual('Unsupported SomeNode');
    });

    it(`should have text content as "Unsupported content" when unsupported node
        has a no attr or text property or type`, () => {
      const node = doc(
        unsupportedBlock({
          originalValue: {
            attrs: { text: '' },
          },
        })(),
      );
      const { editorView: view } = editor(node);

      const result = getUnsupportedContent(
        unsupportedInlineContent,
        'Unsupported',
        view.state.doc.nodeAt(view.state.selection.$from.pos)!,
      );

      expect(result).toEqual('Unsupported content');
    });

    it(`should have text content as actual value of text property when unsupported node
      has a text property and attr as text property`, () => {
      const node = doc(
        unsupportedBlock({
          originalValue: {
            attrs: { text: 'I am some node attr' },
            type: 'SomeNode',
            text: 'I am some node',
          },
        })(),
      );
      const { editorView: view } = editor(node);

      const result = getUnsupportedContent(
        unsupportedInlineContent,
        'Unsupported',
        view.state.doc.nodeAt(view.state.selection.$from.pos)!,
      );

      expect(result).toEqual('I am some node');
    });
  });

  describe('When locale is not en', () => {
    const intlProvider = new IntlProvider({ locale: 'nl-be' });
    const { intl } = intlProvider.getChildContext();

    it('should return default message when locale is not en', () => {
      const result = getUnsupportedContent(
        unsupportedInlineContent,
        '',
        undefined,
        intl,
      );

      expect(result).toEqual('Unsupported content');
    });

    it('should return default message when locale is not en and when unsupported node has a type', () => {
      const node = doc(
        unsupportedBlock({
          originalValue: {
            attrs: {},
            type: 'FooBarNode',
          },
        })(),
      );
      const { editorView: view } = editor(node);

      const result = getUnsupportedContent(
        unsupportedInlineContent,
        'Unsupported',
        view.state.doc.nodeAt(view.state.selection.$from.pos)!,
        intl,
      );

      expect(result).toEqual('Unsupported content');
    });
  });
});
