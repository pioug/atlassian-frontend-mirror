import { AnnotationUpdateEmitter as EditorAnnotationUpdateEmitter } from '@atlaskit/editor-common/annotation';
import {
  type AnnotationProviders as RendererAnnotationProviders,
  AnnotationUpdateEmitter as RendererAnnotationUpdateEmitter,
} from '@atlaskit/editor-common/types';
import type { AnnotationProviders as EditorAnnotationProviders } from '@atlaskit/editor-plugins/annotation';
import {
  ExampleCreateInlineCommentWithRepliesComponent,
  ExampleViewInlineCommentWithRepliesComponent,
} from '@atlaskit/editor-test-helpers/example-helpers';

const editorUpdateAnnotationSubscriber = new EditorAnnotationUpdateEmitter();
const rendererUpdateAnnotationSubscriber =
  new RendererAnnotationUpdateEmitter();

export type EditorAndRendererAnnotationProviders = {
  editorAnnotationProviders: EditorAnnotationProviders;
  rendererAnnotationProviders: RendererAnnotationProviders;
};

export function useEditorAndRendererAnnotationProviders(): {
  editorAnnotationProviders: EditorAnnotationProviders;
  rendererAnnotationProviders: RendererAnnotationProviders;
} {
  const editorAnnotationProviders: EditorAnnotationProviders = {
    inlineComment: {
      createComponent: ExampleCreateInlineCommentWithRepliesComponent,
      viewComponent: ExampleViewInlineCommentWithRepliesComponent,
      updateSubscriber: editorUpdateAnnotationSubscriber,
      getState: async () => {
        return [];
      },
      disallowOnWhitespace: true,
    },
  };

  const rendererAnnotationProviders: RendererAnnotationProviders = {
    inlineComment: {
      async getState() {
        return [];
      },
      updateSubscriber: rendererUpdateAnnotationSubscriber,
    },
  };

  return {
    editorAnnotationProviders,
    rendererAnnotationProviders,
  };
}
