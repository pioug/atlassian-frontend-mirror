import React from 'react';
import { exampleDocumentWithText } from '../example-helpers/example-doc-with-text';
import {
  ExampleCreateInlineCommentComponent,
  ExampleViewInlineCommentComponent,
} from '@atlaskit/editor-test-helpers/example-inline-comment-component';
import { default as FullPageExample } from './5-full-page';
import { AnnotationUpdateEmitter } from '../src';

const emitter = new AnnotationUpdateEmitter();

export default function ExampleAnnotationExperiment() {
  return (
    <FullPageExample
      key={1}
      editorProps={{
        defaultValue: exampleDocumentWithText,
        allowHelpDialog: true,
        annotationProviders: {
          inlineComment: {
            createComponent: ExampleCreateInlineCommentComponent,
            viewComponent: ExampleViewInlineCommentComponent,
            updateSubscriber: emitter,
            getState: async (annotationsIds: string[]) => {
              return annotationsIds.map((id) => ({
                id,
                annotationType: 'inlineComment',
                state: { resolved: false },
              })) as any;
            },
            disallowOnWhitespace: true,
          },
        },
      }}
    />
  );
}
