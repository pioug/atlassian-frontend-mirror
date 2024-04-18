import type { JSONDocNode } from '@atlaskit/editor-json-transformer';
import type { Schema } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { EditorCommand, NextEditorPlugin, Transformer } from '../../types';

export type CorePlugin = NextEditorPlugin<
  'core',
  {
    pluginConfiguration: {
      getEditorView: () => EditorView | undefined;
    };
    actions: {
      /**
       * Dispatches an EditorCommand to ProseMirror
       *
       * @param command A function (EditorCommand | undefined) that takes an object containing a `Transaction` and returns a `Transaction` if it
       * is successful or `null` if it shouldn't be dispatched.
       * @returns (boolean) if the command was successful in dispatching
       */
      execute: (command: EditorCommand | undefined) => boolean;
      /**
       * Focuses the editor.
       *
       * Calls the focus method of the `EditorView` and scrolls the
       * current selection into view.
       *
       * @returns (boolean) if the focus was successful
       */
      focus: () => boolean;
      /**
       * Blurs the editor.
       *
       * Calls blur on the editor DOM element.
       *
       * @returns (boolean) if the blur was successful
       */
      blur: () => boolean;

      /**
       * Request the editor document.
       * The document will return when available. If called multiple times it will throttle and return the
       * latest document when ready.
       *
       * A transformer can be created using `createTransformer`.
       *
       * @param onReceive Callback to handle the document. Document type based on the transformer.
       * @param options Pass a transformer for the document to be transformed into a different format.
       */
      requestDocument<
        GenericTransformer extends Transformer<any> = Transformer<JSONDocNode>,
      >(
        onReceive: (
          document: TransformerResult<GenericTransformer> | undefined,
        ) => void,
        options?: {
          transformer?: GenericTransformer;
        },
      ): void;

      /**
       * Create a transformer
       *
       * @param schema Schema of the document
       * @returns Transformer which can be used to request a document
       */
      createTransformer<Format>(
        cb: (schema: Schema) => Transformer<Format>,
      ): Transformer<Format> | undefined;
    };
  }
>;

export type TransformerResult<GenericTransformer = Transformer<JSONDocNode>> =
  GenericTransformer extends Transformer<infer Content> ? Content : JSONDocNode;

export type InferTransformerResultCallback<
  T extends Transformer<any> | undefined,
> = (
  doc: T extends Transformer<infer U>
    ? TransformerResult<U>
    : TransformerResult<JSONDocNode>,
) => void;
export type DefaultTransformerResultCallback = (
  doc: TransformerResult<JSONDocNode> | undefined,
) => void;
